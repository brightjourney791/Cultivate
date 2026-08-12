import { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Companion from '../features/companion/Companion';
import DevWorldPanel from '../features/home/DevWorldPanel';
import Landscape from '../features/home/Landscape';
import { useTodayDate } from '../hooks/useTodayDate';
import {
  getCurrentSeason,
  getCurrentTimeOfDay,
  pickRandomWeather,
  Season,
  TimeOfDay,
  Weather,
} from '../services/worldService';
import { useTaskStore } from '../store/taskStore';

const WORLD_HEIGHT = Dimensions.get('window').height * 0.68;

export default function HomeScreen() {
  const todayDate = useTodayDate();
  const [season, setSeason] = useState<Season>(getCurrentSeason(new Date(todayDate + 'T12:00:00')));

  useEffect(() => {
    setSeason(getCurrentSeason(new Date(todayDate + 'T12:00:00')));
  }, [todayDate]);

  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getCurrentTimeOfDay());
  const [weather, setWeather] = useState<Weather>(() =>
    pickRandomWeather(getCurrentSeason(new Date(todayDate + 'T12:00:00')))
  );

  useEffect(() => {
    const currentSeason = getCurrentSeason(new Date(todayDate + 'T12:00:00'));
    setWeather(pickRandomWeather(currentSeason));
  }, [todayDate]);

  const tasks = useTaskStore((state) => state.tasks);
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const toggleTask = useTaskStore((state) => state.toggleTask);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.worldSection, { height: WORLD_HEIGHT }]}>
          <Landscape season={season} timeOfDay={timeOfDay} weather={weather} />
          <View style={styles.companionLayer}>
            <Companion season={season} weather={weather} timeOfDay={timeOfDay} />
          </View>
          {__DEV__ && (
            <DevWorldPanel
              season={season}
              timeOfDay={timeOfDay}
              weather={weather}
              onSelectSeason={setSeason}
              onSelectTime={setTimeOfDay}
              onSelectWeather={setWeather}
            />
          )}
        </View>

        <View style={styles.taskSection}>
          <Text style={styles.taskSectionHeader}>Today</Text>
          {incompleteTasks.length === 0 ? (
            <Text style={styles.emptyText}>Nothing left for today.</Text>
          ) : (
            incompleteTasks.map((task) => (
              <Pressable key={task.id} onPress={() => toggleTask(task.id, todayDate)} style={styles.taskRow}>
                <View style={styles.checkbox} />
                <Text style={styles.taskText}>{task.title}</Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1, backgroundColor: '#F5F0E6' },
  scrollContent: { flexGrow: 1 },
  worldSection: { position: 'relative', overflow: 'hidden' },
  companionLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  taskSection: { padding: 20, gap: 10 },
  taskSectionHeader: { fontSize: 20, fontWeight: '600', color: '#3E3A34', marginBottom: 4 },
  emptyText: { color: '#9A9184' },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#A8C3A0' },
  taskText: { color: '#3E3A34', fontSize: 16, flexShrink: 1 },
  onboardingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});