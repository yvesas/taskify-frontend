/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { Task } from "@/types/task";
import { TaskService } from "@/services/taskService";
import { globalErrorHandler } from "@/utils/globalErrorHandler";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await TaskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err: any) {
      globalErrorHandler(err);
      setError(err.message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTask = useCallback(async (newTask: Omit<Task, "id">) => {
    setIsLoading(true);
    setError(null);
    try {
      const createdTask = await TaskService.createTask(newTask);
      setTasks((prev) => [...prev, createdTask]);
      return createdTask;
    } catch (err: any) {
      setError(err.message);
      globalErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (updatedTask: Task) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await TaskService.updateTask(updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? result : task))
      );
      return result;
    } catch (err: any) {
      setError(err.message);
      globalErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await TaskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err: any) {
      setError(err.message);
      globalErrorHandler(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
  };
};
