
import { AdminAuthCache } from './types';

// Cache duration in milliseconds (5 minutes)
export const CACHE_DURATION = 5 * 60 * 1000;
// Supabase request timeout (8 seconds)
export const REQUEST_TIMEOUT = 8000;

// In-memory cache shared between hook instances
let authCache: AdminAuthCache | null = null;

export const getAuthCache = (): AdminAuthCache | null => authCache;

export const setAuthCache = (cache: AdminAuthCache | null): void => {
  authCache = cache;
};

// Function to check if the cache is still valid
export const isCacheValid = (): boolean => {
  return !!authCache && (Date.now() - authCache.lastChecked < CACHE_DURATION);
};

export const clearAuthCache = (): void => {
  authCache = null;
};
