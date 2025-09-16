export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  dueDate?: string;
  reminderDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  createdByName: string;
  updatedByName: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  priority?: Priority;
  categoryId?: number;
  dueDate?: string;
  reminderDate?: string;
}

export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  categoryId?: number;
  dueDate?: string;
  reminderDate?: string;
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  categoryId?: number;
  search?: string;
  dueFrom?: string;
  dueTo?: string;
}

export interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}