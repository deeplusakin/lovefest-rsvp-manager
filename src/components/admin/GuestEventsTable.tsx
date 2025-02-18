
import { Button } from "@/components/ui/button";
import { GuestEvent } from "@/types/admin";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuestEventsTableProps {
  guests: GuestEvent[];
  eventId: string;
}

type RsvpStatus = "not_invited" | "invited" | "attending" | "declined";

export const GuestEventsTable = ({ guests, eventId }: GuestEventsTableProps) => {
  const [addingEventToGuest, setAddingEventToGuest] = useState<string | null>(null);
  const [availableEvents, setAvailableEvents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchAvailableEvents = async (guestId: string) => {
    try {
      // Get all events
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, name');

      if (eventsError) throw eventsError;

      // Get events the guest is already invited to
      const { data: guestEvents, error: guestEventsError } = await supabase
        .from('guest_events')
        .select('event_id')
        .eq('guest_id', guestId);

      if (guestEventsError) throw guestEventsError;

      // Filter out events the guest is already invited to
      const existingEventIds = guestEvents?.map(ge => ge.event_id) || [];
      const availableEvts = allEvents?.filter(event => !existingEventIds.includes(event.id)) || [];

      setAvailableEvents(availableEvts);
      setSelectedEvent(availableEvts[0]?.id || "");
    } catch (error) {
      console.error('Error fetching available events:', error);
      toast.error("Error fetching available events");
    }
  };

  const addGuestToEvent = async (guestId: string) => {
    if (!selectedEvent) {
      toast.error("Please select an event");
      return;
    }

    try {
      const { error: addError } = await supabase
        .from('guest_events')
        .insert({
          guest_id: guestId,
          event_id: selectedEvent,
          status: 'invited'
        });

      if (addError) throw addError;

      toast.success("Guest added to event successfully");
      setAddingEventToGuest(null);
      setSelectedEvent("");
      
      // Refresh the page to show updated guest list
      window.location.reload();
    } catch (error) {
      console.error('Error adding guest to event:', error);
      toast.error("Error adding guest to event");
    }
  };

  const handleStatusUpdate = async (guestId: string, newStatus: RsvpStatus) => {
    setUpdatingStatus(guestId);
    try {
      const { error } = await supabase
        .from('guest_events')
        .update({ 
          status: newStatus,
          response_date: newStatus === 'invited' ? null : new Date().toISOString()
        })
        .eq('guest_id', guestId)
        .eq('event_id', eventId);

      if (error) throw error;

      toast.success("RSVP status updated successfully");
      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error updating RSVP status:', error);
      toast.error("Error updating RSVP status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleAddEvent = async (guestId: string) => {
    setAddingEventToGuest(guestId);
    await fetchAvailableEvents(guestId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Guest</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Response Date</th>
            <th className="text-left p-2">Dietary Restrictions</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guestEvent) => (
            <tr key={`${guestEvent.guest_id}-${eventId}`} className="border-b">
              <td className="p-2">
                {guestEvent.guest.first_name} {guestEvent.guest.last_name}
              </td>
              <td className="p-2">{guestEvent.guest.email || "-"}</td>
              <td className="p-2">
                <Select
                  value={guestEvent.status}
                  onValueChange={(value: RsvpStatus) => handleStatusUpdate(guestEvent.guest_id, value)}
                  disabled={!!updatingStatus}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="p-2">{guestEvent.response_date ? new Date(guestEvent.response_date).toLocaleDateString() : "-"}</td>
              <td className="p-2">{guestEvent.guest.dietary_restrictions || "-"}</td>
              <td className="p-2">
                {addingEventToGuest === guestEvent.guest_id ? (
                  <div className="flex items-center gap-2">
                    <Select 
                      value={selectedEvent}
                      onValueChange={setSelectedEvent}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEvents.map(event => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      onClick={() => addGuestToEvent(guestEvent.guest_id)}
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAddingEventToGuest(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddEvent(guestEvent.guest_id)}
                  >
                    Add to Event
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
