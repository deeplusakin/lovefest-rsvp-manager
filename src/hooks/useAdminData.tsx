
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, Contribution } from "@/types/admin";
import { toast } from "sonner";

export const useAdminData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);  // Changed to false initially

  const fetchEvents = useCallback(async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
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

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
      toast.error("Error loading events");
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    try {
      const { data: contributionsData, error: contributionsError } = await supabase
        .from("contributions")
        .select(`
          id,
          amount,
          message,
          created_at,
          guests (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false });

      if (contributionsError) throw contributionsError;
      setContributions(contributionsData || []);

      const total = (contributionsData || []).reduce(
        (sum, contrib) => sum + contrib.amount,
        0
      );
      setTotalContributions(total);
    } catch (error: any) {
      console.error("Error fetching contributions:", error.message);
      toast.error("Error loading contributions");
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }
      await Promise.all([fetchEvents(), fetchContributions()]);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Please log in to access admin data");
    } finally {
      setIsLoading(false);
    }
  }, [fetchEvents, fetchContributions]);

  return {
    events,
    contributions,
    totalContributions,
    isLoading,
    fetchData,
    fetchEvents,
    fetchContributions,
  };
};
