
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest, RsvpResponses, GuestDetailsMap } from "@/types/rsvp";

interface UseRsvpActionsProps {
  responses: RsvpResponses;
  setResponses: React.Dispatch<React.SetStateAction<RsvpResponses>>;
  guestDetails: GuestDetailsMap;
  setGuestDetails: React.Dispatch<React.SetStateAction<GuestDetailsMap>>;
  guests: Guest[];
  setHasChanges: (hasChanges: boolean) => void;
}

export const useRsvpActions = ({
  responses,
  setResponses,
  guestDetails,
  setGuestDetails,
  guests,
  setHasChanges
}: UseRsvpActionsProps) => {

  const handleRsvpChange = async (guestId: string, eventId: string, status: string) => {
    try {
      setResponses((prev: RsvpResponses) => ({
        ...prev,
        [guestId]: {
          ...(prev[guestId] || {}),
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
        ...(prev[guestId] || {}),
        [field]: value
      }
    }));
    
    setHasChanges(true);
  };

  return {
    handleRsvpChange,
    handleGuestDetailChange
  };
};
