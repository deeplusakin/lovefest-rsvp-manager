
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  events: {
    event_id: string;
    is_attending: boolean | null;
    events: {
      name: string;
      date: string;
      location: string;
    };
  }[];
}

interface HouseholdRsvpProps {
  householdId: string;
}

export const HouseholdRsvp = ({ householdId }: HouseholdRsvpProps) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, Record<string, string>>>({});

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

      const { error } = await supabase
        .from('guest_events')
        .update({
          status: status as 'attending' | 'declined',
          response_date: new Date().toISOString()
        })
        .eq('guest_id', guestId)
        .eq('event_id', eventId);

      if (error) throw error;
      
      toast.success("RSVP updated successfully");
    } catch (error: any) {
      toast.error("Failed to update RSVP");
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {guests.map(guest => (
        <Card key={guest.id} className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {guest.first_name} {guest.last_name}
          </h3>
          <div className="space-y-6">
            {guest.guest_events?.map(event => (
              <div key={event.event_id} className="space-y-3">
                <h4 className="font-medium">{event.events.name}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(event.events.date).toLocaleDateString()} at {event.events.location}
                </p>
                <RadioGroup
                  value={responses[guest.id]?.[event.event_id] || 'not_invited'}
                  onValueChange={(value) => handleRsvpChange(guest.id, event.event_id, value)}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="attending" id={`attending-${guest.id}-${event.event_id}`} />
                    <Label htmlFor={`attending-${guest.id}-${event.event_id}`}>Attending</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="declined" id={`declined-${guest.id}-${event.event_id}`} />
                    <Label htmlFor={`declined-${guest.id}-${event.event_id}`}>Cannot Attend</Label>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
