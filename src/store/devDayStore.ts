import { create } from 'zustand';

type DevDayStore = {
  dayOffset: number;
  advanceDay: () => void;
  resetOffset: () => void;
};

export const useDevDayStore = create<DevDayStore>((set) => ({
  dayOffset: 0,
  advanceDay: () => set((state) => ({ dayOffset: state.dayOffset + 1 })),
  resetOffset: () => set({ dayOffset: 0 }),
}));