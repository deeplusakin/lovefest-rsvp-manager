
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuestEvent {
  event_id: string;
  status: 'not_invited' | 'invited' | 'attending' | 'declined';
  events: {
    name: string;
    date: string;
    location: string;
  };
}

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  guest_events: GuestEvent[];
}

export const useHouseholdRsvp = (householdId: string) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, Record<string, string>>>({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchHouseholdGuests();
  }, [householdId]);

  const fetchHouseholdGuests = async () => {
    try {
      const { data: guests, error } = await supabase
        .from('guests')
        .select(`
          id,
          first_name,
          last_name,
          guest_events (
            event_id,
            status,
            events (
              name,
              date,
              location
            )
          )
        `)
        .eq('household_id', householdId);

      if (error) throw error;

      setGuests(guests || []);
      
      // Initialize responses state
      const initialResponses: Record<string, Record<string, string>> = {};
      guests?.forEach(guest => {
        initialResponses[guest.id] = {};
        guest.guest_events?.forEach(event => {
          initialResponses[guest.id][event.event_id] = event.status;
        });
      });
      setResponses(initialResponses);
      
    } catch (error: any) {
      toast.error("Error fetching household members");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpChange = async (guestId: string, eventId: string, status: string) => {
    try {
      setResponses(prev => ({
        ...prev,
        [guestId]: {
          ...prev[guestId],
          [eventId]: status
        }
      }));

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

  const handleSubmitMessage = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);

    try {
      const attendingGuests = guests.filter(guest => 
        Object.values(responses[guest.id] || {}).includes('attending')
      );

      if (attendingGuests.length === 0) {
        toast.error("At least one guest must be attending to leave a message");
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
    } catch (error: any) {
      toast.error("Failed to submit message");
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    guests,
    loading,
    responses,
    message,
    setMessage,
    isSubmitting,
    handleRsvpChange,
    handleSubmitMessage
  };
};
