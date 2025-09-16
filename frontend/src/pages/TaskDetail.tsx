import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';
import { taskService } from '../services/taskService';
import { Task, Priority, Status } from '../types/task';
import { format } from 'date-fns';

function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadTask(parseInt(id));
    }
  }, [id]);

  const loadTask = async (taskId: number) => {
    try {
      setLoading(true);
      const data = await taskService.getTask(taskId);
      setTask(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task.id);
        navigate('/tasks');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container>
        <Typography variant="h6">Task not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/tasks')}
          sx={{ mr: 2 }}
        >
          Back to Tasks
        </Button>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Task Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          sx={{ mr: 1 }}
          onClick={() => navigate(`/tasks/${task.id}/edit`)}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {task.title}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
          <Chip
            label={task.priority}
            color={task.priority === Priority.HIGH ? 'error' : task.priority === Priority.MEDIUM ? 'warning' : 'info'}
          />
          <Chip
            label={task.status.replace('_', ' ')}
            color={task.status === Status.COMPLETED ? 'success' : task.status === Status.IN_PROGRESS ? 'info' : 'default'}
          />
          {task.categoryName && (
            <Chip
              label={task.categoryName}
              sx={{
                backgroundColor: task.categoryColor,
                color: 'white',
              }}
            />
          )}
        </Box>

        {task.description && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {task.description}
            </Typography>
          </Box>
        )}

        <Box>
          <Typography variant="h6" gutterBottom>
            Details
          </Typography>

          {task.dueDate && (
            <Typography variant="body2" paragraph>
              <strong>Due Date:</strong> {format(new Date(task.dueDate), 'PPpp')}
            </Typography>
          )}

          {task.reminderDate && (
            <Typography variant="body2" paragraph>
              <strong>Reminder:</strong> {format(new Date(task.reminderDate), 'PPpp')}
            </Typography>
          )}

          <Typography variant="body2" paragraph>
            <strong>Created:</strong> {format(new Date(task.createdAt), 'PPpp')} by {task.createdByName}
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>Last Updated:</strong> {format(new Date(task.updatedAt), 'PPpp')} by {task.updatedByName}
          </Typography>

          {task.completedAt && (
            <Typography variant="body2" paragraph>
              <strong>Completed:</strong> {format(new Date(task.completedAt), 'PPpp')}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default TaskDetail;