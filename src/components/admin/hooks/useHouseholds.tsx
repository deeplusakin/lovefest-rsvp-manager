
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Household } from "../types/guest";

export const useHouseholds = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('households')
        .select('id, name, invitation_code, address')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setHouseholds(data || []);
    } catch (error) {
      console.error('Error fetching households:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    households,
    isLoading,
    fetchHouseholds
  };
};
