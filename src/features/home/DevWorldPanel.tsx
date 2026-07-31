import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Season, TimeOfDay, Weather } from '../../services/worldService';

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
const TIMES: TimeOfDay[] = ['morning', 'afternoon', 'sunset', 'night'];
const WEATHERS: Weather[] = ['sunny', 'cloudy', 'rain', 'fog', 'snow', 'wind'];

export default function DevWorldPanel({
  onSelectSeason,
  onSelectTime,
  onSelectWeather,
}: {
  onSelectSeason: (season: Season) => void;
  onSelectTime: (time: TimeOfDay) => void;
  onSelectWeather: (weather: Weather) => void;
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {SEASONS.map((season) => (
          <Pressable key={season} onPress={() => onSelectSeason(season)} style={styles.button}>
            <Text style={styles.text}>{season}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {TIMES.map((time) => (
          <Pressable key={time} onPress={() => onSelectTime(time)} style={styles.button}>
            <Text style={styles.text}>{time}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        {WEATHERS.map((weather) => (
          <Pressable key={weather} onPress={() => onSelectWeather(weather)} style={styles.button}>
            <Text style={styles.text}>{weather}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 20, alignSelf: 'center', gap: 6 },
  row: { flexDirection: 'row', gap: 8, backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 12 },
  button: { paddingHorizontal: 10, paddingVertical: 6 },
  text: { color: 'white', fontSize: 12, textTransform: 'capitalize' },
});