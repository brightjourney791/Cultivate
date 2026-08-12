import { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useUserStore } from '../../store/userStore';

function OnboardingBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.background}>
      <Image
        source={require('../../../assets/images/onboarding/background.png')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
        resizeMode="cover"
      />
      {children}
    </View>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState<'welcome' | 'name'>('welcome');
  const [nameInput, setNameInput] = useState('');
  const inputRef = useRef<TextInput>(null);
  const setName = useUserStore((state) => state.setName);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const handleFinish = () => {
    const trimmed = nameInput.trim();
    if (trimmed.length === 0) return;
    inputRef.current?.blur();
    setTimeout(() => {
      setName(trimmed);
      completeOnboarding();
    }, 300);
  };

  if (step === 'welcome') {
    return (
      <OnboardingBackground>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Cultivate</Text>
          <Text style={styles.subtitle}>Begin your journey with a companion.</Text>
          <Pressable onPress={() => setStep('name')} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </OnboardingBackground>
    );
  }

  return (
    <OnboardingBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        <Text style={styles.title}>What should we call you, cultivator?</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Enter your name..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={nameInput}
          onChangeText={setNameInput}
          onSubmitEditing={handleFinish}
          returnKeyType="done"
        />
        <Pressable onPress={() => { setName('Test'); completeOnboarding(); }} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 20 },
  title: { fontSize: 24, fontWeight: '600', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  button: { backgroundColor: '#A8C3A0', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 20 },
  buttonText: { color: '#2C2A24', fontWeight: '600', fontSize: 16 },
});