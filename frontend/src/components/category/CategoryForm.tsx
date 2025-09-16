import React from 'react';
import {
  Box,
  TextField,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { CategoryRequest } from '../../types/category';

interface CategoryFormProps {
  onSubmit: (data: CategoryRequest) => void;
  loading: boolean;
}

function CategoryForm({ onSubmit, loading }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryRequest>();

  const handleFormSubmit = (data: CategoryRequest) => {
    onSubmit(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Category Name"
        error={!!errors.name}
        helperText={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Color"
        type="color"
        defaultValue="#3498db"
        {...register('color')}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Category'}
      </Button>
    </Box>
  );
}

export default CategoryForm;