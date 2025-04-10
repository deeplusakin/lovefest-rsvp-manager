
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface GuestEventSynchronizerProps {
  eventId: string;
  onSyncComplete: () => void;
}

// The RPC function returns a UUID type for guest_id
interface GetGuestsWithoutEventResponse {
  guest_id: string; // UUID represented as string in TypeScript
}

export const GuestEventSynchronizer = ({ eventId, onSyncComplete }: GuestEventSynchronizerProps) => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      // Get all guests that don't have a record for this event
      const { data, error: guestsError } = await supabase
        .rpc('get_guests_without_event', {
          event_id_param: eventId
        });
      
      if (guestsError) throw guestsError;

      // Ensure we have a valid array to work with even if null is returned
      const guestsWithoutEvent = (data || []) as GetGuestsWithoutEventResponse[];
      
      if (guestsWithoutEvent.length === 0) {
        toast.info("All guests are already in the RSVP list");
        return;
      }
      
      // Create guest_events records for these guests
      const newGuestEvents = guestsWithoutEvent.map((item) => ({
        guest_id: item.guest_id,
        event_id: eventId,
        status: 'invited' as const
      }));
      
      const { error: insertError } = await supabase
        .from('guest_events')
        .insert(newGuestEvents);
        
      if (insertError) throw insertError;
      
      toast.success(`Added ${newGuestEvents.length} guests to the RSVP list`);
      onSyncComplete();
    } catch (error) {
      console.error('Error synchronizing guests:', error);
      toast.error("Error synchronizing guests with RSVPs");
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleSync}
      disabled={isSyncing}
      className="flex items-center gap-1"
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      Sync Guest List
    </Button>
  );
};
