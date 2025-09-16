import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Category } from '../../types/category';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}

function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <List>
      {categories.map((category) => (
        <ListItem
          key={category.id}
          secondaryAction={
            <Box>
              <IconButton edge="end" onClick={() => onEdit(category)}>
                <Edit />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(category.id)}>
                <Delete />
              </IconButton>
            </Box>
          }
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundColor: category.color,
                borderRadius: '50%',
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={category.name}
            secondary={`${category.taskCount || 0} tasks`}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default CategoryList;