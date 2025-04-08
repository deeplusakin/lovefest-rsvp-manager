
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GuestEvent {
  event_id: string;
  status: 'not_invited' | 'invited' | 'attending' | 'declined';
  events: {
    name: string;
    date: string;
    location: string;
  };
}

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  guest_events: GuestEvent[];
}

interface GuestRsvpCardProps {
  guest: Guest;
  responses: Record<string, string>;
  onRsvpChange: (guestId: string, eventId: string, status: string) => void;
}

export const GuestRsvpCard = ({ guest, responses, onRsvpChange }: GuestRsvpCardProps) => {
  return (
    <Card className="p-6">
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
              value={responses[event.event_id] || 'not_invited'}
              onValueChange={(value) => onRsvpChange(guest.id, event.event_id, value)}
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
  );
};
