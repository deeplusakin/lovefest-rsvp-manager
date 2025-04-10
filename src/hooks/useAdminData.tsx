
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event, Contribution, GuestEvent } from "@/types/admin";
import { toast } from "sonner";

export const useAdminData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
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
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
      toast.error("Error loading events");
      setEvents([]);
    }
  }, []);

  const fetchContributions = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
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
    } catch (error: any) {
      console.error("Error fetching contributions:", error.message);
      toast.error("Error loading contributions");
      setContributions([]);
      setTotalContributions(0);
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
