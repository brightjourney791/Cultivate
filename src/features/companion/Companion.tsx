import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Season, TimeOfDay, Weather } from '../../services/worldService';
import { useUserStore } from '../../store/userStore';
import {
  AMBIENT_LINES, getNameLines, SEASON_LINES,
  TAP_REACTION_LINES,
  WEATHER_LINES
} from './dialogueLines';

const bodyImage = require('../../../assets/images/companion/lantern_keeper_body_blank.png');
const eyesOpenImage = require('../../../assets/images/companion/lantern_keeper_eyes_open.png');
const eyesClosedSoftImage = require('../../../assets/images/companion/lantern_keeper_eyes_closed_soft.png');
const eyesSurprisedImage = require('../../../assets/images/companion/lantern_keeper_eyes_surprised.png');

export default function Companion({
  season,
  weather,
  timeOfDay,
}: {
  season: Season;
  weather: Weather;
  timeOfDay: TimeOfDay;
}) {
  const userName = useUserStore((state) => state.name);
  const [currentLine, setCurrentLine] = useState(AMBIENT_LINES[0]);
  const breathScale = useRef(new Animated.Value(1)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;

  const blinkProgress = useRef(new Animated.Value(0)).current; // 0 = open, 1 = closed
  const surprisedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const doBlink = (thenDoubleBlink: boolean) => {
      Animated.sequence([
        Animated.timing(blinkProgress, { toValue: 1, duration: 70, useNativeDriver: true }),
        Animated.delay(90),
        Animated.timing(blinkProgress, { toValue: 0, duration: 70, useNativeDriver: true }),
      ]).start(() => {
        if (thenDoubleBlink) {
          setTimeout(() => doBlink(false), 150);
        }
      });
    };

    const scheduleNextBlink = () => {
      const nextDelay = 3000 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        const isDoubleBlink = Math.random() < 0.15;
        doBlink(isDoubleBlink);
        scheduleNextBlink();
      }, nextDelay);
    };

    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, [blinkProgress]);

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
      const nameLines = userName ? getNameLines(userName) : [];
      const pool = [...AMBIENT_LINES, ...SEASON_LINES[season], ...weatherLines, ...nameLines];
      const randomLine = pool[Math.floor(Math.random() * pool.length)];
      showBubble(randomLine);
    }, 18000);
    return () => clearInterval(ambientInterval);
  }, [season, weather, timeOfDay, userName]);

  const handleTap = () => {
    const randomLine = TAP_REACTION_LINES[Math.floor(Math.random() * TAP_REACTION_LINES.length)];
    showBubble(randomLine);

    Animated.sequence([
      Animated.timing(surprisedOpacity, { toValue: 1, duration: 90, useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(surprisedOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.bubble, { opacity: bubbleOpacity }]}>
        <Text style={styles.bubbleText}>{currentLine}</Text>
      </Animated.View>

      <Pressable onPress={handleTap}>
        <Animated.View style={[styles.companion, { transform: [{ scale: breathScale }] }]}>
          <Animated.Image source={bodyImage} style={styles.bodyImage} resizeMode="contain" />

                    <Animated.Image
            source={eyesOpenImage}
            style={[
              styles.eyesImage,
              { opacity: blinkProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) },
            ]}
            resizeMode="contain"
          />
          <Animated.Image
            source={eyesClosedSoftImage}
            style={[styles.eyesImage, { opacity: blinkProgress }]}
            resizeMode="contain"
          />

          <Animated.Image
            source={eyesSurprisedImage}
            style={[styles.eyesImage, { opacity: surprisedOpacity }]}
            resizeMode="contain"
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const CHARACTER_WIDTH = 190;
const CHARACTER_ASPECT_RATIO = 1024 / 1536; // body image width / height

// Placement for the new isolated-feature expressions (closed_soft,
// closed_happy, surprised, relaxed) — all four share this exact box
// since they were cropped identically.
const EYES_WIDTH_PCT = 300 / 1024;
const EYES_LEFT_PCT = 362 / 1024;
const EYES_TOP_PCT = 250 / 1536;
const EYES_ASPECT_RATIO = 620 / 465;

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
  bodyImage: {
    width: '100%',
    height: '100%',
  },
  eyesImage: {
    position: 'absolute',
    width: `${EYES_WIDTH_PCT * 100}%`,
    left: `${EYES_LEFT_PCT * 100}%`,
    top: `${EYES_TOP_PCT * 100}%`,
    aspectRatio: EYES_ASPECT_RATIO,
  },
});