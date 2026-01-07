/**
 * In-memory request cache for NOTA API
 * TTL: 15 minutes
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class RequestCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes

  /**
   * Generate cache key from endpoint and params
   */
  getKey(endpoint: string, params: unknown): string {
    const paramsStr = JSON.stringify(params);
    return `${endpoint}-${paramsStr}`;
  }

  /**
   * Get cached data if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Expired, remove from cache
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton instance
export const requestCache = new RequestCache();

// Cleanup expired entries every 5 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    requestCache.cleanup();
  }, 5 * 60 * 1000);
}

