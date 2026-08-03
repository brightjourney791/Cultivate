import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTodayDate } from '../hooks/useTodayDate';
import { daysBetween } from '../services/dayService';
import {
  getCurrentRealm,
  getNextRealm,
  useCultivationStore,
} from '../store/cultivationStore';
import { useDevDayStore } from '../store/devDayStore';

export default function CultivationScreen() {
  const todayDate = useTodayDate();
  const totalPoints = useCultivationStore((state) => state.totalPoints);
  const startDate = useCultivationStore((state) => state.startDate);
  const addPoints = useCultivationStore((state) => state.addPoints);
  const resetAll = useCultivationStore((state) => state.resetAll);
  const resetOffset = useDevDayStore((state) => state.resetOffset);

  const handleResetAll = () => {
    resetAll();
    resetOffset();
    useCultivationStore.getState().ensureStarted(todayDate);
  };

  const daysSinceStart = startDate ? daysBetween(startDate, todayDate) : 0;
  const currentRealm = getCurrentRealm(totalPoints, daysSinceStart);
  const nextRealm = getNextRealm(currentRealm.name);

  return (
    <View style={styles.container}>
      <Text style={styles.realmName}>{currentRealm.name}</Text>
      <Text style={styles.points}>{totalPoints} cultivation points</Text>
      <Text style={styles.days}>{daysSinceStart} days together</Text>

      {nextRealm && (
        <Text style={styles.nextRealm}>
          Next: {nextRealm.name} — needs {Math.max(0, nextRealm.minPoints - totalPoints)} more points
          {daysSinceStart < nextRealm.minDays
            ? ` and ${nextRealm.minDays - daysSinceStart} more days together`
            : ''}
        </Text>
      )}

      {__DEV__ && (
        <View style={styles.devRow}>
          <Pressable onPress={() => addPoints(100)} style={styles.devButton}>
            <Text style={styles.devButtonText}>+100 points (dev)</Text>
          </Pressable>
          <Pressable onPress={handleResetAll} style={styles.devButton}>
            <Text style={styles.devButtonText}>Reset all (dev)</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E6', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 },
  realmName: { fontSize: 26, fontWeight: '600', color: '#3E3A34' },
  points: { fontSize: 18, color: '#5C5648' },
  days: { fontSize: 14, color: '#8A8272' },
  nextRealm: { fontSize: 13, color: '#8A8272', textAlign: 'center', marginTop: 10 },
  devRow: { flexDirection: 'row', gap: 10 },
  devButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginTop: 20 },
  devButtonText: { color: '#2C2A24', fontWeight: '600' },
});