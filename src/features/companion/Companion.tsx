import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Season, TimeOfDay, Weather } from '../../services/worldService';
import {
  AMBIENT_LINES,
  SEASON_LINES,
  TAP_REACTION_LINES,
  WEATHER_LINES,
} from './dialogueLines';

const eyesOpenImage = require('../../../assets/images/companion/lantern_keeper_open.png');
const eyesClosedImage = require('../../../assets/images/companion/lantern_keeper_closed.png');

export default function Companion({
  season,
  weather,
  timeOfDay,
}: {
  season: Season;
  weather: Weather;
  timeOfDay: TimeOfDay;
}) {
  const [eyesOpen, setEyesOpen] = useState(true);
  const [currentLine, setCurrentLine] = useState(AMBIENT_LINES[0]);
  const breathScale = useRef(new Animated.Value(1)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyesOpen(false);
      setTimeout(() => setEyesOpen(true), 120);
    }, 6000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const breathingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, { toValue: 1.02, duration: 3200, useNativeDriver: true }),
        Animated.timing(breathScale, { toValue: 1, duration: 3200, useNativeDriver: true }),
      ])
    );
    breathingLoop.start();
    return () => breathingLoop.stop();
  }, [breathScale]);

  const showBubble = (text: string) => {
    setCurrentLine(text);
    Animated.timing(bubbleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    setTimeout(() => {
      Animated.timing(bubbleOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    }, 4000);
  };

  useEffect(() => {
    const ambientInterval = setInterval(() => {
      const weatherLines = timeOfDay === 'night' ? WEATHER_LINES[weather].night : WEATHER_LINES[weather].day;
      const pool = [...AMBIENT_LINES, ...SEASON_LINES[season], ...weatherLines];
      const randomLine = pool[Math.floor(Math.random() * pool.length)];
      showBubble(randomLine);
    }, 18000);
    return () => clearInterval(ambientInterval);
  }, [season, weather, timeOfDay]);

  const handleTap = () => {
    const randomLine = TAP_REACTION_LINES[Math.floor(Math.random() * TAP_REACTION_LINES.length)];
    showBubble(randomLine);
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.bubble, { opacity: bubbleOpacity }]}>
        <Text style={styles.bubbleText}>{currentLine}</Text>
      </Animated.View>

      <Pressable onPress={handleTap}>
        <Animated.View style={[styles.companion, { transform: [{ scale: breathScale }] }]}>
          <Image
            source={eyesOpenImage}
            style={[styles.characterImage, { opacity: eyesOpen ? 1 : 0 }]}
            resizeMode="contain"
          />
          <Image
            source={eyesClosedImage}
            style={[styles.characterImage, styles.overlayImage, { opacity: eyesOpen ? 0 : 1 }]}
            resizeMode="contain"
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const CHARACTER_WIDTH = 190;
const CHARACTER_ASPECT_RATIO = 766 / 1469; // width / height, from the source art

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  bubble: {
    position: 'absolute',
    top: '-25%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: 260,
    zIndex: 2,
  },
  bubbleText: { color: '#3E3A34', fontSize: 16, textAlign: 'center' },
  companion: {
    width: CHARACTER_WIDTH,
    height: CHARACTER_WIDTH / CHARACTER_ASPECT_RATIO,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});