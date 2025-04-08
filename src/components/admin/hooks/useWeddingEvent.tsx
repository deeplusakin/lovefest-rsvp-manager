
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWeddingEvent = () => {
  const [weddingEventId, setWeddingEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeddingEventId = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id')
        .ilike('name', '%wedding%')
        .limit(1);
      
      if (error) {
        console.error('Error fetching Wedding event:', error);
      } else if (data && data.length > 0) {
        setWeddingEventId(data[0].id);
      }
      
      setIsLoading(false);
    };

    fetchWeddingEventId();
  }, []);

  return { weddingEventId, isLoading };
};
