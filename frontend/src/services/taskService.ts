import api from './api';
import { Task, TaskCreateRequest, TaskUpdateRequest, TaskFilters, DashboardStats, PageResponse } from '../types/task';

export const taskService = {
  async getTasks(
    page: number = 0,
    size: number = 10,
    filters: TaskFilters = {},
    sortBy: string = 'createdAt',
    sortDir: string = 'desc'
  ): Promise<PageResponse<Task>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: `${sortBy},${sortDir}`,
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/tasks?${params}`);
    return response.data;
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(task: TaskCreateRequest): Promise<Task> {
    const response = await api.post('/tasks', task);
    return response.data;
  },

  async updateTask(id: number, task: TaskUpdateRequest): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  },

  async updateTaskStatus(id: number, status: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/tasks/dashboard');
    return response.data;
  },
};