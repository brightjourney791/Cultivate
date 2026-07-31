import { StyleSheet, Text, View } from 'react-native';

export default function MemoryAlbumScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Memory Album — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E6', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, color: '#3E3A34' },
});