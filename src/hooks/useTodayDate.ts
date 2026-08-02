import { useEffect } from 'react';
import { getCultivationDate } from '../services/dayService';
import { useDevDayStore } from '../store/devDayStore';
import { useTaskStore } from '../store/taskStore';

// Any screen that needs "what day is it right now" (plus the daily
// task reset) uses this instead of duplicating the logic itself.
export function useTodayDate(): string {
  const dayOffset = useDevDayStore((state) => state.dayOffset);
  const runDailyReset = useTaskStore((state) => state.runDailyReset);

  const simulatedDate = new Date();
  simulatedDate.setDate(simulatedDate.getDate() + dayOffset);
  const todayDate = getCultivationDate(simulatedDate);

  useEffect(() => {
    runDailyReset(todayDate);
  }, [todayDate]);

  return todayDate;
}