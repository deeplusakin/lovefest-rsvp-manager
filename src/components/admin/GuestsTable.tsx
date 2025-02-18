
import { GuestEvent } from "@/types/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuestsTableProps {
  guests: GuestEvent[];
  eventId: string;
}

export const GuestsTable = ({ guests, eventId }: GuestsTableProps) => {
  const handleStatusChange = async (
    guestId: string,
    status: 'not_invited' | 'invited' | 'attending' | 'declined'
  ) => {
    try {
      const { error } = await supabase
        .from('guest_events')
        .update({
          status,
          response_date: status === 'invited' ? null : new Date().toISOString()
        })
        .match({ guest_id: guestId, event_id: eventId });

      if (error) throw error;
      toast.success("RSVP status updated");
    } catch (error: any) {
      toast.error("Error updating RSVP status");
      console.error(error);
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
          </tr>
        </thead>
        <tbody>
          {guests.map((g, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">
                {g.guest.first_name} {g.guest.last_name}
              </td>
              <td className="p-2">{g.guest.email || "-"}</td>
              <td className="p-2">
                <Select
                  defaultValue={g.status}
                  onValueChange={(value: 'not_invited' | 'invited' | 'attending' | 'declined') => 
                    handleStatusChange(g.guest_id, value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_invited">Not Invited</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="p-2">
                {g.response_date
                  ? new Date(g.response_date).toLocaleDateString()
                  : "-"}
              </td>
              <td className="p-2">
                {g.guest.dietary_restrictions || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
