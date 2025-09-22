import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User, UserDocument } from '@/models/User';
import { logger } from '@/utils/logger';
import { SOCKET_EVENTS } from '../../../shared/constants';

// Extend Socket interface to include user data
interface AuthenticatedSocket extends Socket {
  user?: UserDocument;
  userId?: string;
}

// Socket authentication middleware
const authenticateSocket = async (socket: AuthenticatedSocket, next: Function) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(new Error('User not found or inactive'));
    }

    // Attach user to socket
    socket.user = user;
    socket.userId = user._id.toString();

    logger.info('Socket authenticated:', {
      userId: user._id.toString(),
      socketId: socket.id,
      email: user.email,
    });

    next();
  } catch (error) {
    logger.warn('Socket authentication failed:', {
      socketId: socket.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    next(new Error('Authentication failed'));
  }
};

// Socket connection handler
const handleConnection = (io: SocketServer) => {
  return (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    const user = socket.user!;

    logger.info('User connected via WebSocket:', {
      userId,
      socketId: socket.id,
      role: user.role,
    });

    // Join user-specific room
    socket.join(SOCKET_EVENTS.ROOMS.USER(userId));

    // Join team rooms
    user.teamIds.forEach(teamId => {
      socket.join(SOCKET_EVENTS.ROOMS.TEAM(teamId.toString()));
    });

    // Join admin room if user is admin
    if (user.role === 'admin') {
      socket.join(SOCKET_EVENTS.ROOMS.ADMIN);
    }

    // Join system notifications room
    socket.join(SOCKET_EVENTS.ROOMS.SYSTEM);

    // Handle room joining
    socket.on(SOCKET_EVENTS.CLIENT.JOIN_ROOM, (roomName: string) => {
      // Validate room access
      const allowedRooms = [
        SOCKET_EVENTS.ROOMS.USER(userId),
        SOCKET_EVENTS.ROOMS.SYSTEM,
        ...user.teamIds.map(teamId => SOCKET_EVENTS.ROOMS.TEAM(teamId.toString())),
        ...(user.role === 'admin' ? [SOCKET_EVENTS.ROOMS.ADMIN] : []),
      ];

      if (allowedRooms.includes(roomName)) {
        socket.join(roomName);
        logger.debug('User joined room:', { userId, roomName, socketId: socket.id });
        
        socket.emit('room:joined', { room: roomName });
      } else {
        logger.warn('Unauthorized room join attempt:', { userId, roomName, socketId: socket.id });
        socket.emit('error', { message: 'Unauthorized room access' });
      }
    });

    // Handle room leaving
    socket.on(SOCKET_EVENTS.CLIENT.LEAVE_ROOM, (roomName: string) => {
      socket.leave(roomName);
      logger.debug('User left room:', { userId, roomName, socketId: socket.id });
      
      socket.emit('room:left', { room: roomName });
    });

    // Handle notification subscriptions
    socket.on(SOCKET_EVENTS.CLIENT.SUBSCRIBE_NOTIFICATIONS, (types: string[]) => {
      // Join specific notification rooms
      types.forEach(type => {
        const notificationRoom = `notifications:${type}`;
        socket.join(notificationRoom);
      });

      logger.debug('User subscribed to notifications:', { userId, types, socketId: socket.id });
      
      socket.emit('notifications:subscribed', { types });
    });

    // Handle notification unsubscriptions
    socket.on(SOCKET_EVENTS.CLIENT.UNSUBSCRIBE_NOTIFICATIONS, (types: string[]) => {
      types.forEach(type => {
        const notificationRoom = `notifications:${type}`;
        socket.leave(notificationRoom);
      });

      logger.debug('User unsubscribed from notifications:', { userId, types, socketId: socket.id });
      
      socket.emit('notifications:unsubscribed', { types });
    });

    // Handle ping/pong for connection health
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    // Handle typing indicators (for chat features if implemented)
    socket.on('typing:start', (data: { room: string }) => {
      socket.to(data.room).emit('typing:user_started', {
        userId,
        userName: `${user.firstName} ${user.lastName}`,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('typing:stop', (data: { room: string }) => {
      socket.to(data.room).emit('typing:user_stopped', {
        userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle presence updates
    socket.on('presence:update', (status: 'online' | 'away' | 'busy') => {
      // Broadcast presence to user's teams
      user.teamIds.forEach(teamId => {
        socket.to(SOCKET_EVENTS.ROOMS.TEAM(teamId.toString())).emit('presence:user_updated', {
          userId,
          status,
          timestamp: new Date().toISOString(),
        });
      });

      logger.debug('User presence updated:', { userId, status, socketId: socket.id });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info('User disconnected from WebSocket:', {
        userId,
        socketId: socket.id,
        reason,
      });

      // Broadcast offline status to user's teams
      user.teamIds.forEach(teamId => {
        socket.to(SOCKET_EVENTS.ROOMS.TEAM(teamId.toString())).emit('presence:user_updated', {
          userId,
          status: 'offline',
          timestamp: new Date().toISOString(),
        });
      });

      // Update user's last seen timestamp (you might want to implement this)
      // await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    });

    // Send connection confirmation
    socket.emit('connected', {
      message: 'Successfully connected to WebSocket',
      user: user.getPublicProfile(),
      rooms: [
        SOCKET_EVENTS.ROOMS.USER(userId),
        SOCKET_EVENTS.ROOMS.SYSTEM,
        ...user.teamIds.map(teamId => SOCKET_EVENTS.ROOMS.TEAM(teamId.toString())),
        ...(user.role === 'admin' ? [SOCKET_EVENTS.ROOMS.ADMIN] : []),
      ],
      timestamp: new Date().toISOString(),
    });
  };
};

// Notification broadcasting utilities
export const broadcastNotification = (io: SocketServer, userId: string, notification: any) => {
  io.to(SOCKET_EVENTS.ROOMS.USER(userId)).emit(SOCKET_EVENTS.SERVER.NOTIFICATION, {
    type: 'notification',
    data: notification,
    timestamp: new Date().toISOString(),
  });

  logger.debug('Notification broadcasted:', { userId, notificationId: notification.id });
};

export const broadcastToTeam = (io: SocketServer, teamId: string, event: string, data: any) => {
  io.to(SOCKET_EVENTS.ROOMS.TEAM(teamId)).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });

  logger.debug('Event broadcasted to team:', { teamId, event });
};

export const broadcastToAdmins = (io: SocketServer, event: string, data: any) => {
  io.to(SOCKET_EVENTS.ROOMS.ADMIN).emit(event, {
    ...data,
    timestamp: new Date().toISOString(),
  });

  logger.debug('Event broadcasted to admins:', { event });
};

export const broadcastSystemAlert = (io: SocketServer, alert: any) => {
  io.to(SOCKET_EVENTS.ROOMS.SYSTEM).emit(SOCKET_EVENTS.SERVER.SYSTEM_ALERT, {
    type: 'system_alert',
    data: alert,
    timestamp: new Date().toISOString(),
  });

  logger.info('System alert broadcasted:', { alertId: alert.id });
};

// Dependency update broadcasting
export const broadcastDependencyUpdate = (io: SocketServer, dependency: any, teamIds: string[]) => {
  const updateData = {
    type: 'dependency_update',
    data: dependency,
    timestamp: new Date().toISOString(),
  };

  // Broadcast to all teams using this dependency
  teamIds.forEach(teamId => {
    io.to(SOCKET_EVENTS.ROOMS.TEAM(teamId)).emit(SOCKET_EVENTS.SERVER.DEPENDENCY_UPDATE, updateData);
  });

  logger.debug('Dependency update broadcasted:', { 
    dependencyId: dependency.id, 
    teamsNotified: teamIds.length 
  });
};

// Vulnerability alert broadcasting
export const broadcastVulnerabilityAlert = (io: SocketServer, alert: any, teamIds: string[]) => {
  const alertData = {
    type: 'vulnerability_alert',
    data: alert,
    timestamp: new Date().toISOString(),
  };

  // Broadcast to affected teams
  teamIds.forEach(teamId => {
    io.to(SOCKET_EVENTS.ROOMS.TEAM(teamId)).emit(SOCKET_EVENTS.SERVER.VULNERABILITY_ALERT, alertData);
  });

  // Also broadcast to admins
  io.to(SOCKET_EVENTS.ROOMS.ADMIN).emit(SOCKET_EVENTS.SERVER.VULNERABILITY_ALERT, alertData);

  logger.info('Vulnerability alert broadcasted:', { 
    alertId: alert.id, 
    teamsNotified: teamIds.length,
    severity: alert.severity,
  });
};

// Request status change broadcasting
export const broadcastRequestStatusChange = (io: SocketServer, request: any, userIds: string[]) => {
  const statusChangeData = {
    type: 'request_status_change',
    data: request,
    timestamp: new Date().toISOString(),
  };

  // Notify specific users (requester, assignee, approver)
  userIds.forEach(userId => {
    io.to(SOCKET_EVENTS.ROOMS.USER(userId)).emit(SOCKET_EVENTS.SERVER.REQUEST_STATUS_CHANGE, statusChangeData);
  });

  logger.debug('Request status change broadcasted:', { 
    requestId: request.id, 
    status: request.status,
    usersNotified: userIds.length 
  });
};

// Connection statistics
export const getConnectionStats = (io: SocketServer) => {
  const sockets = io.sockets.sockets;
  const connections = Array.from(sockets.values()) as AuthenticatedSocket[];
  
  const stats = {
    totalConnections: connections.length,
    authenticatedConnections: connections.filter(s => s.user).length,
    uniqueUsers: new Set(connections.map(s => s.userId).filter(Boolean)).size,
    usersByRole: connections.reduce((acc, socket) => {
      if (socket.user) {
        acc[socket.user.role] = (acc[socket.user.role] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    roomCounts: Object.fromEntries(
      Object.entries(io.sockets.adapter.rooms).map(([room, sockets]) => [room, sockets.size])
    ),
  };

  return stats;
};

// Main configuration function
export const configureWebSocket = (io: SocketServer) => {
  // Configure CORS
  io.engine.on('headers', (headers: any, req: any) => {
    headers['Access-Control-Allow-Credentials'] = 'true';
  });

  // Apply authentication middleware
  io.use(authenticateSocket);

  // Handle connections
  io.on('connection', handleConnection(io));

  // Error handling
  io.on('connect_error', (error) => {
    logger.error('WebSocket connection error:', error);
  });

  // Connection statistics logging (every 5 minutes)
  setInterval(() => {
    const stats = getConnectionStats(io);
    logger.info('WebSocket connection statistics:', stats);
  }, 5 * 60 * 1000);

  logger.info('WebSocket server configured successfully');
};

// Export utilities
export {
  AuthenticatedSocket,
  handleConnection,
  authenticateSocket,
  getConnectionStats,
};

export default configureWebSocket;


