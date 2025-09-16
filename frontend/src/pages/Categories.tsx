import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { categoryService } from '../services/categoryService';
import { Category, CategoryRequest } from '../types/category';

function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryRequest>();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: CategoryRequest) => {
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, data);
      } else {
        await categoryService.createCategory(data);
      }
      setModalOpen(false);
      setSelectedCategory(null);
      reset();
      loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    reset({
      name: category.name,
      color: category.color,
    });
    setModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.deleteCategory(categoryId);
        loadCategories();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCategory(null);
    reset();
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Categories
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setModalOpen(true)}
        >
          New Category
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: category.color,
                        borderRadius: '50%',
                        mr: 2,
                      }}
                    />
                    <Typography variant="h6">
                      {category.name}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleEdit(category)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(category.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                {category.taskCount !== undefined && (
                  <Typography variant="body2" color="textSecondary">
                    {category.taskCount} tasks
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={modalOpen} onClose={handleModalClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Create New Category'}
        </DialogTitle>

        <form onSubmit={handleSubmit(handleSave)}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                maxLength: {
                  value: 50,
                  message: 'Name must not exceed 50 characters',
                },
              })}
            />

            <TextField
              margin="dense"
              label="Color"
              type="color"
              fullWidth
              variant="outlined"
              {...register('color')}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default Categories;