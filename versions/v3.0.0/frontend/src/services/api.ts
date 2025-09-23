import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  teamIds?: string[];
}

interface AuthResponse {
  user: any;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  session?: {
    expiresIn: string;
    rememberMe: boolean;
  };
}

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  private client: AxiosInstance;
  private refreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.refreshing) {
            // If we're already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => this.client(originalRequest));
          }

          originalRequest._retry = true;
          this.refreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshTokens(refreshToken);
              const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
              
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('refreshToken', newRefreshToken);

              // Retry failed requests
              this.failedQueue.forEach(({ resolve }) => resolve());
              this.failedQueue = [];

              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.logout();
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
          } finally {
            this.refreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async refreshTokens(refreshToken: string): Promise<AxiosResponse<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>>> {
    return this.client.post('/auth/refresh', { refreshToken });
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/auth/me');
    return response.data.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.client.post('/auth/change-password', { currentPassword, newPassword });
  }

  // User methods
  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<any> {
    const response = await this.client.get<ApiResponse>('/users', { params });
    return response.data.data;
  }

  async getUserById(id: string): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/users/${id}`);
    return response.data.data;
  }

  async updateUser(id: string, data: any): Promise<any> {
    const response = await this.client.put<ApiResponse>(`/users/${id}`, data);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }

  // Team methods
  async getTeams(params?: { page?: number; limit?: number }): Promise<any> {
    const response = await this.client.get<ApiResponse>('/teams', { params });
    return response.data.data;
  }

  async getTeamById(id: string): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/teams/${id}`);
    return response.data.data;
  }

  async createTeam(data: any): Promise<any> {
    const response = await this.client.post<ApiResponse>('/teams', data);
    return response.data.data;
  }

  async updateTeam(id: string, data: any): Promise<any> {
    const response = await this.client.put<ApiResponse>(`/teams/${id}`, data);
    return response.data.data;
  }

  async deleteTeam(id: string): Promise<void> {
    await this.client.delete(`/teams/${id}`);
  }

  // Dependency methods
  async getDependencies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    teamIds?: string[];
    types?: string[];
    statuses?: string[];
    healthScores?: string[];
  }): Promise<any> {
    const response = await this.client.get<ApiResponse>('/dependencies', { params });
    return response.data.data;
  }

  async getDependencyById(id: string): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/dependencies/${id}`);
    return response.data.data;
  }

  async createDependency(data: any): Promise<any> {
    const response = await this.client.post<ApiResponse>('/dependencies', data);
    return response.data.data;
  }

  async updateDependency(id: string, data: any): Promise<any> {
    const response = await this.client.put<ApiResponse>(`/dependencies/${id}`, data);
    return response.data.data;
  }

  async deleteDependency(id: string): Promise<void> {
    await this.client.delete(`/dependencies/${id}`);
  }

  async checkDependencyUpdates(id: string): Promise<any> {
    const response = await this.client.post<ApiResponse>(`/dependencies/${id}/check-updates`);
    return response.data.data;
  }

  // Update Request methods
  async getUpdateRequests(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<any> {
    const response = await this.client.get<ApiResponse>('/requests', { params });
    return response.data.data;
  }

  async getUpdateRequestById(id: string): Promise<any> {
    const response = await this.client.get<ApiResponse>(`/requests/${id}`);
    return response.data.data;
  }

  async createUpdateRequest(data: any): Promise<any> {
    const response = await this.client.post<ApiResponse>('/requests', data);
    return response.data.data;
  }

  async updateUpdateRequest(id: string, data: any): Promise<any> {
    const response = await this.client.put<ApiResponse>(`/requests/${id}`, data);
    return response.data.data;
  }

  async approveUpdateRequest(id: string, notes?: string): Promise<any> {
    const response = await this.client.post<ApiResponse>(`/requests/${id}/approve`, { notes });
    return response.data.data;
  }

  async rejectUpdateRequest(id: string, reason: string): Promise<any> {
    const response = await this.client.post<ApiResponse>(`/requests/${id}/reject`, { reason });
    return response.data.data;
  }

  async addRequestComment(id: string, content: string): Promise<any> {
    const response = await this.client.post<ApiResponse>(`/requests/${id}/comments`, { content });
    return response.data.data;
  }

  // Notification methods
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<any> {
    const response = await this.client.get<ApiResponse>('/notifications', { params });
    return response.data.data;
  }

  async markNotificationAsRead(id: string): Promise<any> {
    const response = await this.client.put<ApiResponse>(`/notifications/${id}/read`);
    return response.data.data;
  }

  async markAllNotificationsAsRead(): Promise<any> {
    const response = await this.client.put<ApiResponse>('/notifications/mark-all-read');
    return response.data.data;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.client.delete(`/notifications/${id}`);
  }

  async getUnreadNotificationCount(): Promise<number> {
    const response = await this.client.get<ApiResponse>('/notifications/unread-count');
    return response.data.data?.count || 0;
  }

  // Analytics methods
  async getDashboardAnalytics(teamId?: string): Promise<any> {
    const params = teamId ? { teamId } : undefined;
    const response = await this.client.get<ApiResponse>('/analytics/dashboard', { params });
    return response.data.data;
  }

  async getDependencyHealthStats(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/analytics/dependencies/health');
    return response.data.data;
  }

  async getVulnerabilityTrends(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/analytics/vulnerabilities/trends');
    return response.data.data;
  }

  async getTeamPerformanceMetrics(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/analytics/teams/performance');
    return response.data.data;
  }

  async getUpdateRequestStats(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/analytics/requests/stats');
    return response.data.data;
  }

  // Health check
  async getHealthStatus(): Promise<any> {
    const response = await this.client.get<ApiResponse>('/health');
    return response.data;
  }

  // Generic methods for custom requests
  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data!;
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data!;
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data!;
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data!;
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;


