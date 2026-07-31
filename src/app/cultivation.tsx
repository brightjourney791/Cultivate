import { StyleSheet, Text, View } from 'react-native';

export default function CultivationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cultivation — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F0E6', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, color: '#3E3A34' },
});