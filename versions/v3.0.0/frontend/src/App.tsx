import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Store and Context
import { store } from '@/store';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SocketProvider } from '@/contexts/SocketContext';

// Theme
import { theme } from '@/styles/theme';

// Components
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { AppLayout } from '@/components/layout/AppLayout';

// Pages (lazy loaded for code splitting)
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const DependenciesPage = React.lazy(() => import('@/pages/DependenciesPage'));
const DependencyDetailPage = React.lazy(() => import('@/pages/DependencyDetailPage'));
const UpdateRequestsPage = React.lazy(() => import('@/pages/UpdateRequestsPage'));
const TeamsPage = React.lazy(() => import('@/pages/TeamsPage'));
const TeamDetailPage = React.lazy(() => import('@/pages/TeamDetailPage'));
const UsersPage = React.lazy(() => import('@/pages/UsersPage'));
const UserProfilePage = React.lazy(() => import('@/pages/UserProfilePage'));
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// Page component with layout wrapper
const PageWithLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppLayout>{children}</AppLayout>
);

// Loading fallback component
const PageLoadingFallback: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <LoadingSpinner size="large" />
  </div>
);

// Error fallback component
const AppErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '2rem',
    textAlign: 'center'
  }}>
    <h1>Something went wrong</h1>
    <p style={{ color: '#666', marginBottom: '1rem' }}>
      {error.message || 'An unexpected error occurred'}
    </p>
    <button 
      onClick={resetError}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Try Again
    </button>
  </div>
);

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary fallbackComponent={AppErrorFallback}>
      <HelmetProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <AuthProvider>
                  <NotificationProvider>
                    <SocketProvider>
                      <Router>
                        <Routes>
                          {/* Public routes */}
                          <Route 
                            path="/login" 
                            element={
                              <Suspense fallback={<PageLoadingFallback />}>
                                <LoginPage />
                              </Suspense>
                            } 
                          />
                          
                          {/* Protected routes with layout */}
                          <Route path="/" element={<PrivateRoute />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            
                            <Route 
                              path="/dashboard" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <DashboardPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/dependencies" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <DependenciesPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/dependencies/:id" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <DependencyDetailPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/requests" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <UpdateRequestsPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/teams" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <TeamsPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/teams/:id" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <TeamDetailPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/users" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <UsersPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/profile" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <UserProfilePage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/analytics" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <AnalyticsPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/notifications" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <NotificationsPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                            
                            <Route 
                              path="/settings" 
                              element={
                                <Suspense fallback={<PageLoadingFallback />}>
                                  <PageWithLayout>
                                    <SettingsPage />
                                  </PageWithLayout>
                                </Suspense>
                              } 
                            />
                          </Route>
                          
                          {/* 404 route */}
                          <Route 
                            path="*" 
                            element={
                              <Suspense fallback={<PageLoadingFallback />}>
                                <NotFoundPage />
                              </Suspense>
                            } 
                          />
                        </Routes>
                      </Router>
                      
                      {/* Global components */}
                      <Toaster
                        position="top-right"
                        toastOptions={{
                          duration: 5000,
                          style: {
                            background: '#333',
                            color: '#fff',
                          },
                          success: {
                            style: {
                              background: '#4caf50',
                            },
                          },
                          error: {
                            style: {
                              background: '#f44336',
                            },
                          },
                        }}
                      />
                      
                    </SocketProvider>
                  </NotificationProvider>
                </AuthProvider>
              </LocalizationProvider>
            </ThemeProvider>
            
            {/* React Query DevTools (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </QueryClientProvider>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;


