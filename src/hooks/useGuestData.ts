
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Guest } from "@/components/admin/types/guest";
import { toast } from "sonner";
import { useAdminAuthContext } from "./useAdminAuth";

// Create a global cache for guests data to prevent duplicate fetching
interface GuestCache {
  data: Guest[];
  timestamp: number;
  isLoading: boolean;
  loadPromise: Promise<Guest[]> | null;
}

// Cache expires after 2 minutes
const CACHE_EXPIRY = 2 * 60 * 1000;
let guestCache: GuestCache = {
  data: [],
  timestamp: 0,
  isLoading: false,
  loadPromise: null
};

export const useGuestData = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { isAdmin } = useAdminAuthContext();
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchGuests = useCallback(async (forceRefresh = false): Promise<Guest[]> => {
    // Skip if not authenticated
    if (!isAdmin) {
      setIsLoading(false);
      return [];
    }

    // Return cached data if it's fresh and not forcing a refresh
    if (!forceRefresh && 
        guestCache.data.length > 0 && 
        Date.now() - guestCache.timestamp < CACHE_EXPIRY) {
      console.log('Using cached guest data');
      return guestCache.data;
    }

    // If there's already a request in progress, return its promise
    if (!forceRefresh && guestCache.isLoading && guestCache.loadPromise) {
      console.log('Using existing guest data request');
      return guestCache.loadPromise;
    }

    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setIsError(false);
    guestCache.isLoading = true;

    // Create a promise for the data fetch
    const fetchPromise = new Promise<Guest[]>(async (resolve, reject) => {
      try {
        console.time('guests-fetch');
        
        const { data, error } = await supabase
          .from('guests')
          .select(`
            id,
            first_name,
            last_name,
            email,
            phone,
            dietary_restrictions,
            household_id,
            household:households (name, invitation_code, address)
          `)
          .order('last_name')
          .abortSignal(abortControllerRef.current?.signal);

        console.timeEnd('guests-fetch');
        
        if (error) throw error;
        
        // Update the cache and state
        guestCache.data = data as Guest[];
        guestCache.timestamp = Date.now();
        setGuests(data as Guest[]);
        resolve(data as Guest[]);
      } catch (error: any) {
        console.error('Error fetching guests:', error);
        
        // Don't show error if it's an abort error (user navigated away)
        if (error.name !== 'AbortError') {
          setIsError(true);
          toast.error("Error fetching guest data", {
            id: "guest-fetch-error"
          });
        }
        reject(error);
      } finally {
        setIsLoading(false);
        guestCache.isLoading = false;
        guestCache.loadPromise = null;
        abortControllerRef.current = null;
      }
    });
    
    // Store the promise in the cache
    guestCache.loadPromise = fetchPromise;
    
    return fetchPromise;
  }, [isAdmin]);

  // Initial fetch on mount if we're an admin
  useEffect(() => {
    if (isAdmin) {
      fetchGuests()
        .then(data => setGuests(data))
        .catch(() => {}); // Error already handled in fetchGuests
    }
    
    // Cleanup function to cancel any pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchGuests, isAdmin]);

  // Clear cache on auth change
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      guestCache = {
        data: [],
        timestamp: 0,
        isLoading: false,
        loadPromise: null
      };
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    guests,
    isLoading,
    isError,
    fetchGuests,
    invalidateCache: () => {
      guestCache.timestamp = 0;
    }
  };
};
