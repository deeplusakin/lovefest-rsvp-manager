
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 8000;

export function useRsvpCode() {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const validateCode = async (invitationCode: string): Promise<string | null> => {
    setIsLoading(true);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<null>((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Code validation timed out'));
        }, REQUEST_TIMEOUT);
      });
      
      // Find the household with the given invitation code
      const householdPromise = supabase
        .from("households")
        .select("id")
        .eq("invitation_code", invitationCode)
        .single();
        
      // Race the supabase query against the timeout
      const { data: householdData, error: householdError } = await Promise.race([
        householdPromise,
        timeoutPromise as Promise<any>
      ]);
      
      // Clear timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (householdError || !householdData) {
        throw new Error("Invalid invitation code");
      }

      toast.success("Welcome! You can now RSVP for your household.", {
        id: "rsvp-code-valid"
      });
      return householdData.id;

    } catch (error: any) {
      toast.error(error.message, {
        id: "rsvp-code-error"
      });
      return null;
    } finally {
      setIsLoading(false);
      
      // Ensure timeout is cleared
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  return { validateCode, isLoading };
}
