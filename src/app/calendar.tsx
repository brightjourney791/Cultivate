import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenSignHeader from '../components/ScreenSignHeader';
import { useTodayDate } from '../hooks/useTodayDate';
import { getDaysInMonth, getFirstWeekdayOfMonth, toDateString } from '../services/dayService';
import { useCalendarStore } from '../store/calendarStore';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STAMP_IMAGES: Record<string, any> = {
  lantern: require('../../assets/images/calendar/stamps/lantern.png'),
  leaf: require('../../assets/images/calendar/stamps/leaf.png'),
  flower: require('../../assets/images/calendar/stamps/flower.png'),
  moon: require('../../assets/images/calendar/stamps/moon.png'),
  feather: require('../../assets/images/calendar/stamps/feather.png'),
  bamboo: require('../../assets/images/calendar/stamps/bamboo.png'),
};

export default function CalendarScreen() {
  const todayDate = useTodayDate();
  const history = useCalendarStore((state) => state.history);
  const resetHistory = useCalendarStore((state) => state.resetHistory);
  const [viewDate, setViewDate] = useState(() => new Date(todayDate + 'T12:00:00'));

  useEffect(() => {
    setViewDate(new Date(todayDate + 'T12:00:00'));
  }, [todayDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = getFirstWeekdayOfMonth(year, month);

  const goToPreviousMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dayCells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.screen}>
      <Image source={require('../../assets/images/calendar/background.png')} style={styles.background} resizeMode="cover" />

      <View style={styles.container}>
        <ScreenSignHeader title="Calendar" />

        <View style={styles.monthRow}>
          <Pressable onPress={goToPreviousMonth} style={styles.monthButton}>
            <Text style={styles.monthButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.monthLabel}>{MONTH_NAMES[month]} {year}</Text>
          <Pressable onPress={goToNextMonth} style={styles.monthButton}>
            <Text style={styles.monthButtonText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((label, i) => (
            <Text key={i} style={styles.weekdayLabel}>{label}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {dayCells.map((day, index) => {
            if (day === null) return <View key={index} style={styles.cell} />;

            const dateString = toDateString(new Date(year, month, day));
            const record = history[dateString];

            const isToday = dateString === todayDate;

            return (
              <View key={index} style={styles.cell}>
                {record && (
                  <View style={styles.stampWrap}>
                    <Image source={STAMP_IMAGES[record.icon]} style={styles.stampImage} resizeMode="contain" />
                    <View
                      style={[
                        styles.stampTint,
                        { backgroundColor: record.tier === 'full' ? 'rgba(212,175,55,0.35)' : 'rgba(180,180,170,0.35)' },
                      ]}
                    />
                  </View>
                )}
                <Text style={[styles.dayNumber, isToday && styles.dayNumberToday]}>{day}</Text>
              </View>
            );
          })}
        </View>

        {__DEV__ && (
          <Pressable
            onPress={() => {
              resetHistory();
              setViewDate(new Date(todayDate + 'T12:00:00'));
            }}
            style={styles.devButton}
          >
            <Text style={styles.devButtonText}>Reset calendar (dev)</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const CELL_SIZE = '14.28%'; // 100% / 7 columns

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EAE3D2' },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  container: { flex: 1, paddingTop: 85, paddingHorizontal: 16 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 14 },
  monthButton: { paddingHorizontal: 14, paddingVertical: 4 },
  monthButtonText: { fontSize: 22, color: '#3E3A34' },
  monthLabel: { fontSize: 17, fontWeight: '600', color: '#3E3A34', minWidth: 150, textAlign: 'center' },
  weekdayRow: { flexDirection: 'row' },
  weekdayLabel: { width: CELL_SIZE, textAlign: 'center', fontSize: 12, color: '#8A8272', marginBottom: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL_SIZE, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dayNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3E3A34',
    width: 22,
    height: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 11,
  },
  dayNumberToday: {
    backgroundColor: '#A8C3A0',
    color: '#2C2A24',
    fontWeight: '700',
    overflow: 'hidden',
  },
  stampWrap: { position: 'absolute', top: '2%', left: '2%', right: '2%', bottom: '2%' },
  stampImage: { width: '100%', height: '100%' },
  stampTint: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 8 },
  devButton: { backgroundColor: '#A8C3A0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignSelf: 'center', marginTop: 16 },
  devButtonText: { color: '#2C2A24', fontWeight: '600' },
});