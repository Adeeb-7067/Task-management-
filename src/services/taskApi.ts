import { api } from './api';
import { Task, NewTask } from '../types';

export const taskApi = {
  getTasks: async () => {
    try {
      const response = await api.get<Task[]>('/api/tasks');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
    }
  },

  createTask: async (task: NewTask) => {
    try {
      const taskWithStatus = {
        ...task,
        status: 'incomplete' as const
      };
      const response = await api.post<Task>('/api/tasks', taskWithStatus);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to create task');
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await api.patch<Task>(`/api/tasks/${taskId}`, updates);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update task');
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to delete task');
    }
  }
};
