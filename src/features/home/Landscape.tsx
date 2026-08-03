import { Dimensions, StyleSheet, View } from 'react-native';
import { Season, TimeOfDay, Weather } from '../../services/worldService';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Only summer has real art so far — the others temporarily reuse it
// as a placeholder. Swap any of these to real art later with no
// other code changes needed.
const summerDay = require('../../../assets/images/home/summer-day.png');
const summerNight = require('../../../assets/images/home/summer-night.png');
const springDay = require('../../../assets/images/home/spring-day.png');
const springNight = require('../../../assets/images/home/spring-night.png');
const autumnDay = require('../../../assets/images/home/autumn-day.png');
const autumnNight = require('../../../assets/images/home/autumn-night.png');
const winterDay = require('../../../assets/images/home/winter-day.png');
const winterNight = require('../../../assets/images/home/winter-night.png');

const SEASON_BACKGROUNDS: Record<Season, { day: any; night: any }> = {
  spring: { day: springDay, night: springNight },
  summer: { day: summerDay, night: summerNight },
  autumn: { day: autumnDay, night: autumnNight },
  winter: { day: winterDay, night: winterNight },
};

// A translucent tint layered over the "day" image for morning/sunset.
// Night uses a dedicated real night image instead, so it stays untinted.
const TIME_OVERLAY: Record<TimeOfDay, string> = {
  morning: 'rgba(255, 244, 214, 0.15)',
  afternoon: 'rgba(255, 255, 255, 0)',
  sunset: 'rgba(209, 128, 93, 0.25)',
  night: 'rgba(0, 0, 0, 0)',
};

const WEATHER_OVERLAY: Record<Weather, string> = {
  sunny: 'rgba(255, 255, 255, 0)',
  cloudy: 'rgba(150, 155, 160, 0.25)',
  rain: 'rgba(80, 95, 110, 0.35)',
  fog: 'rgba(210, 210, 205, 0.33)',
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
  const backgrounds = SEASON_BACKGROUNDS[season];
  const image = timeOfDay === 'night' ? backgrounds.night : backgrounds.day;

  return (
    <View style={styles.clipWindow}>
      <Image image={image} height={SCREEN_HEIGHT} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: WEATHER_OVERLAY[weather] }]} pointerEvents="none" />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: TIME_OVERLAY[timeOfDay] }]} pointerEvents="none" />
    </View>
  );
}

// Small internal helper: renders the background image at full screen
// height, anchored to the BOTTOM of the (shorter) visible window —
// so the top of the image (the sky) naturally extends past the top
// of the window and gets clipped, instead of the image being squished.
function Image({ image, height }: { image: any; height: number }) {
  const { Image: RNImage } = require('react-native');
  return (
    <RNImage
      source={image}
      resizeMode="cover"
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height }}
    />
  );
}

const styles = StyleSheet.create({
  clipWindow: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
});