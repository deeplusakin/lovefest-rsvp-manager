
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, Contribution, GuestEvent } from "@/types/admin";
import { toast } from "sonner";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 8000;

export const useAdminData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Timeout reference for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check session first before attempting any data fetches
  useEffect(() => {
    const checkSession = async () => {
      console.time('session-check');
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          timeoutRef.current = setTimeout(() => {
            reject(new Error('Session check timed out'));
          }, REQUEST_TIMEOUT);
        });
        
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise as Promise<any>
        ]);
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        
        console.timeEnd('session-check');
        setHasSession(!!session);
      } catch (error) {
        console.error('Session check error:', error);
        console.timeEnd('session-check');
        setHasSession(false);
      }
    };
    
    checkSession();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const fetchEvents = useCallback(async () => {
    if (hasSession === false) return; // Skip if we know there's no session
    
    try {
      console.time('events-fetch');
      setIsLoading(true);
      
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Events fetch timed out'));
        }, REQUEST_TIMEOUT);
      });
      
      const { data: { session } } = await Promise.race([
        sessionPromise,
        timeoutPromise as Promise<any>
      ]);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (!session) {
        console.log("Skipping events fetch - no active session");
        return;
      }

      const eventsPromise = supabase
        .from("events")
        .select(`
          id,
          name,
          date,
          location,
          description,
          guest_events (
            guest_id,
            status,
            response_date,
            guest:guests (
              first_name,
              last_name,
              email,
              dietary_restrictions
            )
          )
        `)
        .order("date");
      
      const eventsTimeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Events data fetch timed out'));
        }, REQUEST_TIMEOUT);
      });
      
      const { data: eventsData, error: eventsError } = await Promise.race([
        eventsPromise,
        eventsTimeoutPromise as Promise<any>
      ]);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (eventsError) {
        console.error("Events fetch error:", eventsError);
        throw eventsError;
      }
      
      console.timeEnd('events-fetch');

      // Log the raw date values to debug
      console.log("Raw event dates:", eventsData?.map(e => ({ name: e.name, date: e.date })));
      
      // Cast the status field to the proper type
      const typedEventsData = eventsData?.map(event => ({
        ...event,
        guest_events: event.guest_events.map(ge => ({
          ...ge,
          status: ge.status as GuestEvent['status']
        }))
      })) as Event[];
      
      setEvents(typedEventsData || []);
      setIsError(false);
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
      setEvents([]);
      setIsError(true);
      
      // Only show toast if we're on the admin page and not on login
      if (window.location.pathname === '/admin') {
        toast.error("Error loading events", {
          id: "events-error", // Add a unique ID to prevent duplicate toasts
        });
      }
    } finally {
      setIsLoading(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [hasSession]);

  const fetchContributions = useCallback(async () => {
    if (hasSession === false) return; // Skip if we know there's no session
    
    try {
      console.time('contributions-fetch');
      setIsLoading(true);
      
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Contributions session check timed out'));
        }, REQUEST_TIMEOUT);
      });
      
      const { data: { session } } = await Promise.race([
        sessionPromise,
        timeoutPromise as Promise<any>
      ]);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (!session) {
        console.log("Skipping contributions fetch - no active session");
        return;
      }

      const contributionsPromise = supabase
        .from("contributions")
        .select(`
          id,
          amount,
          message,
          created_at,
          guest_id,
          guests (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false });
      
      const contributionsTimeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Contributions data fetch timed out'));
        }, REQUEST_TIMEOUT);
      });
      
      const { data: contributionsData, error: contributionsError } = await Promise.race([
        contributionsPromise,
        contributionsTimeoutPromise as Promise<any>
      ]);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      console.timeEnd('contributions-fetch');

      if (contributionsError) {
        console.error("Contributions fetch error:", contributionsError);
        throw contributionsError;
      }

      // Filter out contributions where guests might be null (if a guest was deleted)
      const validContributions = contributionsData?.filter(contrib => contrib.guests) || [];
      setContributions(validContributions);
      
      const total = validContributions.reduce(
        (sum, contrib) => sum + Number(contrib.amount),
        0
      );
      setTotalContributions(total);
      setIsError(false);
    } catch (error: any) {
      console.error("Error fetching contributions:", error.message);
      
      // Only show toast if we're on the admin page and not on login
      if (window.location.pathname === '/admin') {
        toast.error("Error loading contributions", {
          id: "contributions-error", // Add a unique ID to prevent duplicate toasts
        });
      }
      setContributions([]);
      setTotalContributions(0);
      setIsError(true);
    } finally {
      setIsLoading(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [hasSession]);

  const fetchData = useCallback(async () => {
    if (hasSession === null) return; // Wait until we know session state
    if (hasSession === false) {
      setIsLoading(false);
      return; // Skip if we know there's no session
    }
    
    // Add debounce to prevent multiple rapid fetches
    const now = Date.now();
    if (now - lastFetchTime < 1000) { // 1 second debounce
      console.log("Skipping fetch, too soon since last fetch");
      return;
    }
    setLastFetchTime(now);
    
    setIsLoading(true);
    console.time('admin-data-fetch');
    
    try {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Session check timed out during data fetch'));
        }, REQUEST_TIMEOUT);
      });
      
      const { data: { session } } = await Promise.race([
        sessionPromise,
        timeoutPromise as Promise<any>
      ]);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (!session) {
        console.log("No active session");
        setIsLoading(false);
        return;
      }
      
      // Use Promise.allSettled to ensure both fetches run to completion regardless of errors
      const results = await Promise.allSettled([fetchEvents(), fetchContributions()]);
      
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Request ${index} failed:`, result.reason);
        }
      });
      
      console.timeEnd('admin-data-fetch');
    } catch (error: any) {
      console.error("Error fetching data:", error);
      
      // Only show toast if we're on the admin page and not on login
      if (window.location.pathname === '/admin') {
        toast.error("Error loading admin data", {
          id: "admin-data-error", // Add a unique ID to prevent duplicate toasts
        });
      }
    } finally {
      setIsLoading(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [fetchEvents, fetchContributions, hasSession, lastFetchTime]);

  // Trigger fetchData when hasSession changes
  useEffect(() => {
    if (hasSession !== null) {
      fetchData();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [hasSession, fetchData]);

  return {
    events,
    contributions,
    totalContributions,
    isLoading,
    isError,
    fetchData,
    fetchEvents,
    fetchContributions,
  };
};
