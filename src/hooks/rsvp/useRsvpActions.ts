
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest, RsvpResponses, GuestDetailsMap } from "@/types/rsvp";

interface UseRsvpActionsProps {
  responses: RsvpResponses;
  setResponses: (responses: RsvpResponses) => void;
  guestDetails: GuestDetailsMap;
  setGuestDetails: (guestDetails: GuestDetailsMap) => void;
  guests: Guest[];
}

export const useRsvpActions = ({
  responses,
  setResponses,
  guestDetails,
  setGuestDetails,
  guests
}: UseRsvpActionsProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleRsvpChange = async (guestId: string, eventId: string, status: string) => {
    try {
      setResponses(prev => ({
        ...prev,
        [guestId]: {
          ...prev[guestId],
          [eventId]: status
        }
      }));
      
      setHasChanges(true);

      const guest = guests.find(g => g.id === guestId);
      const event = guest?.guest_events.find(ge => ge.event_id === eventId)?.events;

      const { error } = await supabase
        .from('guest_events')
        .update({
          status: status as 'attending' | 'declined',
          response_date: new Date().toISOString()
        })
        .eq('guest_id', guestId)
        .eq('event_id', eventId);

      if (error) throw error;
      
      // Show success message with guest name and event details
      const responseMessage = status === 'attending' ? 'will attend' : 'cannot attend';
      toast.success(
        `Thank you! We've recorded that ${guest?.first_name} ${responseMessage} ${event?.name}.`
      );
    } catch (error: any) {
      toast.error("Failed to update RSVP");
      console.error('Error:', error);
    }
  };

  const handleGuestDetailChange = (
    guestId: string,
    field: 'email' | 'phone' | 'dietary_restrictions',
    value: string
  ) => {
    setGuestDetails(prev => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value
      }
    }));
    
    setHasChanges(true);
  };

  return {
    message,
    setMessage,
    isSubmitting,
    setIsSubmitting,
    hasChanges,
    setHasChanges,
    handleRsvpChange,
    handleGuestDetailChange
  };
};
