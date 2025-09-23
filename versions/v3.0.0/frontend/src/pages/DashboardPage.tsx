import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  Security,
  Assignment,
  People,
  CheckCircle,
  Warning,
  Error,
  Info,
  Update,
  BugReport,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

// Mock data for demonstration
const mockStats = {
  totalDependencies: 1247,
  healthyDependencies: 1089,
  outdatedDependencies: 134,
  vulnerableDependencies: 24,
  pendingRequests: 12,
  teamsCount: 10,
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'dependency_update',
    title: 'React updated to 18.2.0',
    description: 'Frontend Team updated React dependency',
    time: '2 hours ago',
    icon: <Update color="primary" />,
  },
  {
    id: '2',
    type: 'vulnerability',
    title: 'Critical vulnerability detected',
    description: 'lodash 4.17.15 has known security issues',
    time: '4 hours ago',
    icon: <BugReport color="error" />,
  },
  {
    id: '3',
    type: 'request_approved',
    title: 'Update request approved',
    description: 'Node.js upgrade to v18 LTS approved',
    time: '1 day ago',
    icon: <CheckCircle color="success" />,
  },
];

const mockTeamStats = [
  { name: 'Frontend Team', dependencies: 156, health: 92 },
  { name: 'Backend Team', dependencies: 203, health: 87 },
  { name: 'DevOps Team', dependencies: 89, health: 95 },
  { name: 'Mobile Team', dependencies: 134, health: 89 },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const getHealthColor = (percentage: number) => {
    if (percentage >= 95) return 'success';
    if (percentage >= 80) return 'warning';
    return 'error';
  };

  const getHealthScore = () => {
    return Math.round((mockStats.healthyDependencies / mockStats.totalDependencies) * 100);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Here's an overview of your dependency management dashboard
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {mockStats.totalDependencies}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Dependencies
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${getHealthScore()}% Healthy`}
                  color={getHealthColor(getHealthScore())}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {mockStats.healthyDependencies}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Up to Date
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <Warning />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {mockStats.outdatedDependencies}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Outdated
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                    <Security />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {mockStats.vulnerableDependencies}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Vulnerable
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {mockRecentActivity.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemIcon sx={{ mt: 1 }}>
                        {activity.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.title}
                        secondary={
                          <>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {activity.description}
                            </Typography>
                            <Typography
                              sx={{ display: 'block', mt: 0.5 }}
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {activity.time}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < mockRecentActivity.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Team Performance */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Team Health Overview
              </Typography>
              <Box sx={{ mt: 2 }}>
                {mockTeamStats.map((team) => (
                  <Box key={team.name} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {team.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {team.dependencies} dependencies • {team.health}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={team.health}
                      color={getHealthColor(team.health)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" fontWeight={600}>
                        New Request
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Security sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                      <Typography variant="body2" fontWeight={600}>
                        Scan Vulnerabilities
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="body2" fontWeight={600}>
                        Manage Teams
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Info sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="body2" fontWeight={600}>
                        View Analytics
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Notifications Summary */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                  <Info sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h4" component="div" gutterBottom>
                  {unreadCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Unread notifications
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage;


