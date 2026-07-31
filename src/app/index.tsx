import { StyleSheet, View } from 'react-native';
import Companion from '../features/companion/Companion';
import Landscape from '../features/home/Landscape';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Landscape />
      <View style={styles.companionLayer}>
        <Companion />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  companionLayer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});