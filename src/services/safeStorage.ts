import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

// Some environments (like the brief Node.js step used when opening the
// web version via a dev build) run our code where "window" doesn't
// exist. AsyncStorage's web version assumes a browser and crashes if
// it's missing — this wrapper just safely does nothing in that case,
// instead of crashing.
export const safeStorage: StateStorage = {
  getItem: async (name) => {
    if (typeof window === 'undefined') return null;
    return AsyncStorage.getItem(name);
  },
  setItem: async (name, value) => {
    if (typeof window === 'undefined') return;
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => {
    if (typeof window === 'undefined') return;
    await AsyncStorage.removeItem(name);
  },
};