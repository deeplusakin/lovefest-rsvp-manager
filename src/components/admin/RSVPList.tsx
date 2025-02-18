
import { Card } from "@/components/ui/card";
import { Event, EventStats } from "@/types/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface RSVPListProps {
  events: Event[];
  getEventStats: (event: Event) => EventStats;
}

export const RSVPList = ({ events, getEventStats }: RSVPListProps) => {
  const [uploading, setUploading] = useState(false);

  const handleStatusChange = async (guestId: string, eventId: string, status: string) => {
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

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>, eventId: string) => {
    if (!event.target.files?.[0]) return;
    
    setUploading(true);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0].map(header => header.trim().toLowerCase());
        
        const guests = rows.slice(1).map(row => {
          const guest: any = {};
          row.forEach((value, index) => {
            guest[headers[index]] = value.trim();
          });
          return guest;
        });

        for (const guest of guests) {
          const { data: existingGuest, error: guestError } = await supabase
            .from('guests')
            .select('id')
            .eq('email', guest.email)
            .single();

          if (guestError && guestError.code !== 'PGRST116') {
            throw guestError;
          }

          let guestId = existingGuest?.id;

          if (!guestId) {
            const { data: newGuest, error: createError } = await supabase
              .from('guests')
              .insert({
                first_name: guest.first_name,
                last_name: guest.last_name,
                email: guest.email,
                dietary_restrictions: guest.dietary_restrictions,
                invitation_code: Math.random().toString(36).substring(2, 8),
                household_id: '00000000-0000-0000-0000-000000000000' // Default household
              })
              .select('id')
              .single();

            if (createError) throw createError;
            guestId = newGuest.id;
          }

          const { error: rsvpError } = await supabase
            .from('guest_events')
            .upsert({
              guest_id: guestId,
              event_id: eventId,
              status: 'invited'
            });

          if (rsvpError) throw rsvpError;
        }

        toast.success("Guest list uploaded successfully");
      } catch (error: any) {
        toast.error("Error uploading guest list");
        console.error(error);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <>
      {events.map(event => {
        const stats = getEventStats(event);
        
        return (
          <Card key={event.id} className="p-6">
            <h3 className="text-2xl font-serif mb-4">{event.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">{stats.totalInvited}</div>
                <div className="text-sm text-gray-600">Total Invited</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold">{stats.responded}</div>
                <div className="text-sm text-gray-600">Responses</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {stats.attending}
                </div>
                <div className="text-sm text-gray-600">Attending</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {stats.notAttending}
                </div>
                <div className="text-sm text-gray-600">Not Attending</div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Guest List</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleCSVUpload(e, event.id)}
                  className="max-w-xs"
                />
                <Button variant="outline" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
              </div>
            </div>

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
                  {event.guest_events.map((g, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">
                        {g.guest.first_name} {g.guest.last_name}
                      </td>
                      <td className="p-2">{g.guest.email || "-"}</td>
                      <td className="p-2">
                        <Select
                          defaultValue={g.status}
                          onValueChange={(value) => handleStatusChange(g.guest_id, event.id, value)}
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
          </Card>
        );
      })}
    </>
  );
};
