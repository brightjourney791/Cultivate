import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStorage } from '../services/safeStorage';

type UserStore = {
  name: string | null;
  hasOnboarded: boolean;
  hasHydrated: boolean;
  setName: (name: string) => void;
  completeOnboarding: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      name: null,
      hasOnboarded: false,
      hasHydrated: false,
      setName: (name) => set({ name }),
      completeOnboarding: () => set({ hasOnboarded: true }),
    }),
    {
      name: 'cultivate-user',
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => () => {
        useUserStore.setState({ hasHydrated: true });
      },
    }
  )
);