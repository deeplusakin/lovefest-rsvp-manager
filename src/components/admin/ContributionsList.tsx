
import { Card } from "@/components/ui/card";
import { Contribution } from "@/types/admin";

interface ContributionsListProps {
  contributions: Contribution[];
  totalContributions: number;
}

export const ContributionsList = ({
  contributions,
  totalContributions,
}: ContributionsListProps) => (
  <Card className="p-6">
    <h3 className="text-2xl font-serif mb-4">Honeymoon Fund</h3>
    <div className="bg-white p-4 rounded-lg shadow-sm inline-block mb-6">
      <div className="text-sm text-gray-600">Total Contributions</div>
      <div className="text-3xl font-bold">
        ${totalContributions.toFixed(2)}
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Guest</th>
            <th className="text-left p-2">Amount</th>
            <th className="text-left p-2">Message</th>
            <th className="text-left p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((contribution) => (
            <tr key={contribution.id} className="border-b">
              <td className="p-2">
                {contribution.guests.first_name} {contribution.guests.last_name}
              </td>
              <td className="p-2">${contribution.amount}</td>
              <td className="p-2">{contribution.message || "-"}</td>
              <td className="p-2">
                {new Date(contribution.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);
