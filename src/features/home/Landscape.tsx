import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Season, TimeOfDay, Weather } from '../../services/worldService';

type SeasonColorSet = {
  sky: [string, string];
  hillFar: string;
  hillMid: string;
  hillNear: string;
};

const SEASON_COLORS: Record<Season, SeasonColorSet> = {
  spring: { sky: ['#EAF0E0', '#F7F3E8'], hillFar: '#C7D6BE', hillMid: '#AFC7A2', hillNear: '#8FAE82' },
  summer: { sky: ['#EFEAD6', '#FBF7EA'], hillFar: '#B9CDA0', hillMid: '#9DBD7E', hillNear: '#7CA85C' },
  autumn: { sky: ['#F0DCC0', '#FBEEDD'], hillFar: '#D9C08A', hillMid: '#C79F5E', hillNear: '#B98346' },
  winter: { sky: ['#DCE3EA', '#F0F3F6'], hillFar: '#DCE3D9', hillMid: '#C7D2C4', hillNear: '#AAB8A6' },
};

const TIME_OVERLAY: Record<TimeOfDay, string> = {
  morning: 'rgba(255, 244, 214, 0.15)',
  afternoon: 'rgba(255, 255, 255, 0)',
  sunset: 'rgba(255, 140, 90, 0.25)',
  night: 'rgba(20, 30, 60, 0.55)',
};

// A translucent wash for weather, same idea as the time-of-day tint —
// layered on top of everything else.
const WEATHER_OVERLAY: Record<Weather, string> = {
  sunny: 'rgba(255, 255, 255, 0)',
  cloudy: 'rgba(150, 155, 160, 0.25)',
  rain: 'rgba(80, 95, 110, 0.35)',
  fog: 'rgba(210, 210, 205, 0.55)',
  snow: 'rgba(255, 255, 255, 0.35)',
  wind: 'rgba(255, 255, 255, 0)',
};

export default function Landscape({
  season,
  timeOfDay,
  weather,
}: {
  season: Season;
  timeOfDay: TimeOfDay;
  weather: Weather;
}) {
  const colors = SEASON_COLORS[season];

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={colors.sky} style={StyleSheet.absoluteFill} />

      <View style={[styles.hillWrap, styles.hillFar]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
          <Path d="M0,30 L0,18 C20,6 40,14 55,10 C70,6 85,16 100,12 L100,30 Z" fill={colors.hillFar} />
        </Svg>
      </View>

      <View style={[styles.hillWrap, styles.hillMid]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
          <Path d="M0,30 L0,20 C15,10 35,22 50,14 C65,8 80,20 100,16 L100,30 Z" fill={colors.hillMid} />
        </Svg>
      </View>

      <View style={[styles.hillWrap, styles.hillNear]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
          <Path d="M0,30 L0,22 C25,10 45,26 60,16 C75,8 90,22 100,18 L100,30 Z" fill={colors.hillNear} />
        </Svg>
      </View>

      <View style={[StyleSheet.absoluteFill, { backgroundColor: WEATHER_OVERLAY[weather] }]} pointerEvents="none" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: TIME_OVERLAY[timeOfDay] }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  hillWrap: { position: 'absolute', left: 0, right: 0 },
  hillFar: { bottom: 40, height: 160 },
  hillMid: { bottom: 10, height: 190 },
  hillNear: { bottom: -10, height: 220 },
});