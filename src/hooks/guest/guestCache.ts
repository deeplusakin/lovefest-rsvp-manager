
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
  guestCache = {
    data: [],
    timestamp: 0,
    isLoading: false,
    loadPromise: null
  };
};

export const isCacheValid = (): boolean => {
  return (
    guestCache.data.length > 0 && 
    Date.now() - guestCache.timestamp < CACHE_EXPIRY
  );
};

export const invalidateCache = (): void => {
  guestCache.timestamp = 0;
};

export const updateCache = (data: Guest[]): void => {
  guestCache.data = data;
  guestCache.timestamp = Date.now();
};
