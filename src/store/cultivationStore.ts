import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStorage } from '../services/safeStorage';

export const FULL_DAY_POINTS = 10;
export const PARTIAL_DAY_POINTS = 5;

export const REALMS = [
  { name: 'Beginning Path', minPoints: 0, minDays: 0 },
  { name: 'Qi Gathering', minPoints: 50, minDays: 14 },
  { name: 'Foundation Establishment', minPoints: 250, minDays: 60 },
  { name: 'Golden Core', minPoints: 800, minDays: 180 },
  { name: 'Nascent Soul', minPoints: 1800, minDays: 365 },
  { name: 'Higher Realms', minPoints: 4000, minDays: 730 },
] as const;

type CultivationStore = {
  totalPoints: number;
  startDate: string | null;
  hasHydrated: boolean;
  ensureStarted: (today: string) => void;
  addPoints: (amount: number) => void;
  awardDayCompletion: (tier: 'full' | 'partial') => void;
  resetAll: () => void;
};

export const useCultivationStore = create<CultivationStore>()(
  persist(
    (set) => ({
      totalPoints: 0,
      startDate: null,
      hasHydrated: false,

      ensureStarted: (today) =>
        set((state) => (state.startDate ? {} : { startDate: today })),

      addPoints: (amount) =>
        set((state) => ({ totalPoints: Math.max(0, state.totalPoints + amount) })),

      awardDayCompletion: (tier) =>
        set((state) => ({
          totalPoints: state.totalPoints + (tier === 'full' ? FULL_DAY_POINTS : PARTIAL_DAY_POINTS),
        })),

      resetAll: () => set({ totalPoints: 0, startDate: null }),
    }),
    {
      name: 'cultivate-cultivation',
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => () => {
        useCultivationStore.setState({ hasHydrated: true });
      },
    }
  )
);

export function getCurrentRealm(totalPoints: number, daysSinceStart: number) {
  let current: (typeof REALMS)[number] = REALMS[0];
  for (const realm of REALMS) {
    if (totalPoints >= realm.minPoints && daysSinceStart >= realm.minDays) {
      current = realm;
    }
  }
  return current;
}

export function getNextRealm(currentRealmName: string) {
  const index = REALMS.findIndex((r) => r.name === currentRealmName);
  return index >= 0 && index < REALMS.length - 1 ? REALMS[index + 1] : null;
}