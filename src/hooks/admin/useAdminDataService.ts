
import { useState, useCallback, useEffect, useRef } from "react";
import { useEventsData } from "./useEventsData";
import { useContributionsData } from "./useContributionsData";
import { useAdminAuthContext } from "../useAdminAuth";
import { AdminDataHookReturn } from "./types";

export const useAdminDataService = (): AdminDataHookReturn => {
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the centralized auth context instead of running separate session checks
  const { isAdmin, session } = useAdminAuthContext();
  
  const {
    events,
    isLoading: eventsLoading,
    isError: eventsError,
    fetchEvents
  } = useEventsData(isAdmin, session);
  
  const {
    contributions,
    totalContributions,
    isLoading: contributionsLoading,
    isError: contributionsError,
    fetchContributions
  } = useContributionsData(isAdmin, session);

  // Combined loading and error states
  const isError = eventsError || contributionsError;
  
  // Track if component is mounted
  const isMountedRef = useRef(true);

  useEffect(() => {
    setIsLoading(eventsLoading || contributionsLoading);
  }, [eventsLoading, contributionsLoading]);

  const fetchData = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return; // Skip if not authenticated
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
      if (window.location.pathname === '/admin' && isMountedRef.current) {
        // Toast handled in individual fetchers
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchEvents, fetchContributions, isAdmin, lastFetchTime]);

  // Fetch data when auth state changes
  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [isAdmin, fetchData]);

  return {
    events,
    contributions,
    totalContributions,
    isLoading,
    isError,
    lastFetchTime,
    fetchData,
    fetchEvents,
    fetchContributions,
  };
};
