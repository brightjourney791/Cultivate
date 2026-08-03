import { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Companion from '../features/companion/Companion';
import DevWorldPanel from '../features/home/DevWorldPanel';
import Landscape from '../features/home/Landscape';
import { useTodayDate } from '../hooks/useTodayDate';
import {
  getCurrentSeason,
  getCurrentTimeOfDay,
  Season,
  TimeOfDay,
  Weather,
} from '../services/worldService';
import { useTaskStore } from '../store/taskStore';

const WORLD_HEIGHT = Dimensions.get('window').height * 0.68;

export default function HomeScreen() {
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getCurrentTimeOfDay());
  const [weather, setWeather] = useState<Weather>('sunny');
  const todayDate = useTodayDate();

  const tasks = useTaskStore((state) => state.tasks);
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const toggleTask = useTaskStore((state) => state.toggleTask);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.worldSection, { height: WORLD_HEIGHT }]}>
        <Landscape season={season} timeOfDay={timeOfDay} weather={weather} />
        <View style={styles.companionLayer}>
          <Companion season={season} weather={weather} />
        </View>
        {__DEV__ && (
          <DevWorldPanel onSelectSeason={setSeason} onSelectTime={setTimeOfDay} onSelectWeather={setWeather} />
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
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F5F0E6' },
  scrollContent: { flexGrow: 1 },
  worldSection: { position: 'relative', overflow: 'hidden' },
  companionLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
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
});