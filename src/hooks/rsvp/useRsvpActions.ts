
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest, RsvpResponses, GuestDetailsMap } from "./useFetchHouseholdGuests";

interface UseRsvpActionsProps {
  responses: RsvpResponses;
  setResponses: (responses: RsvpResponses | ((prev: RsvpResponses) => RsvpResponses)) => void;
  guestDetails: GuestDetailsMap;
  setGuestDetails: (guestDetails: GuestDetailsMap | ((prev: GuestDetailsMap) => GuestDetailsMap)) => void;
  guests: Guest[];
}

export const useRsvpActions = ({
  responses,
  setResponses,
  guestDetails,
  setGuestDetails,
  guests
}: UseRsvpActionsProps) => {
  const [hasChanges, setHasChanges] = useState(false);

  const handleRsvpChange = async (guestId: string, eventId: string, status: string) => {
    try {
      setResponses((prev: RsvpResponses) => ({
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
    setGuestDetails((prev: GuestDetailsMap) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        [field]: value
      }
    }));
    
    setHasChanges(true);
  };

  return {
    hasChanges,
    setHasChanges,
    handleRsvpChange,
    handleGuestDetailChange
  };
};
