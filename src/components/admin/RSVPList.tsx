
import { Card } from "@/components/ui/card";
import { Event, EventStats } from "@/types/admin";

interface RSVPListProps {
  events: Event[];
  getEventStats: (event: Event) => EventStats;
}

export const RSVPList = ({ events, getEventStats }: RSVPListProps) => (
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
                      {g.is_attending === null
                        ? "No Response"
                        : g.is_attending
                        ? "Attending"
                        : "Not Attending"}
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
