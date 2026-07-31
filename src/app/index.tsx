import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Companion from '../features/companion/Companion';
import DevWorldPanel from '../features/home/DevWorldPanel';
import Landscape from '../features/home/Landscape';
import {
  getCurrentSeason,
  getCurrentTimeOfDay,
  Season,
  TimeOfDay,
  Weather,
} from '../services/worldService';

export default function HomeScreen() {
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getCurrentTimeOfDay());
  const [weather, setWeather] = useState<Weather>('sunny');

  return (
    <View style={styles.container}>
      <Landscape season={season} timeOfDay={timeOfDay} weather={weather} />
      <View style={styles.companionLayer}>
        <Companion />
      </View>
      {__DEV__ && (
        <DevWorldPanel onSelectSeason={setSeason} onSelectTime={setTimeOfDay} onSelectWeather={setWeather} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  companionLayer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});