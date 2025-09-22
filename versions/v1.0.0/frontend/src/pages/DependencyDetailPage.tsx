import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const DependencyDetailPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dependency Details
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            🚧 Under Development
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Detailed dependency information and management interface coming soon.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DependencyDetailPage;


