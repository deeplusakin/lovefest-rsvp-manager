
import { Button } from "@/components/ui/button";
import { GuestEvent } from "@/types/admin";

interface GuestEventsTableProps {
  guests: GuestEvent[];
  eventId: string;
}

export const GuestEventsTable = ({ guests, eventId }: GuestEventsTableProps) => {
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
          {guests.map((guestEvent) => (
            <tr key={`${guestEvent.guest_id}-${eventId}`} className="border-b">
              <td className="p-2">
                {guestEvent.guest.first_name} {guestEvent.guest.last_name}
              </td>
              <td className="p-2">{guestEvent.guest.email || "-"}</td>
              <td className="p-2">{guestEvent.status}</td>
              <td className="p-2">{guestEvent.response_date || "-"}</td>
              <td className="p-2">{guestEvent.guest.dietary_restrictions || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
