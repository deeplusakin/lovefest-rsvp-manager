
import { Card } from "@/components/ui/card";
import { Event, EventStats } from "@/types/admin";
import { EventStatistics } from "./EventStatistics";
import { GuestListUpload } from "./GuestListUpload";
import { GuestsTable } from "./GuestsTable";

interface RSVPListProps {
  events: Event[];
  getEventStats: (event: Event) => EventStats;
}

export const RSVPList = ({ events, getEventStats }: RSVPListProps) => {
  return (
    <>
      {events.map(event => (
        <Card key={event.id} className="p-6">
          <h3 className="text-2xl font-serif mb-4">{event.name}</h3>
          <EventStatistics stats={getEventStats(event)} />

          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Guest List</h4>
            <GuestListUpload eventId={event.id} />
          </div>

          <GuestsTable guests={event.guest_events} eventId={event.id} />
        </Card>
      ))}
    </>
  );
};
