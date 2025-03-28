
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event, EventFormData } from "@/types/admin";

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
}: EventFormProps) => (
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
      <Label htmlFor="date">Date and Time</Label>
      <Input
        id="date"
        type="datetime-local"
        value={eventFormData.date}
        onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
        required
      />
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
      <Input
        id="description"
        value={eventFormData.description}
        onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
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
