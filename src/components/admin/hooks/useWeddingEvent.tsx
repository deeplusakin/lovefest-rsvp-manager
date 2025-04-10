
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWeddingEvent = () => {
  const [weddingEventId, setWeddingEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeddingEvent();
  }, []);

  const fetchWeddingEvent = async () => {
    try {
      // Find the main wedding event
      // We're assuming the first event with "wedding" in the name (case insensitive) is the main wedding event
      const { data, error } = await supabase
        .from('events')
        .select('id, name')
        .ilike('name', '%wedding%')
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setWeddingEventId(data[0].id);
      } else {
        // As a fallback, just get the first event
        const { data: allEvents, error: allEventsError } = await supabase
          .from('events')
          .select('id')
          .order('created_at', { ascending: true })
          .limit(1);
          
        if (allEventsError) throw allEventsError;
        
        if (allEvents && allEvents.length > 0) {
          setWeddingEventId(allEvents[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching wedding event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    weddingEventId,
    isLoading,
    fetchWeddingEvent
  };
};
