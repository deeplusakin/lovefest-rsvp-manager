
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/admin";
import { Edit, Trash2 } from "lucide-react";
import { formatInTimeZone } from 'date-fns-tz';

interface EventsListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export const EventsList = ({ events, onEdit, onDelete }: EventsListProps) => {
  const handleCreateNew = () => {
    const emptyEvent: Event = { 
      id: '', 
      name: '', 
      date: '', 
      location: '', 
      description: null, 
      guest_events: [] 
    };
    onEdit(emptyEvent);
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      console.log('Raw date from DB:', dateString);
      console.log('Parsed date object:', date.toISOString());
      
      // Using the updated format from date-fns-tz v3.x
      const formattedDate = formatInTimeZone(
        date,
        'America/New_York',
        "MMMM d, yyyy 'at' h:mm a zzz"
      );
      
      console.log('Formatted date with timezone:', formattedDate);
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-serif">Upcoming Events</h2>
        <Button onClick={handleCreateNew}>
          Create New Event
        </Button>
      </div>
      
      {events.length === 0 ? (
        <Card className="p-4 text-center text-gray-500">
          No events found. Create your first event to get started.
        </Card>
      ) : (
        events.map(event => (
          <Card key={event.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="text-gray-600">
                  {formatEventDate(event.date)}
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
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(event.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
