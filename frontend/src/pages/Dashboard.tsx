import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assignment,
  Schedule,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { taskService } from '../services/taskService';
import { DashboardStats } from '../types/task';

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await taskService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
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

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: <Assignment />,
      color: '#1976d2',
    },
    {
      title: 'Pending Tasks',
      value: stats?.pendingTasks || 0,
      icon: <Schedule />,
      color: '#ff9800',
    },
    {
      title: 'In Progress',
      value: stats?.inProgressTasks || 0,
      icon: <Schedule />,
      color: '#2196f3',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks || 0,
      icon: <CheckCircle />,
      color: '#4caf50',
    },
    {
      title: 'Overdue Tasks',
      value: stats?.overdueTasks || 0,
      icon: <Warning />,
      color: '#f44336',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {card.title}
                    </Typography>
                    <Typography variant="h4">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Completion Rate
              </Typography>
              <Typography variant="h3" color="primary">
                {stats?.completionRate.toFixed(1) || 0}%
              </Typography>
              <Typography color="textSecondary">
                Tasks completed successfully
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;