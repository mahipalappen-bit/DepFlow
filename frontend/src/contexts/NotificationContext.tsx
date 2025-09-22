import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// Types
interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expiresAt?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

interface NotificationContextType extends NotificationState {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refetchNotifications: () => void;
  refetchUnreadCount: () => void;
  addNotification: (notification: Notification) => void;
}

// Action types
type NotificationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'UPDATE_NOTIFICATION'; payload: { id: string; updates: Partial<Notification> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' };

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Reducer
function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        isLoading: false,
        error: null,
      };

    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: action.payload.isRead ? state.unreadCount : state.unreadCount + 1,
      };

    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload.updates }
            : notification
        ),
      };

    case 'REMOVE_NOTIFICATION':
      const removedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        unreadCount: removedNotification && !removedNotification.isRead 
          ? state.unreadCount - 1 
          : state.unreadCount,
      };

    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload && !notification.isRead
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true,
        })),
        unreadCount: 0,
      };

    default:
      return state;
  }
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch notifications
  const {
    data: notificationsData,
    error: notificationsError,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useQuery(
    ['notifications'],
    () => apiService.getNotifications({ limit: 50 }),
    {
      enabled: isAuthenticated,
      refetchInterval: 30000, // Refetch every 30 seconds
      onSuccess: (data) => {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: data.notifications || [] });
      },
      onError: (error: any) => {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      },
    }
  );

  // Fetch unread count
  const {
    data: unreadCountData,
    error: unreadCountError,
    refetch: refetchUnreadCount,
  } = useQuery(
    ['notifications', 'unread-count'],
    () => apiService.getUnreadNotificationCount(),
    {
      enabled: isAuthenticated,
      refetchInterval: 30000, // Refetch every 30 seconds
      onSuccess: (count) => {
        dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
      },
      onError: (error: any) => {
        console.error('Failed to fetch unread count:', error);
      },
    }
  );

  // Update loading state
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: notificationsLoading });
  }, [notificationsLoading]);

  // Handle errors
  useEffect(() => {
    if (notificationsError) {
      dispatch({ type: 'SET_ERROR', payload: (notificationsError as any)?.message || 'Failed to load notifications' });
    }
  }, [notificationsError]);

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      dispatch({ type: 'MARK_AS_READ', payload: id });
      
      // Update cache
      queryClient.invalidateQueries(['notifications', 'unread-count']);
    } catch (error: any) {
      toast.error('Failed to mark notification as read');
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      dispatch({ type: 'MARK_ALL_AS_READ' });
      
      // Update cache
      queryClient.invalidateQueries(['notifications', 'unread-count']);
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error('Failed to mark all notifications as read');
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
      
      // Update cache
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications', 'unread-count']);
      
      toast.success('Notification deleted');
    } catch (error: any) {
      toast.error('Failed to delete notification');
      console.error('Error deleting notification:', error);
    }
  };

  const addNotification = (notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Show toast for new notifications based on priority
    if (notification.priority === 'urgent') {
      toast.error(notification.title, { duration: 10000 });
    } else if (notification.priority === 'high') {
      toast(notification.title, { duration: 8000 });
    } else {
      // Don't show toast for low/medium priority to avoid spam
    }
  };

  const contextValue: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetchNotifications,
    refetchUnreadCount,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;


