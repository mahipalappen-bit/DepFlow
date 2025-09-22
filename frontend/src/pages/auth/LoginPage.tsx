import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LoginOutlined, PersonAdd, Security } from '@mui/icons-material';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: yup.boolean(),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      await login(data.email, data.password, data.rememberMe);
      
      // Navigation is handled by the useEffect above
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (error: any) {
      // Error is handled by AuthContext and displayed below
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'team_member') => {
    const demoCredentials = {
      admin: { email: 'admin@demo.com', password: 'admin123456' },
      team_member: { email: 'user@demo.com', password: 'user123456' },
    };

    const credentials = demoCredentials[role];
    reset(credentials);
    
    try {
      setIsSubmitting(true);
      await login(credentials.email, credentials.password, false);
      toast.success(`Logged in as demo ${role.replace('_', ' ')}`);
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading && !isSubmitting) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={isMobile ? 0 : 8}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: isMobile ? 0 : 2,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Security
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography component="h1" variant="h4" fontWeight={600}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="textSecondary" textAlign="center">
              Sign in to access your dependency management dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              {...register('email')}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting}
            />
            
            <TextField
              {...register('password')}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isSubmitting}
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  {...register('rememberMe')}
                  color="primary"
                  disabled={isSubmitting}
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? null : <LoginOutlined />}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isSubmitting ? <LoadingSpinner size="small" /> : 'Sign In'}
            </Button>

            {/* Demo Login Buttons */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Demo Access
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('admin')}
                disabled={isSubmitting}
                startIcon={<Security />}
              >
                Admin Demo
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('team_member')}
                disabled={isSubmitting}
                startIcon={<PersonAdd />}
              >
                User Demo
              </Button>
            </Box>

            {/* Links */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>

          {/* Footer Info */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Secure dependency management for modern teams
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              Version 1.0.0 • Built with security in mind
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;


