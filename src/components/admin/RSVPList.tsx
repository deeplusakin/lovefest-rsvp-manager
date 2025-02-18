
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Event, EventStats } from "@/types/admin";
import { EventStatistics } from "./EventStatistics";
import { GuestListUpload } from "./GuestListUpload";
import { GuestsTable } from "./GuestsTable";
import { useCallback } from "react";
import { useAdminData } from "@/hooks/useAdminData";

interface RSVPListProps {
  events: Event[];
  getEventStats: (event: Event) => EventStats;
  onExportGuests: (eventId: string) => void;
}

export const RSVPList = ({ events, getEventStats, onExportGuests }: RSVPListProps) => {
  const { fetchEvents } = useAdminData();

  const handleUploadSuccess = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      {events.map(event => (
        <Card key={event.id} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-serif">{event.name}</h3>
            <Button variant="outline" onClick={() => onExportGuests(event.id)}>
              <Download className="mr-2 h-4 w-4" />
              Export Guest List
            </Button>
          </div>
          
          <EventStatistics stats={getEventStats(event)} />

          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Guest List</h4>
            <GuestListUpload 
              eventId={event.id} 
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          <GuestsTable guests={event.guest_events} eventId={event.id} />
        </Card>
      ))}
    </>
  );
};
