
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GuestDetailsMap } from "@/types/rsvp";

interface UseRsvpSubmissionProps {
  guestDetails: GuestDetailsMap;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setHasChanges: (hasChanges: boolean) => void;
}

export const useRsvpSubmission = ({
  guestDetails,
  setIsSubmitting,
  setHasChanges
}: UseRsvpSubmissionProps) => {
  
  const handleSubmitRsvp = async () => {
    setIsSubmitting(true);
    
    try {
      // Update guest details in the database
      for (const guestId in guestDetails) {
        const { error } = await supabase
          .from('guests')
          .update({
            email: guestDetails[guestId].email,
            phone: guestDetails[guestId].phone,
            dietary_restrictions: guestDetails[guestId].dietary_restrictions
          })
          .eq('id', guestId);
          
        if (error) {
          console.error(`Error updating guest ${guestId}:`, error);
          throw error;
        }
      }
      
      toast.success("Your RSVP has been successfully submitted!");
      setHasChanges(false);
    } catch (error: any) {
      toast.error("Failed to submit RSVP");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmitRsvp
  };
};
