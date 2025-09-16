import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { TaskCreateRequest, Priority } from '../../types/task';
import { Category } from '../../types/category';

interface TaskFormProps {
  onSubmit: (data: TaskCreateRequest) => void;
  categories: Category[];
  loading: boolean;
}

function TaskForm({ onSubmit, categories, loading }: TaskFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskCreateRequest>();

  const handleFormSubmit = (data: TaskCreateRequest) => {
    onSubmit(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Task Title"
        error={!!errors.title}
        helperText={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        multiline
        rows={3}
        {...register('description')}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select defaultValue={Priority.MEDIUM} {...register('priority')}>
            <MenuItem value={Priority.LOW}>Low</MenuItem>
            <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
            <MenuItem value={Priority.HIGH}>High</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select defaultValue="" {...register('categoryId')}>
            <MenuItem value="">None</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        margin="normal"
        type="datetime-local"
        label="Due Date"
        InputLabelProps={{ shrink: true }}
        {...register('dueDate')}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Task'}
      </Button>
    </Box>
  );
}

export default TaskForm;