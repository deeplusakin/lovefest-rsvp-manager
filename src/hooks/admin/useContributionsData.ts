
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Contribution } from "@/types/admin";
import { toast } from "sonner";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 8000;

export const useContributionsData = (isAdmin: boolean, session: any | null) => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchContributions = useCallback(async (): Promise<Contribution[]> => {
    if (!isAdmin || !session) return []; // Skip if not authenticated
    
    try {
      console.time('contributions-fetch');
      setIsLoading(true);
      
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
      return validContributions;
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
      return [];
    } finally {
      setIsLoading(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [isAdmin, session]);

  return {
    contributions,
    totalContributions,
    isLoading,
    isError,
    fetchContributions,
  };
};
