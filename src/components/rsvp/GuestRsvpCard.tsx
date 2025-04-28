
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  email?: string | null;
  phone?: string | null;
  dietary_restrictions?: string | null;
  guest_events: GuestEvent[];
}

interface GuestRsvpCardProps {
  guest: Guest;
  responses: Record<string, string>;
  guestDetails?: {
    email?: string | null;
    phone?: string | null;
    dietary_restrictions?: string | null;
  };
  onRsvpChange: (guestId: string, eventId: string, status: string) => void;
  onDetailChange?: (guestId: string, field: 'email' | 'phone' | 'dietary_restrictions', value: string) => void;
}

export const GuestRsvpCard = ({ 
  guest, 
  responses, 
  guestDetails,
  onRsvpChange,
  onDetailChange 
}: GuestRsvpCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {guest.first_name} {guest.last_name}
        </h3>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {showDetails && guestDetails && onDetailChange && (
        <div className="space-y-4 mb-6 border-b pb-4">
          <div>
            <Label htmlFor={`email-${guest.id}`} className="block mb-1">Email</Label>
            <Input
              id={`email-${guest.id}`}
              value={guestDetails.email || ''}
              onChange={(e) => onDetailChange(guest.id, 'email', e.target.value)}
              placeholder="Email address"
            />
          </div>
          
          <div>
            <Label htmlFor={`phone-${guest.id}`} className="block mb-1">Phone</Label>
            <Input
              id={`phone-${guest.id}`}
              value={guestDetails.phone || ''}
              onChange={(e) => onDetailChange(guest.id, 'phone', e.target.value)}
              placeholder="Phone number"
            />
          </div>
          
          <div>
            <Label htmlFor={`dietary-${guest.id}`} className="block mb-1">Dietary Restrictions</Label>
            <Input
              id={`dietary-${guest.id}`}
              value={guestDetails.dietary_restrictions || ''}
              onChange={(e) => onDetailChange(guest.id, 'dietary_restrictions', e.target.value)}
              placeholder="Any dietary restrictions"
            />
          </div>
        </div>
      )}

      <div className="space-y-6">
        {guest.guest_events?.map(event => (
          <div key={event.event_id} className="space-y-3">
            <h4 className="font-medium">{event.events.name}</h4>
            <p className="text-sm text-gray-600">
              {formatEventDate(event.events.date)} at {event.events.location}
            </p>
            <RadioGroup
              value={responses[event.event_id] || event.status}
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
