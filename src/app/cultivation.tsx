import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTodayDate } from '../hooks/useTodayDate';
import { daysBetween } from '../services/dayService';
import {
  getCurrentRealm,
  getNextRealm,
  useCultivationStore,
} from '../store/cultivationStore';

const REALM_BACKGROUNDS: Record<string, any> = {
  'Beginning Path': require('../../assets/images/cultivation/beginning-path.png'),
  'Qi Gathering': require('../../assets/images/cultivation/qi-gathering.png'),
  'Foundation Establishment': require('../../assets/images/cultivation/foundation-establishment.png'),
  'Golden Core': require('../../assets/images/cultivation/golden-core.png'),
  'Nascent Soul': require('../../assets/images/cultivation/nascent-soul.png'),
  'Higher Realms': require('../../assets/images/cultivation/higher-realms.png'),
};

export default function CultivationScreen() {
  const todayDate = useTodayDate();
  const totalPoints = useCultivationStore((state) => state.totalPoints);
  const startDate = useCultivationStore((state) => state.startDate);
  const addPoints = useCultivationStore((state) => state.addPoints);
  const resetAll = useCultivationStore((state) => state.resetAll);

  const daysSinceStart = startDate ? daysBetween(startDate, todayDate) : 0;
  const currentRealm = getCurrentRealm(totalPoints, daysSinceStart);
  const nextRealm = getNextRealm(currentRealm.name);

  const handleResetAll = () => {
    resetAll();
    useCultivationStore.getState().ensureStarted(todayDate);
  };

  return (
    <View style={styles.screen}>
      <Image source={REALM_BACKGROUNDS[currentRealm.name]} style={styles.background} resizeMode="cover" />

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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAE3D2' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: 20, paddingBottom: 80 },
  realmName: { fontSize: 26, fontWeight: '600', color: '#3E3A34', backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12 },
  points: { fontSize: 18, color: '#3E3A34', backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 10, borderRadius: 10 },
  days: { fontSize: 14, color: '#3E3A34', backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 10, borderRadius: 10 },
  nextRealm: { fontSize: 13, color: '#3E3A34', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.5)', padding: 8, borderRadius: 10, marginTop: 6 },
  devRow: { flexDirection: 'row', gap: 10, marginTop: 20 },
  devButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  devButtonText: { color: '#2C2A24', fontWeight: '600' },
});