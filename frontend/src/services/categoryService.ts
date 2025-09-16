import api from './api';
import { Category, CategoryRequest } from '../types/category';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  },

  async createCategory(category: CategoryRequest): Promise<Category> {
    const response = await api.post('/categories', category);
    return response.data;
  },

  async updateCategory(id: number, category: CategoryRequest): Promise<Category> {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};