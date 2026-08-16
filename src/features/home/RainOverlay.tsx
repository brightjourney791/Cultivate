import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

const rainTexture = require('../../../assets/images/weather/rain.png');

const TILE_HEIGHT = 500; // rendered height of each tile on screen
const PIXELS_PER_SECOND = 280; // lower = slower rain, higher = faster rain

export default function RainOverlay({ containerHeight }: { containerHeight: number }) {
  const rawTranslate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate across a very large distance once, instead of looping a short
    // animation — this avoids the restart hitch entirely for practical purposes.
    const totalDistance = 200000;
    const totalDuration = (totalDistance / PIXELS_PER_SECOND) * 1000;

    const anim = Animated.timing(rawTranslate, {
      toValue: totalDistance,
      duration: totalDuration,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [rawTranslate]);

  const translateY = Animated.modulo(rawTranslate, TILE_HEIGHT);

  const tileCount = Math.ceil(containerHeight / TILE_HEIGHT) + 2;

  return (
    <Animated.View pointerEvents="none" style={[styles.wrapper, { transform: [{ translateY }] }]}>
      {Array.from({ length: tileCount }).map((_, i) => (
        <Animated.Image
          key={i}
          source={rainTexture}
          style={[styles.tile, { top: (i - 1) * TILE_HEIGHT }]}
          resizeMode="cover"
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tile: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: TILE_HEIGHT,
  },
});