
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest } from "@/types/rsvp";

interface UseMessageSubmissionProps {
  message: string;
  setMessage: (message: string) => void;
  guests: Guest[];
  responses: { [guestId: string]: { [eventId: string]: string } };
  setIsSubmitting: (isSubmitting: boolean) => void;
  setHasChanges: (hasChanges: boolean) => void;
}

export const useMessageSubmission = ({
  message,
  setMessage,
  guests,
  responses,
  setIsSubmitting,
  setHasChanges
}: UseMessageSubmissionProps) => {
  
  const handleSubmitMessage = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);

    try {
      const attendingGuests = guests.filter(guest => 
        Object.values(responses[guest.id] || {}).includes('attending')
      );

      if (attendingGuests.length === 0) {
        toast.error("At least one guest must be attending to leave a message");
        setIsSubmitting(false);
        return;
      }

      // Use the first attending guest as the message sender
      const firstAttendingGuest = attendingGuests[0];

      const { error } = await supabase
        .from('contributions')
        .insert({
          guest_id: firstAttendingGuest.id,
          message: message.trim(),
          amount: 0 // Required field, set to 0 for messages without contributions
        });

      if (error) throw error;

      toast.success("Thank you for your message!");
      setMessage("");
      setHasChanges(true);
    } catch (error: any) {
      toast.error("Failed to submit message");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmitMessage
  };
};
