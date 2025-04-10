
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, Contribution, GuestEvent } from "@/types/admin";
import { toast } from "sonner";

export const useAdminData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("Skipping events fetch - no active session");
        return;
      }

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

      if (eventsError) {
        console.error("Events fetch error:", eventsError);
        throw eventsError;
      }

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
      // Only show toast if we're not on the login page
      if (window.location.pathname !== '/login') {
        toast.error("Error loading events");
      }
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("Skipping contributions fetch - no active session");
        return;
      }

      const { data: contributionsData, error: contributionsError } = await supabase
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
      // Only show toast if we're not on the login page
      if (window.location.pathname !== '/login') {
        toast.error("Error loading contributions");
      }
      setContributions([]);
      setTotalContributions(0);
      setIsError(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If not on login page, show the error
        if (window.location.pathname !== '/login') {
          console.error("No active session");
          toast.error("Please log in to access admin data");
        }
        setIsLoading(false);
        return;
      }
      
      await Promise.all([fetchEvents(), fetchContributions()]);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      
      // Only show toast if we're not on the login page
      if (window.location.pathname !== '/login') {
        toast.error("Please log in to access admin data");
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchEvents, fetchContributions]);

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
