
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Guest, GuestDetails } from "@/types/rsvp";

interface GuestRsvpCardProps {
  guest: Guest;
  responses: Record<string, string>;
  guestDetails?: GuestDetails;
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

  console.log("GuestRsvpCard rendering for guest:", guest.first_name, "with events:", guest.guest_events?.length);
  console.log("Full guest object:", JSON.stringify(guest, null, 2));

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
        {guest.guest_events?.map(guestEvent => {
          console.log("Processing guest_event:", JSON.stringify(guestEvent, null, 2));
          
          // Check if events data exists properly
          if (!guestEvent.events) {
            console.log("Event data is null for event_id:", guestEvent.event_id);
            return (
              <div key={guestEvent.event_id} className="space-y-3 p-4 border border-yellow-200 bg-yellow-50 rounded">
                <h4 className="font-medium text-yellow-800">Event Information Unavailable</h4>
                <p className="text-sm text-yellow-600">
                  Event ID: {guestEvent.event_id} - Please contact support if this persists.
                </p>
              </div>
            );
          }

          const currentResponse = responses[guestEvent.event_id] || guestEvent.status;
          console.log("Current response for event", guestEvent.event_id, ":", currentResponse);

          return (
            <div key={guestEvent.event_id} className="space-y-3">
              <h4 className="font-medium">{guestEvent.events.name}</h4>
              <p className="text-sm text-gray-600">
                {new Date(guestEvent.events.date).toLocaleDateString()} at {guestEvent.events.location}
              </p>
              <RadioGroup
                value={currentResponse}
                onValueChange={(value) => {
                  console.log("RSVP change:", guest.id, guestEvent.event_id, value);
                  onRsvpChange(guest.id, guestEvent.event_id, value);
                }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attending" id={`attending-${guest.id}-${guestEvent.event_id}`} />
                  <Label htmlFor={`attending-${guest.id}-${guestEvent.event_id}`}>Attending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="declined" id={`declined-${guest.id}-${guestEvent.event_id}`} />
                  <Label htmlFor={`declined-${guest.id}-${guestEvent.event_id}`}>Cannot Attend</Label>
                </div>
              </RadioGroup>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
