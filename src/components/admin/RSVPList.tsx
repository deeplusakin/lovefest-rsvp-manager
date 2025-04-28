
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Event, EventStats } from "@/types/admin";
import { EventStatistics } from "./EventStatistics";
import { GuestListUpload } from "./GuestListUpload";
import { GuestEventsTable } from "./GuestEventsTable";
import { useCallback } from "react";
import { useAdminData } from "@/hooks/useAdminData";
import { downloadCSV } from "@/utils/csvExport";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GuestEventSynchronizer } from "./GuestEventSynchronizer";

interface RSVPListProps {
  events: Event[];
  getEventStats: (event: Event) => EventStats;
}

export const RSVPList = ({ events, getEventStats }: RSVPListProps) => {
  const { fetchEvents } = useAdminData();

  const handleUploadSuccess = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSyncComplete = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleExportGuests = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      // Fetch all guest data including household information
      const { data: guestEvents, error } = await supabase
        .from('guest_events')
        .select(`
          status,
          response_date,
          guest:guests (
            first_name,
            last_name,
            email,
            dietary_restrictions,
            phone,
            household:households (
              name,
              invitation_code,
              address
            )
          )
        `)
        .eq('event_id', eventId);

      if (error) throw error;

      // Transform the data for CSV export
      const csvData = guestEvents.map(ge => ({
        first_name: ge.guest.first_name,
        last_name: ge.guest.last_name,
        household_name: ge.guest.household.name,
        invitation_code: ge.guest.household.invitation_code,
        household_address: ge.guest.household.address || '',
        email: ge.guest.email || '',
        phone: ge.guest.phone || '',
        status: ge.status,
        response_date: ge.response_date ? new Date(ge.response_date).toLocaleDateString() : '',
        dietary_restrictions: ge.guest.dietary_restrictions || ''
      }));

      downloadCSV(csvData, `${event.name}-guest-list`);
      toast.success("Guest list exported successfully");
    } catch (error) {
      console.error('Error exporting guest list:', error);
      toast.error("Error exporting guest list");
    }
  };

  return (
    <>
      {events.map(event => (
        <Card key={event.id} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-serif">{event.name}</h3>
            <div className="flex space-x-2">
              <GuestEventSynchronizer 
                eventId={event.id} 
                onSyncComplete={handleSyncComplete}
              />
              <Button variant="outline" onClick={() => handleExportGuests(event.id)}>
                <Download className="mr-2 h-4 w-4" />
                Export Guest List
              </Button>
            </div>
          </div>
          
          <EventStatistics stats={getEventStats(event)} />

          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Guest List</h4>
            <GuestListUpload 
              eventId={event.id} 
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          <GuestEventsTable guests={event.guest_events} eventId={event.id} />
        </Card>
      ))}
    </>
  );
};
