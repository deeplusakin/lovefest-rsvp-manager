
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  household: {
    name: string;
  };
}

interface GuestsTableProps {
  guests: Guest[];
  onDelete: () => void;
}

export const GuestsTable = ({ guests, onDelete }: GuestsTableProps) => {
  const handleDelete = async (guestId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;
      
      toast.success("Guest deleted successfully");
      onDelete();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error("Error deleting guest");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Guest</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Household</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id} className="border-b">
              <td className="p-2">
                {guest.first_name} {guest.last_name}
              </td>
              <td className="p-2">{guest.email || "-"}</td>
              <td className="p-2">{guest.household.name}</td>
              <td className="p-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(guest.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
