import { create } from 'zustand';

// Dev-only tool: lets us simulate days passing instantly, instead of
// waiting for real time to test daily task resets. Never shown outside
// of __DEV__.
type DevDayStore = {
  dayOffset: number;
  advanceDay: () => void;
};

export const useDevDayStore = create<DevDayStore>((set) => ({
  dayOffset: 0,
  advanceDay: () => set((state) => ({ dayOffset: state.dayOffset + 1 })),
}));