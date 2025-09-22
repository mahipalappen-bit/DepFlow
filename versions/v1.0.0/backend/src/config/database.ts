import mongoose from 'mongoose';
import { logger } from '@/utils/logger';

interface DatabaseConfig {
  url: string;
  options: mongoose.ConnectOptions;
}

class Database {
  private static instance: Database;
  private connection: mongoose.Connection | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private getConfig(): DatabaseConfig {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isTest = process.env.NODE_ENV === 'test';
    
    // Use test database URL if in test environment
    const databaseUrl = isTest 
      ? process.env.TEST_DATABASE_URL || 'mongodb://localhost:27017/dependency-management-test'
      : process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/dependency-management';

    const options: mongoose.ConnectOptions = {
      // Connection settings
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      
      // Development settings
      ...(isDevelopment && {
        autoIndex: true, // Build indexes in development
      }),

      // Production settings
      ...(!isDevelopment && {
        autoIndex: false, // Don't build indexes in production
      }),
    };

    return { url: databaseUrl, options };
  }

  public async connect(): Promise<void> {
    try {
      const config = this.getConfig();
      
      logger.info(`Connecting to MongoDB: ${config.url.replace(/\/\/.*@/, '//***:***@')}`);
      
      await mongoose.connect(config.url, config.options);
      
      this.connection = mongoose.connection;
      
      // Connection event handlers
      this.setupEventHandlers();
      
      logger.info('MongoDB connection established successfully');
      
      // Create indexes if in development
      if (process.env.NODE_ENV === 'development') {
        await this.ensureIndexes();
      }
      
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.connection) return;

    this.connection.on('connected', () => {
      logger.info('MongoDB connected');
    });

    this.connection.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
    });

    this.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await this.connection?.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        logger.error('Error during MongoDB disconnection:', error);
        process.exit(1);
      }
    });
  }

  private async ensureIndexes(): Promise<void> {
    try {
      logger.info('Ensuring database indexes...');
      
      // Get all registered models
      const models = mongoose.models;
      
      for (const modelName in models) {
        const model = models[modelName];
        await model.createIndexes();
        logger.debug(`Indexes created for model: ${modelName}`);
      }
      
      logger.info('Database indexes ensured successfully');
    } catch (error) {
      logger.error('Failed to ensure database indexes:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
        logger.info('MongoDB disconnected successfully');
      }
    } catch (error) {
      logger.error('Failed to disconnect from MongoDB:', error);
      throw error;
    }
  }

  public async dropDatabase(): Promise<void> {
    try {
      if (this.connection && process.env.NODE_ENV === 'test') {
        await this.connection.db.dropDatabase();
        logger.info('Test database dropped successfully');
      }
    } catch (error) {
      logger.error('Failed to drop database:', error);
      throw error;
    }
  }

  public isConnected(): boolean {
    return this.connection?.readyState === 1;
  }

  public getConnection(): mongoose.Connection | null {
    return this.connection;
  }

  // Health check method
  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: {
      connected: boolean;
      readyState: number;
      host?: string;
      port?: number;
      name?: string;
    };
  }> {
    const connection = this.connection;
    
    if (!connection) {
      return {
        status: 'unhealthy',
        details: {
          connected: false,
          readyState: 0,
        },
      };
    }

    const isHealthy = connection.readyState === 1;
    
    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      details: {
        connected: isHealthy,
        readyState: connection.readyState,
        host: connection.host,
        port: connection.port,
        name: connection.name,
      },
    };
  }
}

// Export singleton instance methods
const database = Database.getInstance();

export const connectDatabase = (): Promise<void> => database.connect();
export const disconnectDatabase = (): Promise<void> => database.disconnect();
export const dropDatabase = (): Promise<void> => database.dropDatabase();
export const isDatabaseConnected = (): boolean => database.isConnected();
export const getDatabaseConnection = (): mongoose.Connection | null => database.getConnection();
export const databaseHealthCheck = () => database.healthCheck();

// Export the database instance for advanced usage
export { database };

// Export mongoose for model creation
export { mongoose };


