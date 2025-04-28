
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Event, EventFormData } from "@/types/admin";
import { useEffect } from "react";

interface EventFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  eventFormData: EventFormData;
  setEventFormData: (data: EventFormData) => void;
  editingEvent: Event | null;
  onCancel: () => void;
}

export const EventForm = ({
  onSubmit,
  eventFormData,
  setEventFormData,
  editingEvent,
  onCancel,
}: EventFormProps) => {
  useEffect(() => {
    console.log("EventForm rendered with data:", eventFormData);
    console.log("Editing event:", editingEvent);
  }, [eventFormData, editingEvent]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          value={eventFormData.name}
          onChange={(e) => setEventFormData({ ...eventFormData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Event Date and Time</Label>
        <Input
          id="date"
          type="datetime-local"
          value={eventFormData.date}
          onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
          required
        />
        <p className="text-xs text-gray-500">
          Enter the time you want displayed in Eastern Time. The system will handle timezone conversion.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={eventFormData.location}
          onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={eventFormData.description || ""}
          onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
          rows={4}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {editingEvent ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};
