import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { safeStorage } from '../services/safeStorage';

export type DayTier = 'full' | 'partial';
export type DayRecord = { tier: DayTier; icon: string };

const STAMP_ICONS = ['lantern', 'leaf', 'flower', 'moon', 'feather', 'bamboo'];

type CalendarStore = {
  history: Record<string, DayRecord>;
  recordDay: (date: string, tier: DayTier) => void;
  resetHistory: () => void;
};

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      history: {},

      // Called once per completed day. The specific icon is chosen
      // randomly ONCE and saved permanently with that day, so it
      // never changes on future visits — same "oh, that was the
      // flower day" surprise every time you look back.
      recordDay: (date, tier) =>
        set((state) => ({
          history: {
            ...state.history,
            [date]: { tier, icon: STAMP_ICONS[Math.floor(Math.random() * STAMP_ICONS.length)] },
          },
        })),

      resetHistory: () => set({ history: {} }),
    }),
    { name: 'cultivate-calendar', storage: createJSONStorage(() => safeStorage) }
  )
);