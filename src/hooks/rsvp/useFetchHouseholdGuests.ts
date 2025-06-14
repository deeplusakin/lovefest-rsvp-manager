
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

      // Fetch guests with their guest_events and events in a single query
      const { data: guestsWithEvents, error: guestsError } = await supabase
        .from('guests')
        .select(`
          *,
          guest_events (
            event_id,
            status,
            events (
              id,
              name,
              date,
              location,
              description
            )
          )
        `)
        .eq('household_id', householdId);

      console.log("Guests query result:", { guestsWithEvents, error: guestsError });

      if (guestsError) {
        console.error("Error fetching guests with events:", guestsError);
        throw guestsError;
      }

      if (!guestsWithEvents || guestsWithEvents.length === 0) {
        console.log("No guests found for household:", householdId);
        setGuests([]);
        setLoading(false);
        return;
      }

      console.log("Raw guests data structure:", JSON.stringify(guestsWithEvents, null, 2));
      
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
      console.log("Initial responses:", initialResponses);
      
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
