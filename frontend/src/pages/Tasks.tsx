import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { taskService } from '../services/taskService';
import { categoryService } from '../services/categoryService';
import { Task, TaskFilters, PageResponse } from '../types/task';
import { Category } from '../types/category';
import TaskList from '../components/task/TaskList';
import TaskFilters as TaskFiltersComponent from '../components/task/TaskFilters';
import TaskModal from '../components/task/TaskModal';
import Pagination from '../components/common/Pagination';

function Tasks() {
  const [tasks, setTasks] = useState<PageResponse<Task> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [currentPage, pageSize, filters, sortBy, sortDir]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(currentPage, pageSize, filters, sortBy, sortDir);
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleTaskSaved = () => {
    setModalOpen(false);
    setSelectedTask(null);
    loadTasks();
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        loadTasks();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading && !tasks) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setModalOpen(true)}
        >
          New Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TaskFiltersComponent
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {tasks && (
        <>
          <TaskList
            tasks={tasks.content}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />

          <Pagination
            currentPage={tasks.pageNumber}
            totalPages={tasks.totalPages}
            pageSize={tasks.pageSize}
            totalElements={tasks.totalElements}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(0);
            }}
          />
        </>
      )}

      <TaskModal
        open={modalOpen}
        task={selectedTask}
        categories={categories}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskSaved}
      />
    </Container>
  );
}

export default Tasks;