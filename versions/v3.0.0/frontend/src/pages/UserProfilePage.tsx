import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';

const UserProfilePage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Profile
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            🚧 Under Development
          </Typography>
          <Typography variant="body1" color="textSecondary">
            User profile page coming soon.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserProfilePage;
