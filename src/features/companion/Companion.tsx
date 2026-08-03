import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Season, TimeOfDay, Weather } from '../../services/worldService';
import {
  AMBIENT_LINES,
  SEASON_LINES,
  TAP_REACTION_LINES,
  WEATHER_LINES,
} from './dialogueLines';

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
      setTimeout(() => setEyesOpen(true), 200);
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const breathingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, { toValue: 1.04, duration: 2000, useNativeDriver: true }),
        Animated.timing(breathScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
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
    // Every 18 seconds, say something drawn from a pool combining the
    // general ambient lines with whatever's relevant to the current
    // season and weather. Picked randomly, so it varies each time.
    const ambientInterval = setInterval(() => {
      const weatherLines = timeOfDay === 'night' ? WEATHER_LINES[weather].night : WEATHER_LINES[weather].day;
      const pool = [...AMBIENT_LINES, ...SEASON_LINES[season], ...weatherLines];
      const randomLine = pool[Math.floor(Math.random() * pool.length)];
      showBubble(randomLine);
    }, 18000);
    return () => clearInterval(ambientInterval);
  }, [season, weather]);

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
          <View style={styles.eyesRow}>
            <View style={[styles.eye, !eyesOpen && styles.eyeClosed]} />
            <View style={[styles.eye, !eyesOpen && styles.eyeClosed]} />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  bubble: {
    position: 'absolute',
    top: '-60%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: 260,
  },
  bubbleText: { color: '#3E3A34', fontSize: 16, textAlign: 'center' },
  companion: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#A8C3A0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyesRow: { flexDirection: 'row', gap: 24 },
  eye: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#3E3A34' },
  eyeClosed: { height: 2 },
});