
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { Event, EventStats } from "@/types/admin";
import { EventStatistics } from "./EventStatistics";
import { GuestListUpload } from "./GuestListUpload";
import { GuestEventsTable } from "./GuestEventsTable";
import { useCallback, useState } from "react";
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
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

  const handleUploadSuccess = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSyncComplete = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Function to sync and clean up outdated RSVPs
  const handleSyncAndCleanup = async (eventId: string) => {
    setIsSyncing(prev => ({ ...prev, [eventId]: true }));
    try {
      // 1. Find all guest_events records for this event where the guest no longer exists
      const { data: orphanedRsvps, error: orphanedError } = await supabase
        .from('guest_events')
        .select('guest_id')
        .eq('event_id', eventId)
        .not('guest_id', 'in', `(select id from guests)`);

      if (orphanedError) throw orphanedError;

      if (orphanedRsvps && orphanedRsvps.length > 0) {
        const orphanedGuestIds = orphanedRsvps.map(rsvp => rsvp.guest_id);
        
        // Delete orphaned RSVP records
        const { error: deleteError } = await supabase
          .from('guest_events')
          .delete()
          .eq('event_id', eventId)
          .in('guest_id', orphanedGuestIds);

        if (deleteError) throw deleteError;
        
        toast.success(`Cleaned up ${orphanedRsvps.length} outdated RSVP records`);
      } else {
        toast.info("No outdated RSVP records found");
      }
      
      fetchEvents();
    } catch (error) {
      console.error('Error cleaning up RSVPs:', error);
      toast.error("Error cleaning up outdated RSVP records");
    } finally {
      setIsSyncing(prev => ({ ...prev, [eventId]: false }));
    }
  };

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
        <Card key={event.id} className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-serif">{event.name}</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSyncAndCleanup(event.id)}
                disabled={isSyncing[event.id]}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing[event.id] ? 'animate-spin' : ''}`} />
                Clean Up RSVPs
              </Button>
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

          <div className="flex justify-between items-center mb-4 mt-8">
            <h4 className="text-lg font-semibold">Guest List</h4>
            <div className="flex space-x-2">
              <GuestListUpload 
                eventId={event.id} 
                onUploadSuccess={handleUploadSuccess}
              />
            </div>
          </div>

          <div className="mt-2 mb-4 text-sm text-gray-500">
            <p>The Guest List is the source of truth for RSVPs. Use the "Sync Guest List" button to add any missing guests to the RSVP list, and "Clean Up RSVPs" to remove records for deleted guests.</p>
          </div>

          <GuestEventsTable guests={event.guest_events} eventId={event.id} />
        </Card>
      ))}
    </>
  );
};
