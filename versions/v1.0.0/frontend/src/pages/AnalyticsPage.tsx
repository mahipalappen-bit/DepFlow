import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  Update,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';

const AnalyticsPage: React.FC = () => {
  // Mock analytics data
  const stats = {
    totalDependencies: 47,
    upToDate: 28,
    outdated: 15,
    vulnerable: 4,
    healthScore: 78
  };

  const healthScoreColor = stats.healthScore >= 80 ? '#4caf50' : stats.healthScore >= 60 ? '#ff9800' : '#f44336';

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📊 Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Comprehensive insights into your dependency ecosystem
        </Typography>

        <Grid container spacing={3}>
          {/* Overview Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                <Typography variant="h4" component="div" color="#4caf50">
                  {stats.upToDate}
                </Typography>
                <Typography color="text.secondary">
                  Up to Date
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Update sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                <Typography variant="h4" component="div" color="#ff9800">
                  {stats.outdated}
                </Typography>
                <Typography color="text.secondary">
                  Outdated
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ErrorIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                <Typography variant="h4" component="div" color="#f44336">
                  {stats.vulnerable}
                </Typography>
                <Typography color="text.secondary">
                  Vulnerable
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                <Typography variant="h4" component="div" color="#1976d2">
                  {stats.totalDependencies}
                </Typography>
                <Typography color="text.secondary">
                  Total Dependencies
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Health Score */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overall Health Score
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.healthScore} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: healthScoreColor
                      }
                    }} 
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {stats.healthScore}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Based on dependency freshness, security, and maintenance status
              </Typography>
            </Paper>
          </Grid>

          {/* Risk Categories */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="Low Risk" color="success" size="small" />
                  <Typography variant="body2">{stats.upToDate} dependencies</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="Medium Risk" color="warning" size="small" />
                  <Typography variant="body2">{stats.outdated} dependencies</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="High Risk" color="error" size="small" />
                  <Typography variant="body2">{stats.vulnerable} dependencies</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                📈 Insights & Recommendations
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      🚨 Immediate Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      4 dependencies have critical security vulnerabilities that need immediate updates
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      📅 Scheduled Updates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      15 dependencies can be updated during the next maintenance window
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      ✅ Health Status
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      28 dependencies are up-to-date and well-maintained
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AnalyticsPage;
