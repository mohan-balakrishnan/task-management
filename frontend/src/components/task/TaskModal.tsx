import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Task, TaskCreateRequest, Priority, Status } from '../../types/task';
import { Category } from '../../types/category';
import { taskService } from '../../services/taskService';

interface TaskModalProps {
  open: boolean;
  task?: Task | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

function TaskModal({ open, task, categories, onClose, onSave }: TaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<TaskCreateRequest>();

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        categoryId: task.categoryId,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        reminderDate: task.reminderDate ? task.reminderDate.split('T')[0] : '',
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: Priority.MEDIUM,
        categoryId: undefined,
        dueDate: '',
        reminderDate: '',
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskCreateRequest) => {
    setLoading(true);
    setError('');

    try {
      const taskData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        reminderDate: data.reminderDate ? new Date(data.reminderDate).toISOString() : undefined,
      };

      if (isEditing) {
        await taskService.updateTask(task.id, taskData);
      } else {
        await taskService.createTask(taskData);
      }

      onSave();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title?.message}
            {...register('title', {
              required: 'Title is required',
              maxLength: {
                value: 255,
                message: 'Title must not exceed 255 characters',
              },
            })}
          />

          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            {...register('description')}
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={watch('priority') || Priority.MEDIUM}
                label="Priority"
                {...register('priority')}
              >
                <MenuItem value={Priority.LOW}>Low</MenuItem>
                <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
                <MenuItem value={Priority.HIGH}>High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={watch('categoryId') || ''}
                label="Category"
                {...register('categoryId')}
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('dueDate')}
            />

            <TextField
              type="date"
              label="Reminder Date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('reminderDate')}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskModal;