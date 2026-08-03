import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { toDateString } from '../services/dayService';
import { safeStorage } from '../services/safeStorage';
import { useCultivationStore } from './cultivationStore';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  repeatEveryDays: number | null;
  nextDueDate: string | null;
};

type TaskStore = {
  tasks: Task[];
  lastResetDate: string | null;
  addTask: (title: string, repeatEveryDays: number | null) => void;
  toggleTask: (id: string, todayDate: string) => void;
  deleteTask: (id: string) => void;
  runDailyReset: (todayDate: string) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      lastResetDate: null,

      addTask: (title, repeatEveryDays) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: Date.now().toString(), title, completed: false, repeatEveryDays, nextDueDate: null },
          ],
        })),

      toggleTask: (id, todayDate) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const willBeCompleted = !task.completed;

            if (willBeCompleted && task.repeatEveryDays) {
              const next = new Date(todayDate + 'T00:00:00');
              next.setDate(next.getDate() + task.repeatEveryDays);
              return { ...task, completed: true, nextDueDate: toDateString(next) };
            }
            return { ...task, completed: willBeCompleted };
          }),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),

      // Runs once per real day-transition. Before touching anything,
      // it evaluates how the day that just ended went (were all tasks
      // done? some? none?) and awards cultivation points for that —
      // THEN performs the existing reset (clear one-time completed
      // tasks, reset repeating ones that are due).
      runDailyReset: (todayDate) =>
        set((state) => {
          if (state.lastResetDate === todayDate) {
            return state; // already processed this day, don't double-count
          }

          if (state.tasks.length > 0) {
            const completedCount = state.tasks.filter((t) => t.completed).length;
            if (completedCount === state.tasks.length) {
              useCultivationStore.getState().awardDayCompletion('full');
            } else if (completedCount > 0) {
              useCultivationStore.getState().awardDayCompletion('partial');
            }
          }

          const updatedTasks = state.tasks.reduce<Task[]>((result, task) => {
            if (!task.completed) {
              result.push(task);
              return result;
            }
            if (!task.repeatEveryDays) {
              return result;
            }
            if (task.nextDueDate && task.nextDueDate <= todayDate) {
              result.push({ ...task, completed: false, nextDueDate: null });
            } else {
              result.push(task);
            }
            return result;
          }, []);

          return { tasks: updatedTasks, lastResetDate: todayDate };
        }),
    }),
    { name: 'cultivate-tasks', storage: createJSONStorage(() => safeStorage) }
  )
);