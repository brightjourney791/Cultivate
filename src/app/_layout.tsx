import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import Onboarding from '@/features/onboarding/Onboarding';
import { useUserStore } from '@/store/userStore';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const hasOnboarded = useUserStore((state) => state.hasOnboarded);
  const hasHydrated = useUserStore((state) => state.hasHydrated);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {hasHydrated && (hasOnboarded ? <AppTabs /> : <Onboarding />)}
    </ThemeProvider>
  );
}