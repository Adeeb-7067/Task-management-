import { useState, useCallback, useEffect } from 'react';
import { Task, NewTask } from '../types';
import { taskApi } from '../services/taskApi';

export const useTasks = (token: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchTasks = useCallback(async () => {
    try {
      const tasks = await taskApi.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, []);

  const addTask = useCallback(async (taskData: NewTask) => {
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskApi.updateTask(taskId, updates);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (error) {
      throw error;
    }
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.status === 'incomplete';
    if (filter === 'completed') return task.status === 'complete';
    return true;
  });

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [fetchTasks, token]);

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
  };
};
