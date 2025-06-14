
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

      // First, fetch guests for this household
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

      // Fetch all events separately to ensure we have them
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('*');

      console.log("All events query result:", { allEvents, error: eventsError });

      if (eventsError) {
        console.error("Error fetching events:", eventsError);
        throw eventsError;
      }

      // Fetch guest_events for these guests
      const { data: guestEventsData, error: guestEventsError } = await supabase
        .from('guest_events')
        .select('*')
        .in('guest_id', guestsData.map(g => g.id));

      console.log("Guest events query result:", { guestEventsData, error: guestEventsError });

      if (guestEventsError) {
        console.error("Error fetching guest events:", guestEventsError);
        throw guestEventsError;
      }

      // Manually combine the data to ensure proper structure
      const guestsWithEvents = guestsData.map(guest => {
        const guestEvents = guestEventsData?.filter(ge => ge.guest_id === guest.id) || [];
        
        return {
          ...guest,
          guest_events: guestEvents.map(ge => {
            // Find the corresponding event
            const eventData = allEvents?.find(event => event.id === ge.event_id);
            
            return {
              event_id: ge.event_id,
              status: ge.status,
              events: eventData || {
                name: "Event Not Found",
                date: new Date().toISOString(),
                location: "TBD"
              }
            };
          })
        };
      });

      console.log("Final guests with events structure:", guestsWithEvents);
      console.log("Sample guest event structure:", guestsWithEvents[0]?.guest_events);
      
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
