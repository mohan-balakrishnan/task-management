import React from 'react';
import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { Clear } from '@mui/icons-material';
import { TaskFilters as TaskFiltersType, Priority, Status } from '../../types/task';
import { Category } from '../../types/category';
import SearchBar from '../common/SearchBar';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  categories: Category[];
  onFilterChange: (filters: TaskFiltersType) => void;
}

function TaskFilters({ filters, categories, onFilterChange }: TaskFiltersProps) {
  const handleFilterChange = (key: keyof TaskFiltersType, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
        <SearchBar
          value={filters.search || ''}
          onChange={(value) => handleFilterChange('search', value)}
          placeholder="Search tasks..."
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status || ''}
            label="Status"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={Status.PENDING}>Pending</MenuItem>
            <MenuItem value={Status.IN_PROGRESS}>In Progress</MenuItem>
            <MenuItem value={Status.COMPLETED}>Completed</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority || ''}
            label="Priority"
            onChange={(e) => handleFilterChange('priority', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={Priority.LOW}>Low</MenuItem>
            <MenuItem value={Priority.MEDIUM}>Medium</MenuItem>
            <MenuItem value={Priority.HIGH}>High</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.categoryId || ''}
            label="Category"
            onChange={(e) => handleFilterChange('categoryId', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          type="date"
          label="Due From"
          InputLabelProps={{ shrink: true }}
          value={filters.dueFrom || ''}
          onChange={(e) => handleFilterChange('dueFrom', e.target.value)}
        />

        <TextField
          size="small"
          type="date"
          label="Due To"
          InputLabelProps={{ shrink: true }}
          value={filters.dueTo || ''}
          onChange={(e) => handleFilterChange('dueTo', e.target.value)}
        />

        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={clearFilters}
        >
          Clear
        </Button>
      </Box>
    </Paper>
  );
}

export default TaskFilters;