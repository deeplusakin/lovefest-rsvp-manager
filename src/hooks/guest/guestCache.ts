
import { Guest } from "@/components/admin/types/guest";
import { GuestCache } from "./types";

// Cache expires after 2 minutes
export const CACHE_EXPIRY = 2 * 60 * 1000;

// Create a global cache for guests data to prevent duplicate fetching
export let guestCache: GuestCache = {
  data: [],
  timestamp: 0,
  isLoading: false,
  loadPromise: null
};

export const resetCache = (): void => {
  console.log('Guest cache reset');
  guestCache = {
    data: [],
    timestamp: 0,
    isLoading: false,
    loadPromise: null
  };
};

export const isCacheValid = (): boolean => {
  const isValid = (
    guestCache.data.length > 0 && 
    Date.now() - guestCache.timestamp < CACHE_EXPIRY
  );
  console.log(`Cache valid: ${isValid}, age: ${(Date.now() - guestCache.timestamp)/1000}s`);
  return isValid;
};

export const invalidateCache = (): void => {
  console.log('Guest cache invalidated');
  guestCache.timestamp = 0;
};

export const updateCache = (data: Guest[]): void => {
  console.log(`Updating guest cache with ${data.length} records`);
  guestCache.data = data;
  guestCache.timestamp = Date.now();
};
