
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  dietary_restrictions: string | null;
  guest_events: {
    event_id: string;
    status: 'invited' | 'attending' | 'declined';
    events: {
      name: string;
      date: string;
      location: string;
    }
  }[];
}

export interface RsvpResponses {
  [guestId: string]: {
    [eventId: string]: string;
  };
}

export interface GuestDetail {
  email: string | null;
  phone: string | null;
  dietary_restrictions: string | null;
}

export interface GuestDetailsMap {
  [guestId: string]: GuestDetail;
}

export const useFetchHouseholdGuests = (householdId: string) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<RsvpResponses>({});
  const [guestDetails, setGuestDetails] = useState<GuestDetailsMap>({});

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
          email,
          phone,
          dietary_restrictions,
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
      const initialResponses: RsvpResponses = {};
      const initialGuestDetails: GuestDetailsMap = {};
      
      guests?.forEach(guest => {
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
      
    } catch (error: any) {
      toast.error("Error fetching household members");
      console.error('Error:', error);
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
