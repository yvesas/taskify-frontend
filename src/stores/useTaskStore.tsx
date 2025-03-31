import { create } from "zustand";
import { Task } from "@/types/task";
import { TaskService } from "@/services/taskService";
import { globalErrorHandler } from "@/utils/globalErrorHandler";

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (newTask: Omit<Task, "id">) => Promise<Task | undefined>;
  updateTask: (updatedTask: Task) => Promise<Task | undefined>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true });
    try {
      const fetchedTasks = await TaskService.getTasks();
      set({ tasks: fetchedTasks });
    } catch (err) {
      globalErrorHandler(err);
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (newTask) => {
    set({ isLoading: true });
    try {
      const createdTask = await TaskService.createTask(newTask);
      set((state) => ({ tasks: [...state.tasks, createdTask] }));
      return createdTask;
    } catch (err) {
      globalErrorHandler(err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (updatedTask) => {
    set({ isLoading: true });
    try {
      const result = await TaskService.updateTask(updatedTask);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === updatedTask.id ? { ...task, ...result } : task
        ),
      }));
      return result;
    } catch (err) {
      globalErrorHandler(err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true });
    try {
      await TaskService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (err) {
      globalErrorHandler(err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
