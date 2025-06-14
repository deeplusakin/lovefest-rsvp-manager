
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest, RsvpResponses, GuestDetailsMap } from "@/types/rsvp";

export const useFetchHouseholdGuests = (householdId: string) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<RsvpResponses>({});
  const [guestDetails, setGuestDetails] = useState<GuestDetailsMap>({});

  useEffect(() => {
    if (householdId) {
      console.log("Fetching guests for household:", householdId);
      fetchHouseholdGuests();
    }
  }, [householdId]);

  const fetchHouseholdGuests = async () => {
    try {
      setLoading(true);
      console.log("Starting to fetch household guests for ID:", householdId);

      // First, let's check if guests exist for this household
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .eq('household_id', householdId);

      console.log("Basic guests query result:", { guestsData, error: guestsError });

      if (guestsError) {
        console.error("Error fetching basic guests:", guestsError);
        throw guestsError;
      }

      if (!guestsData || guestsData.length === 0) {
        console.log("No guests found for household:", householdId);
        setGuests([]);
        setLoading(false);
        return;
      }

      // Now fetch guests with their events - using separate query for events
      const { data: guestEvents, error: guestEventsError } = await supabase
        .from('guest_events')
        .select(`
          guest_id,
          event_id,
          status,
          events (
            name,
            date,
            location
          )
        `)
        .in('guest_id', guestsData.map(g => g.id));

      console.log("Guest events query result:", { guestEvents, error: guestEventsError });

      if (guestEventsError) {
        console.error("Error fetching guest events:", guestEventsError);
        throw guestEventsError;
      }

      // Combine the data
      const guestsWithEvents = guestsData.map(guest => ({
        ...guest,
        guest_events: guestEvents?.filter(ge => ge.guest_id === guest.id).map(ge => ({
          event_id: ge.event_id,
          status: ge.status,
          events: ge.events
        })) || []
      }));

      console.log("Combined guests with events:", guestsWithEvents);
      setGuests(guestsWithEvents);
      
      // Initialize responses state
      const initialResponses: RsvpResponses = {};
      const initialGuestDetails: GuestDetailsMap = {};
      
      guestsWithEvents.forEach(guest => {
        initialResponses[guest.id] = {};
        guest.guest_events?.forEach(event => {
          initialResponses[guest.id][event.event_id] = event.status;
        });
        
        initialGuestDetails[guest.id] = {
          email: guest.email,
          phone: guest.phone,
          dietary_restrictions: guest.dietary_restrictions
        };
      });
      
      setResponses(initialResponses);
      setGuestDetails(initialGuestDetails);
      
      console.log("Guests loaded successfully:", guestsWithEvents?.length || 0, "guests");
      
    } catch (error: any) {
      console.error("Error in fetchHouseholdGuests:", error);
      toast.error("Error fetching household members");
    } finally {
      setLoading(false);
    }
  };

  return {
    guests,
    loading,
    responses,
    setResponses,
    guestDetails,
    setGuestDetails,
    fetchHouseholdGuests
  };
};
