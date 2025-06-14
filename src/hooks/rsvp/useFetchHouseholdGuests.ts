
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

      // Now fetch guests with their events using a more explicit join
      const { data: guestsWithEvents, error: eventsError } = await supabase
        .from('guests')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          dietary_restrictions,
          guest_events (
            event_id,
            status,
            events!guest_events_event_id_fkey (
              name,
              date,
              location
            )
          )
        `)
        .eq('household_id', householdId);

      console.log("Guests with events query result:", { guestsWithEvents, error: eventsError });

      if (eventsError) {
        console.error("Error fetching guests with events:", eventsError);
        throw eventsError;
      }

      // Explicitly cast the data to match our Guest[] type
      const typedGuests = guestsWithEvents as unknown as Guest[];
      console.log("Typed guests:", typedGuests);
      setGuests(typedGuests || []);
      
      // Initialize responses state
      const initialResponses: RsvpResponses = {};
      const initialGuestDetails: GuestDetailsMap = {};
      
      typedGuests?.forEach(guest => {
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
      
      console.log("Guests loaded successfully:", typedGuests?.length || 0, "guests");
      
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
