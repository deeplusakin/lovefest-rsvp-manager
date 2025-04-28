
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/admin";
import { toast } from "sonner";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 8000;

export const useEventsData = (isAdmin: boolean, session: any | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEvents = useCallback(async (): Promise<Event[]> => {
    if (!isAdmin || !session) return []; // Skip if not authenticated
    
    try {
      console.time('events-fetch');
      setIsLoading(true);
      
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
          status: ge.status as Event["guest_events"][0]["status"]
        }))
      })) as Event[];
      
      setEvents(typedEventsData || []);
      setIsError(false);
      return typedEventsData || [];
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
    events,
    isLoading,
    isError,
    fetchEvents,
  };
};
