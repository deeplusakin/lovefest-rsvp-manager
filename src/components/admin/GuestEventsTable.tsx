
import { Button } from "@/components/ui/button";
import { GuestEvent } from "@/types/admin";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GuestEventAddForm } from "./GuestEventAddForm";
import { GuestStatusSelect } from "./GuestStatusSelect";
import { RsvpStatus } from "./types/guest-events";

interface GuestEventsTableProps {
  guests: GuestEvent[];
  eventId: string;
}

export const GuestEventsTable = ({ guests, eventId }: GuestEventsTableProps) => {
  const [addingEventToGuest, setAddingEventToGuest] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (guestId: string, newStatus: RsvpStatus) => {
    setUpdatingStatus(guestId);
    try {
      const { error } = await supabase
        .from('guest_events')
        .update({ 
          status: newStatus,
          response_date: newStatus === 'invited' ? null : new Date().toISOString()
        })
        .eq('guest_id', guestId)
        .eq('event_id', eventId);

      if (error) throw error;

      toast.success("RSVP status updated successfully");
      window.location.reload();
    } catch (error) {
      console.error('Error updating RSVP status:', error);
      toast.error("Error updating RSVP status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Guest</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Response Date</th>
            <th className="text-left p-2">Dietary Restrictions</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guestEvent) => (
            <tr key={`${guestEvent.guest_id}-${eventId}`} className="border-b">
              <td className="p-2">
                {guestEvent.guest.first_name} {guestEvent.guest.last_name}
              </td>
              <td className="p-2">{guestEvent.guest.email || "-"}</td>
              <td className="p-2">
                <GuestStatusSelect
                  status={guestEvent.status}
                  onStatusChange={(value) => handleStatusUpdate(guestEvent.guest_id, value)}
                  disabled={!!updatingStatus}
                />
              </td>
              <td className="p-2">{guestEvent.response_date ? new Date(guestEvent.response_date).toLocaleDateString() : "-"}</td>
              <td className="p-2">{guestEvent.guest.dietary_restrictions || "-"}</td>
              <td className="p-2">
                {addingEventToGuest === guestEvent.guest_id ? (
                  <GuestEventAddForm
                    guestId={guestEvent.guest_id}
                    onCancel={() => setAddingEventToGuest(null)}
                    onSuccess={() => window.location.reload()}
                  />
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAddingEventToGuest(guestEvent.guest_id)}
                  >
                    Add to Event
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
