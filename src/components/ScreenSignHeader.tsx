import { Image, StyleSheet, Text, View } from 'react-native';

export default function ScreenSignHeader({ title }: { title: string }) {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require('../../assets/images/shared/sign-plate.png')}
        style={styles.sign}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  sign: { width: 320, height: 145 },
  title: {
    position: 'absolute',
    fontSize: 26,
    fontWeight: '600',
    color: '#3E3A34',
    letterSpacing: 1,
    textAlign: 'center',
    top: '35%',
  },
});