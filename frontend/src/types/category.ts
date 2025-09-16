export interface Category {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  taskCount?: number;
}

export interface CategoryRequest {
  name: string;
  color?: string;
}