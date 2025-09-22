import Redis from 'redis';
import { logger } from '@/utils/logger';

interface RedisConfig {
  url: string;
  options: any;
}

class RedisCache {
  private static instance: RedisCache;
  private client: Redis.RedisClientType | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  private getConfig(): RedisConfig {
    const isTest = process.env.NODE_ENV === 'test';
    
    // Use test Redis DB if in test environment
    const redisUrl = isTest 
      ? process.env.TEST_REDIS_URL || 'redis://localhost:6379/1'
      : process.env.REDIS_URL || 'redis://localhost:6379';

    const options = {
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    };

    return { url: redisUrl, options };
  }

  public async connect(): Promise<void> {
    try {
      const config = this.getConfig();
      
      logger.info(`Connecting to Redis: ${config.url.replace(/\/\/.*@/, '//***:***@')}`);
      
      this.client = Redis.createClient({
        url: config.url,
        ...config.options,
      });

      this.setupEventHandlers();
      
      await this.client.connect();
      
      this.isConnected = true;
      logger.info('Redis connection established successfully');
      
    } catch (error) {
      logger.error('Redis connection failed:', error);
      this.isConnected = false;
      // Don't throw error - Redis is optional for basic functionality
      logger.warn('Continuing without Redis cache');
    }
  }

  private setupEventHandlers(): void {
    if (!this.client) return;

    this.client.on('connect', () => {
      logger.info('Redis connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis ready');
    });

    this.client.on('error', (error) => {
      logger.error('Redis connection error:', error);
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
      this.isConnected = false;
    });

    this.client.on('end', () => {
      logger.warn('Redis connection closed');
      this.isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        if (this.client && this.isConnected) {
          await this.client.quit();
          logger.info('Redis connection closed through app termination');
        }
      } catch (error) {
        logger.error('Error during Redis disconnection:', error);
      }
    });
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.client && this.isConnected) {
        await this.client.quit();
        this.isConnected = false;
        logger.info('Redis disconnected successfully');
      }
    } catch (error) {
      logger.error('Failed to disconnect from Redis:', error);
      throw error;
    }
  }

  public async flushAll(): Promise<void> {
    try {
      if (this.client && this.isConnected && process.env.NODE_ENV === 'test') {
        await this.client.flushAll();
        logger.info('Redis cache flushed successfully');
      }
    } catch (error) {
      logger.error('Failed to flush Redis cache:', error);
      throw error;
    }
  }

  // Basic cache operations
  public async get(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  public async set(key: string, value: string, ttl?: number): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  public async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  public async exists(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      return false;
    }
  }

  public async expire(key: string, seconds: number): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.expire(key, seconds);
      return true;
    } catch (error) {
      logger.error('Redis EXPIRE error:', error);
      return false;
    }
  }

  // JSON cache operations
  public async getJSON<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      logger.error('Failed to parse JSON from Redis:', error);
      return null;
    }
  }

  public async setJSON<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      return await this.set(key, jsonValue, ttl);
    } catch (error) {
      logger.error('Failed to stringify JSON for Redis:', error);
      return false;
    }
  }

  // Hash operations
  public async hget(key: string, field: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      return await this.client.hGet(key, field);
    } catch (error) {
      logger.error('Redis HGET error:', error);
      return null;
    }
  }

  public async hset(key: string, field: string, value: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.hSet(key, field, value);
      return true;
    } catch (error) {
      logger.error('Redis HSET error:', error);
      return false;
    }
  }

  public async hgetall(key: string): Promise<Record<string, string> | null> {
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      return await this.client.hGetAll(key);
    } catch (error) {
      logger.error('Redis HGETALL error:', error);
      return null;
    }
  }

  // List operations
  public async lpush(key: string, value: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.lPush(key, value);
      return true;
    } catch (error) {
      logger.error('Redis LPUSH error:', error);
      return false;
    }
  }

  public async rpop(key: string): Promise<string | null> {
    if (!this.client || !this.isConnected) {
      return null;
    }

    try {
      return await this.client.rPop(key);
    } catch (error) {
      logger.error('Redis RPOP error:', error);
      return null;
    }
  }

  // Set operations
  public async sadd(key: string, member: string): Promise<boolean> {
    if (!this.client || !this.isConnected) {
      return false;
    }

    try {
      await this.client.sAdd(key, member);
      return true;
    } catch (error) {
      logger.error('Redis SADD error:', error);
      return false;
    }
  }

  public async smembers(key: string): Promise<string[]> {
    if (!this.client || !this.isConnected) {
      return [];
    }

    try {
      return await this.client.sMembers(key);
    } catch (error) {
      logger.error('Redis SMEMBERS error:', error);
      return [];
    }
  }

  // Utility methods
  public isRedisConnected(): boolean {
    return this.isConnected;
  }

  public getClient(): Redis.RedisClientType | null {
    return this.client;
  }

  // Health check method
  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    details: {
      connected: boolean;
      ping?: boolean;
      error?: string;
    };
  }> {
    if (!this.client || !this.isConnected) {
      return {
        status: 'unhealthy',
        details: {
          connected: false,
        },
      };
    }

    try {
      const pingResult = await this.client.ping();
      const isHealthy = pingResult === 'PONG';
      
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        details: {
          connected: this.isConnected,
          ping: isHealthy,
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          connected: false,
          ping: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }
}

// Export singleton instance methods
const redisCache = RedisCache.getInstance();

export const connectRedis = (): Promise<void> => redisCache.connect();
export const disconnectRedis = (): Promise<void> => redisCache.disconnect();
export const flushRedis = (): Promise<void> => redisCache.flushAll();
export const isRedisConnected = (): boolean => redisCache.isRedisConnected();
export const redisHealthCheck = () => redisCache.healthCheck();

// Export cache operations
export const cache = {
  get: (key: string) => redisCache.get(key),
  set: (key: string, value: string, ttl?: number) => redisCache.set(key, value, ttl),
  del: (key: string) => redisCache.del(key),
  exists: (key: string) => redisCache.exists(key),
  expire: (key: string, seconds: number) => redisCache.expire(key, seconds),
  getJSON: <T>(key: string) => redisCache.getJSON<T>(key),
  setJSON: <T>(key: string, value: T, ttl?: number) => redisCache.setJSON(key, value, ttl),
  hget: (key: string, field: string) => redisCache.hget(key, field),
  hset: (key: string, field: string, value: string) => redisCache.hset(key, field, value),
  hgetall: (key: string) => redisCache.hgetall(key),
  lpush: (key: string, value: string) => redisCache.lpush(key, value),
  rpop: (key: string) => redisCache.rpop(key),
  sadd: (key: string, member: string) => redisCache.sadd(key, member),
  smembers: (key: string) => redisCache.smembers(key),
};

// Export the Redis instance for advanced usage
export { redisCache };


