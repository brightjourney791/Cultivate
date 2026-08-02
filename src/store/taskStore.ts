import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  repeatEveryDays: number | null; // null = one-time task
  nextDueDate: string | null; // only meaningful once a repeating task is completed
};

type TaskStore = {
  tasks: Task[];
  addTask: (title: string, repeatEveryDays: number | null) => void;
  toggleTask: (id: string, todayDate: string) => void;
  deleteTask: (id: string) => void;
  runDailyReset: (todayDate: string) => void;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],

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
              // Completing a repeating task: schedule when it comes back
              const next = new Date(todayDate + 'T00:00:00');
              next.setDate(next.getDate() + task.repeatEveryDays);
              return { ...task, completed: true, nextDueDate: next.toISOString().split('T')[0] };
            }

            return { ...task, completed: willBeCompleted };
          }),
        })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),

      // The nightly (3am) reset. Incomplete tasks are never touched.
      // Completed one-time tasks are cleared out. Completed repeating
      // tasks reset back to active once their nextDueDate arrives.
      runDailyReset: (todayDate) =>
        set((state) => ({
          tasks: state.tasks.reduce<Task[]>((result, task) => {
            if (!task.completed) {
              result.push(task);
              return result;
            }
            if (!task.repeatEveryDays) {
              return result; // one-time + completed → cleared
            }
            if (task.nextDueDate && task.nextDueDate <= todayDate) {
              result.push({ ...task, completed: false, nextDueDate: null });
            } else {
              result.push(task); // repeating, completed, not due yet
            }
            return result;
          }, []),
        })),
    }),
    { name: 'cultivate-tasks', storage: createJSONStorage(() => AsyncStorage) }
  )
);