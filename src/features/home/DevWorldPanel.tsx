import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Season, TimeOfDay, Weather } from '../../services/worldService';

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const TIMES: TimeOfDay[] = ['morning', 'afternoon', 'sunset', 'night'];
const WEATHERS: Weather[] = ['sunny', 'cloudy', 'rain', 'fog', 'snow', 'wind'];

export default function DevWorldPanel({
  season,
  timeOfDay,
  weather,
  onSelectSeason,
  onSelectTime,
  onSelectWeather,
}: {
  season: Season;
  timeOfDay: TimeOfDay;
  weather: Weather;
  onSelectSeason: (season: Season) => void;
  onSelectTime: (time: TimeOfDay) => void;
  onSelectWeather: (weather: Weather) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.summary}>
        Current: {season} · {timeOfDay} · {weather}
      </Text>

      <View style={styles.row}>
        {SEASONS.map((s) => (
          <Pressable key={s} onPress={() => onSelectSeason(s)} style={[styles.button, s === season && styles.buttonActive]}>
            <Text style={styles.text}>{s}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {TIMES.map((t) => (
          <Pressable key={t} onPress={() => onSelectTime(t)} style={[styles.button, t === timeOfDay && styles.buttonActive]}>
            <Text style={styles.text}>{t}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {WEATHERS.map((w) => (
          <Pressable key={w} onPress={() => onSelectWeather(w)} style={[styles.button, w === weather && styles.buttonActive]}>
            <Text style={styles.text}>{w}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 20, alignSelf: 'center', gap: 6 },
  summary: { color: 'white', fontSize: 12, textAlign: 'center', marginBottom: 2 },
  row: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 12 },
  button: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  buttonActive: { backgroundColor: '#A8C3A0' },
  text: { color: 'white', fontSize: 12, textTransform: 'capitalize' },
});