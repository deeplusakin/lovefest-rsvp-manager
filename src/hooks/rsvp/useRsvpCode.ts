
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRsvpCode() {
  const [isLoading, setIsLoading] = useState(false);

  const validateCode = async (invitationCode: string): Promise<string | null> => {
    setIsLoading(true);

    try {
      // Use our new validation function
      const { data, error } = await supabase
        .rpc('validate_invitation_code', {
          code: invitationCode.toUpperCase()
        });
      
      if (error || !data) {
        throw new Error("Invalid invitation code");
      }

      toast.success("Welcome! You can now RSVP for your household.");
      return data as string; // This returns the household_id

    } catch (error: any) {
      toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { validateCode, isLoading };
}
