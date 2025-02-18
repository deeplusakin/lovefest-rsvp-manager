
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddEventFormProps, AvailableEvent } from "./types/guest-events";

export const GuestEventAddForm = ({ guestId, onCancel, onSuccess }: AddEventFormProps) => {
  const [availableEvents, setAvailableEvents] = useState<AvailableEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const fetchAvailableEvents = async () => {
    try {
      const { data: allEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, name');

      if (eventsError) throw eventsError;

      const { data: guestEvents, error: guestEventsError } = await supabase
        .from('guest_events')
        .select('event_id')
        .eq('guest_id', guestId);

      if (guestEventsError) throw guestEventsError;

      const existingEventIds = guestEvents?.map(ge => ge.event_id) || [];
      const availableEvts = allEvents?.filter(event => !existingEventIds.includes(event.id)) || [];

      setAvailableEvents(availableEvts);
      setSelectedEvent(availableEvts[0]?.id || "");
    } catch (error) {
      console.error('Error fetching available events:', error);
      toast.error("Error fetching available events");
    }
  };

  const handleAddGuestToEvent = async () => {
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
      onSuccess();
    } catch (error) {
      console.error('Error adding guest to event:', error);
      toast.error("Error adding guest to event");
    }
  };

  // Fetch available events when component mounts
  useState(() => {
    fetchAvailableEvents();
  });

  return (
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
        onClick={handleAddGuestToEvent}
      >
        Add
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};
