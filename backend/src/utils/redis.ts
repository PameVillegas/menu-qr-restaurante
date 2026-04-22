import { createClient, RedisClientType } from 'redis';
import { config } from './config.js';

let redisClient: RedisClientType | null = null;

/**
 * Initialize Redis client connection
 * @returns Promise<RedisClientType>
 */
export async function initRedis(): Promise<RedisClientType> {
  if (redisClient) {
    return redisClient;
  }

  redisClient = createClient({
    url: config.redis.url,
    socket: {
      host: config.redis.host,
      port: config.redis.port,
      reconnectStrategy: (retries) => {
        // Exponential backoff with max 3 seconds
        const delay = Math.min(retries * 50, 3000);
        console.log(`Redis reconnecting in ${delay}ms (attempt ${retries})`);
        return delay;
      },
    },
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('Redis Client Connected');
  });

  redisClient.on('ready', () => {
    console.log('Redis Client Ready');
  });

  redisClient.on('reconnecting', () => {
    console.log('Redis Client Reconnecting');
  });

  await redisClient.connect();

  return redisClient;
}

/**
 * Get Redis client instance
 * @returns RedisClientType | null
 */
export function getRedisClient(): RedisClientType | null {
  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis Client Disconnected');
  }
}
