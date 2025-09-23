import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import toast from 'react-hot-toast';

// Types
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
  joinRoom: (roomName: string) => void;
  leaveRoom: (roomName: string) => void;
  emit: (event: string, data: any) => void;
}

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
}

// WebSocket events constants
const SOCKET_EVENTS = {
  CLIENT: {
    JOIN_ROOM: 'join:room',
    LEAVE_ROOM: 'leave:room',
    SUBSCRIBE_NOTIFICATIONS: 'subscribe:notifications',
    UNSUBSCRIBE_NOTIFICATIONS: 'unsubscribe:notifications',
  },
  SERVER: {
    NOTIFICATION: 'notification',
    DEPENDENCY_UPDATE: 'dependency:update',
    VULNERABILITY_ALERT: 'vulnerability:alert',
    REQUEST_STATUS_CHANGE: 'request:status_change',
    TEAM_UPDATE: 'team:update',
    SYSTEM_ALERT: 'system:alert',
    PRESENCE_USER_UPDATED: 'presence:user_updated',
  },
  ROOMS: {
    USER: (userId: string) => `user:${userId}`,
    TEAM: (teamId: string) => `team:${teamId}`,
    ADMIN: 'admin',
    SYSTEM: 'system',
  },
};

// Create context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider component
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification } = useNotifications();
  
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
  });

  const serverUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user]);

  const connect = () => {
    if (socketRef.current?.connected || state.isConnecting) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setState(prev => ({ 
        ...prev, 
        isConnecting: false, 
        error: 'No authentication token available' 
      }));
      return;
    }

    // Create socket connection
    socketRef.current = io(serverUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null,
        reconnectAttempts: 0,
      }));

      // Subscribe to notifications
      socket.emit(SOCKET_EVENTS.CLIENT.SUBSCRIBE_NOTIFICATIONS, [
        'dependency_update',
        'vulnerability_alert',
        'update_request',
        'request_approved',
        'request_rejected',
        'system_alert',
      ]);

      toast.success('Connected to real-time updates');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setState(prev => ({ ...prev, isConnected: false, isConnecting: false }));
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't show error
        toast('Disconnected from real-time updates', { icon: 'ℹ️' });
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error.message,
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));

      if (state.reconnectAttempts < 3) {
        toast.error('Connection failed, retrying...');
      } else {
        toast.error('Unable to connect to real-time updates');
      }
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setState(prev => ({ ...prev, reconnectAttempts: 0 }));
      toast.success('Reconnected to real-time updates');
    });

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
      setState(prev => ({
        ...prev,
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to reconnect to server',
        reconnectAttempts: 0,
      }));
      toast.error('Failed to reconnect to real-time updates');
    });

    // Application-specific event handlers
    socket.on(SOCKET_EVENTS.SERVER.NOTIFICATION, (data) => {
      console.log('Received notification:', data);
      if (data.data) {
        addNotification(data.data);
      }
    });

    socket.on(SOCKET_EVENTS.SERVER.DEPENDENCY_UPDATE, (data) => {
      console.log('Dependency update:', data);
      toast(`Dependency ${data.data?.name} has been updated`, {
        icon: '📦',
        duration: 6000,
      });
    });

    socket.on(SOCKET_EVENTS.SERVER.VULNERABILITY_ALERT, (data) => {
      console.log('Vulnerability alert:', data);
      const severity = data.data?.severity || 'unknown';
      const icon = severity === 'critical' ? '🚨' : severity === 'high' ? '⚠️' : '⚡';
      
      toast(`Security alert: ${data.data?.title || 'New vulnerability detected'}`, {
        icon,
        duration: 10000,
      });
    });

    socket.on(SOCKET_EVENTS.SERVER.REQUEST_STATUS_CHANGE, (data) => {
      console.log('Request status change:', data);
      const status = data.data?.status;
      let message = 'Update request status changed';
      let icon = 'ℹ️';

      switch (status) {
        case 'approved':
          message = 'Your update request has been approved';
          icon = '✅';
          break;
        case 'rejected':
          message = 'Your update request has been rejected';
          icon = '❌';
          break;
        case 'completed':
          message = 'Update request has been completed';
          icon = '🎉';
          break;
        default:
          message = `Update request status: ${status}`;
      }

      toast(message, { icon, duration: 6000 });
    });

    socket.on(SOCKET_EVENTS.SERVER.TEAM_UPDATE, (data) => {
      console.log('Team update:', data);
      toast(`Team update: ${data.message || 'Team information updated'}`, {
        icon: '👥',
        duration: 4000,
      });
    });

    socket.on(SOCKET_EVENTS.SERVER.SYSTEM_ALERT, (data) => {
      console.log('System alert:', data);
      const priority = data.data?.priority || 'medium';
      
      toast(data.data?.title || 'System alert', {
        icon: priority === 'urgent' ? '🚨' : '📢',
        duration: priority === 'urgent' ? 15000 : 8000,
      });
    });

    // Presence updates
    socket.on(SOCKET_EVENTS.SERVER.PRESENCE_USER_UPDATED, (data) => {
      console.log('User presence updated:', data);
      // Handle user presence updates if needed
    });

    // Connection confirmation
    socket.on('connected', (data) => {
      console.log('Socket connection confirmed:', data);
    });

    // Room events
    socket.on('room:joined', (data) => {
      console.log('Joined room:', data.room);
    });

    socket.on('room:left', (data) => {
      console.log('Left room:', data.room);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      toast.error('Real-time connection error');
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setState({
        isConnected: false,
        isConnecting: false,
        error: null,
        reconnectAttempts: 0,
      });
    }
  };

  const joinRoom = (roomName: string) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit(SOCKET_EVENTS.CLIENT.JOIN_ROOM, roomName);
    }
  };

  const leaveRoom = (roomName: string) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit(SOCKET_EVENTS.CLIENT.LEAVE_ROOM, roomName);
    }
  };

  const emit = (event: string, data: any) => {
    if (socketRef.current && state.isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  const contextValue: SocketContextType = {
    socket: socketRef.current,
    ...state,
    joinRoom,
    leaveRoom,
    emit,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to use socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketContext;


