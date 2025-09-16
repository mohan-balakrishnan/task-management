import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  AccessTime,
  CalendarToday,
} from '@mui/icons-material';
import { Task, Priority, Status } from '../../types/task';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH: return 'error';
      case Priority.MEDIUM: return 'warning';
      case Priority.LOW: return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.COMPLETED: return 'success';
      case Status.IN_PROGRESS: return 'info';
      case Status.PENDING: return 'default';
      default: return 'default';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== Status.COMPLETED;

  return (
    <Card sx={{ width: '100%', position: 'relative' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>

            {task.description && (
              <Typography variant="body2" color="textSecondary" paragraph>
                {task.description}
              </Typography>
            )}

            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip
                label={task.priority}
                color={getPriorityColor(task.priority)}
                size="small"
              />
              <Chip
                label={task.status.replace('_', ' ')}
                color={getStatusColor(task.status)}
                size="small"
              />
              {task.categoryName && (
                <Chip
                  label={task.categoryName}
                  size="small"
                  sx={{
                    backgroundColor: task.categoryColor,
                    color: 'white',
                  }}
                />
              )}
              {isOverdue && (
                <Chip
                  label="OVERDUE"
                  color="error"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>

            {task.dueDate && (
              <Box display="flex" alignItems="center" color="textSecondary" mb={1}>
                <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                <Typography variant="body2">
                  Due: {format(new Date(task.dueDate), 'MMM dd, yyyy HH:mm')}
                </Typography>
              </Box>
            )}

            <Box display="flex" alignItems="center" color="textSecondary">
              <AccessTime sx={{ fontSize: 16, mr: 1 }} />
              <Typography variant="body2">
                Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
              <Edit sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={() => { onDelete(); handleMenuClose(); }}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TaskCard;