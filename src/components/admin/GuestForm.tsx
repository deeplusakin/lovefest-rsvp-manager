
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Household {
  id: string;
  name: string;
}

export const GuestForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>("");
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [isCreatingHousehold, setIsCreatingHousehold] = useState(false);
  const [guestData, setGuestData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dietaryRestrictions: ""
  });

  const fetchHouseholds = async () => {
    const { data, error } = await supabase
      .from('households')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error("Error fetching households");
      return;
    }
    
    setHouseholds(data || []);
  };

  const createNewHousehold = async () => {
    if (!newHouseholdName.trim()) {
      toast.error("Please enter a household name");
      return;
    }

    const { data, error } = await supabase
      .from('households')
      .insert({ name: newHouseholdName.trim() })
      .select()
      .single();

    if (error) {
      toast.error("Error creating household");
      return;
    }

    toast.success("Household created successfully");
    setNewHouseholdName("");
    setIsCreatingHousehold(false);
    setSelectedHouseholdId(data.id);
    await fetchHouseholds();
  };

  const createGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHouseholdId) {
      toast.error("Please select or create a household");
      return;
    }

    try {
      const { error: guestError } = await supabase
        .from('guests')
        .insert({
          first_name: guestData.firstName,
          last_name: guestData.lastName,
          email: guestData.email || null,
          dietary_restrictions: guestData.dietaryRestrictions || null,
          invitation_code: Math.random().toString(36).substring(2, 8),
          household_id: selectedHouseholdId
        });

      if (guestError) throw guestError;

      toast.success("Guest added successfully");
      setGuestData({
        firstName: "",
        lastName: "",
        email: "",
        dietaryRestrictions: ""
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating guest:', error);
      toast.error("Error creating guest");
    }
  };

  // Fetch households when component mounts
  useState(() => {
    fetchHouseholds();
  });

  return (
    <form onSubmit={createGuest} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Household</Label>
          {!isCreatingHousehold ? (
            <div className="flex gap-2 items-center">
              <Select value={selectedHouseholdId} onValueChange={setSelectedHouseholdId}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a household" />
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
                type="button"
                variant="outline"
                onClick={() => setIsCreatingHousehold(true)}
              >
                Create New
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <Input
                value={newHouseholdName}
                onChange={(e) => setNewHouseholdName(e.target.value)}
                placeholder="Enter household name"
              />
              <Button type="button" onClick={createNewHousehold}>
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreatingHousehold(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>First Name</Label>
            <Input
              required
              value={guestData.firstName}
              onChange={(e) => setGuestData(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              required
              value={guestData.lastName}
              onChange={(e) => setGuestData(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label>Email (optional)</Label>
          <Input
            type="email"
            value={guestData.email}
            onChange={(e) => setGuestData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <Label>Dietary Restrictions (optional)</Label>
          <Input
            value={guestData.dietaryRestrictions}
            onChange={(e) => setGuestData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
          />
        </div>
      </div>

      <Button type="submit">Add Guest</Button>
    </form>
  );
};
