
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRsvpCode() {
  const [isLoading, setIsLoading] = useState(false);

  const validateCode = async (invitationCode: string): Promise<string | null> => {
    setIsLoading(true);

    try {
      // Find the household with the given invitation code
      const { data: householdData, error: householdError } = await supabase
        .from("households")
        .select("id")
        .eq("invitation_code", invitationCode)
        .single();

      if (householdError || !householdData) {
        throw new Error("Invalid invitation code");
      }

      toast.success("Welcome! You can now RSVP for your household.");
      return householdData.id;

    } catch (error: any) {
      toast.error(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { validateCode, isLoading };
}
