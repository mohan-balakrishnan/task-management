import React from 'react';
import {
  List,
  ListItem,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { Task } from '../../types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

function TaskList({ tasks, loading, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" color="textSecondary">
          No tasks found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create your first task to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <ListItem key={task.id} sx={{ p: 0, mb: 1 }}>
          <TaskCard
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default TaskList;