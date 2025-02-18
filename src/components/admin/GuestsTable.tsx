
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  invitation_code: string;
  household: {
    name: string;
  };
  household_id: string;
}

interface Household {
  id: string;
  name: string;
}

interface GuestsTableProps {
  guests: Guest[];
  onDelete: () => void;
}

export const GuestsTable = ({ guests, onDelete }: GuestsTableProps) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [editingHousehold, setEditingHousehold] = useState<string | null>(null);
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [isCreatingNewHousehold, setIsCreatingNewHousehold] = useState(false);

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    const { data, error } = await supabase
      .from('households')
      .select('id, name')
      .order('name');
    
    if (error) {
      toast.error("Error fetching households");
      return;
    }
    
    setHouseholds(data || []);
  };

  const handleDelete = async (guestId: string) => {
    try {
      // First, delete all guest_events records for this guest
      const { error: eventError } = await supabase
        .from('guest_events')
        .delete()
        .eq('guest_id', guestId);

      if (eventError) throw eventError;

      // Then delete the guest record
      const { error: guestError } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (guestError) throw guestError;
      
      toast.success("Guest deleted successfully");
      onDelete();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error("Error deleting guest");
    }
  };

  const createNewHousehold = async (guestId: string) => {
    if (!newHouseholdName.trim()) {
      toast.error("Please enter a household name");
      return;
    }

    try {
      // Create new household
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ name: newHouseholdName.trim() })
        .select()
        .single();

      if (householdError) throw householdError;

      // Update guest's household
      const { error: updateError } = await supabase
        .from('guests')
        .update({ household_id: household.id })
        .eq('id', guestId);

      if (updateError) throw updateError;

      toast.success("Household created and assigned successfully");
      setNewHouseholdName("");
      setIsCreatingNewHousehold(false);
      setEditingHousehold(null);
      fetchHouseholds();
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error creating household:', error);
      toast.error("Error creating household");
    }
  };

  const updateGuestHousehold = async (guestId: string, householdId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ household_id: householdId })
        .eq('id', guestId);

      if (error) throw error;

      toast.success("Household updated successfully");
      setEditingHousehold(null);
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error updating household:', error);
      toast.error("Error updating household");
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
            <th className="text-left p-2">Invitation Code</th>
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
              <td className="p-2">
                {editingHousehold === guest.id ? (
                  isCreatingNewHousehold ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={newHouseholdName}
                        onChange={(e) => setNewHouseholdName(e.target.value)}
                        placeholder="Enter household name"
                        className="w-48"
                      />
                      <Button size="sm" onClick={() => createNewHousehold(guest.id)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsCreatingNewHousehold(false);
                          setNewHouseholdName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Select
                        defaultValue={guest.household_id}
                        onValueChange={(value) => updateGuestHousehold(guest.id, value)}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select household" />
                        </SelectTrigger>
                        <SelectContent>
                          {households.map((household) => (
                            <SelectItem key={household.id} value={household.id}>
                              {household.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsCreatingNewHousehold(true);
                        }}
                      >
                        New
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingHousehold(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="flex gap-2 items-center">
                    <span>{guest.household.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingHousehold(guest.id)}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </td>
              <td className="p-2">{guest.invitation_code}</td>
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
