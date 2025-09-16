import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container>
        <Typography variant="h6">User not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {user.firstName?.charAt(0) || <Person />}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              @{user.username}
            </Typography>
            <Chip
              label={user.role?.roleName || 'USER'}
              color={user.role?.roleName === 'ADMIN' ? 'primary' : 'default'}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Username:</strong> {user.username}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Member Since:</strong> {format(new Date(user.registeredAt), 'PPP')}
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Status:</strong>{' '}
            <Chip
              label={user.isActive ? 'Active' : 'Inactive'}
              color={user.isActive ? 'success' : 'error'}
              size="small"
            />
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;