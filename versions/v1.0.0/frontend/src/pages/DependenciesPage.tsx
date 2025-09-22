import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Security,
  Update,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

const DependenciesPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Dependencies
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Manage and monitor your project dependencies
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
          >
            Add Dependency
          </Button>
        </Box>

        {/* Action Bar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button startIcon={<Search />} variant="outlined">
              Search
            </Button>
            <Button startIcon={<FilterList />} variant="outlined">
              Filter
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button startIcon={<Security />} variant="outlined" color="error">
              Scan Vulnerabilities
            </Button>
            <Button startIcon={<Update />} variant="outlined" color="warning">
              Check Updates
            </Button>
          </Box>
        </Paper>

        {/* Mock Content */}
        <Grid container spacing={3}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div">
                      react-{index + 1}
                    </Typography>
                    <Chip
                      icon={index % 3 === 0 ? <CheckCircle /> : <Warning />}
                      label={index % 3 === 0 ? 'Healthy' : 'Outdated'}
                      color={index % 3 === 0 ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Version: 18.{index + 1}.0
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Used by Frontend Team
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Coming Soon Notice */}
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            🚧 Under Development
          </Typography>
          <Typography variant="body1" color="textSecondary">
            The full dependencies management interface is being developed. 
            This will include advanced filtering, vulnerability scanning, and bulk operations.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DependenciesPage;


