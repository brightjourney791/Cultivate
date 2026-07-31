import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// A simple placeholder landscape: a soft sky gradient with layered
// rolling hills in the distance, drawn as actual curves. Real painted
// scenery will replace this later — for now it gives the companion
// an actual "place" to stand.
export default function Landscape() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={['#EAE3D2', '#F5F0E6']} style={StyleSheet.absoluteFill} />

      <View style={[styles.hillWrap, styles.hillFar]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
          <Path d="M0,30 L0,18 C20,6 40,14 55,10 C70,6 85,16 100,12 L100,30 Z" fill="#C7D6BE" />
        </Svg>
      </View>

      <View style={[styles.hillWrap, styles.hillMid]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
          <Path d="M0,30 L0,20 C15,10 35,22 50,14 C65,8 80,20 100,16 L100,30 Z" fill="#AFC7A2" />
        </Svg>
      </View>

      <View style={[styles.hillWrap, styles.hillNear]}>
        <Svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
          <Path d="M0,30 L0,22 C25,10 45,26 60,16 C75,8 90,22 100,18 L100,30 Z" fill="#8FAE82" />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hillWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  hillFar: { bottom: 40, height: 160 },
  hillMid: { bottom: 10, height: 190 },
  hillNear: { bottom: -10, height: 220 },
});