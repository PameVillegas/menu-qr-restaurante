import { getRedisClient } from './redis.js';

/**
 * Default TTL for menu cache (5 minutes)
 */
export const DEFAULT_MENU_TTL = 300; // 5 minutes in seconds

/**
 * Default TTL for session cache (24 hours)
 */
export const DEFAULT_SESSION_TTL = 86400; // 24 hours in seconds

/**
 * Cache helper functions for Redis operations
 */

/**
 * Get value from cache
 * @param key - Cache key
 * @returns Promise<string | null> - Cached value or null if not found
 */
export async function cacheGet(key: string): Promise<string | null> {
  const client = getRedisClient();
  
  if (!client || !client.isOpen) {
    console.warn('Redis client not available, skipping cache get');
    return null;
  }

  try {
    return await client.get(key);
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set value in cache with TTL
 * @param key - Cache key
 * @param value - Value to cache (will be stringified if object)
 * @param ttl - Time to live in seconds (default: 5 minutes for menu)
 * @returns Promise<boolean> - Success status
 */
export async function cacheSet(
  key: string,
  value: string | object,
  ttl: number = DEFAULT_MENU_TTL
): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client || !client.isOpen) {
    console.warn('Redis client not available, skipping cache set');
    return false;
  }

  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await client.setEx(key, ttl, stringValue);
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
}

/**
 * Delete value from cache
 * @param key - Cache key
 * @returns Promise<boolean> - Success status
 */
export async function cacheDelete(key: string): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client || !client.isOpen) {
    console.warn('Redis client not available, skipping cache delete');
    return false;
  }

  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
}

/**
 * Delete multiple keys matching a pattern
 * @param pattern - Key pattern (e.g., 'menu:*')
 * @returns Promise<number> - Number of keys deleted
 */
export async function cacheDeletePattern(pattern: string): Promise<number> {
  const client = getRedisClient();
  
  if (!client || !client.isOpen) {
    console.warn('Redis client not available, skipping cache delete pattern');
    return 0;
  }

  try {
    const keys = await client.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }
    return await client.del(keys);
  } catch (error) {
    console.error('Cache delete pattern error:', error);
    return 0;
  }
}

/**
 * Check if key exists in cache
 * @param key - Cache key
 * @returns Promise<boolean> - True if key exists
 */
export async function cacheExists(key: string): Promise<boolean> {
  const client = getRedisClient();
  
  if (!client || !client.isOpen) {
    console.warn('Redis client not available, skipping cache exists check');
    return false;
  }

  try {
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Cache exists error:', error);
    return false;
  }
}

/**
 * Get remaining TTL for a key
 * @param key - Cache key
 * @returns Promise<number> - TTL in seconds, -1 if no expiry, -2 if key doesn't exist
 */
export async function cacheTTL(key: string): Promise<number> {
  const client = getRedisClient();
  
  if (!client || !client.isOpen) {
    console.warn('Redis client not available, skipping cache TTL check');
    return -2;
  }

  try {
    return await client.ttl(key);
  } catch (error) {
    console.error('Cache TTL error:', error);
    return -2;
  }
}

/**
 * Cache key generators for consistent key naming
 */
export const CacheKeys = {
  menu: (restaurantId: string) => `menu:${restaurantId}`,
  session: (token: string) => `session:${token}`,
  menuPattern: () => 'menu:*',
  sessionPattern: () => 'session:*',
};
