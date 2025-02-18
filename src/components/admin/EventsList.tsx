
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/admin";
import { Edit, Trash2 } from "lucide-react";
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';

interface EventsListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export const EventsList = ({ events, onEdit, onDelete }: EventsListProps) => (
  <div className="space-y-4">
    {events.map(event => (
      <Card key={event.id} className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold">{event.name}</h3>
            <p className="text-gray-600">
              {formatInTimeZone(
                new Date(event.date),
                'America/New_York',
                'MMMM d, yyyy \'at\' h:mm a zzz'
              )}
            </p>
            <p className="text-gray-600">{event.location}</p>
            {event.description && (
              <p className="text-gray-600 mt-2">{event.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    ))}
  </div>
);
