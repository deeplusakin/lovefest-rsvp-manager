
import { EventStats } from "@/types/admin";

interface EventStatisticsProps {
  stats: EventStats;
}

export const EventStatistics = ({ stats }: EventStatisticsProps) => (
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
);
