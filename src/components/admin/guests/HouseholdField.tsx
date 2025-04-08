
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Household } from "../types/guest";

interface HouseholdFieldProps {
  households: Household[];
  selectedHouseholdId: string;
  onHouseholdSelect: (id: string) => void;
}

export const HouseholdField = ({ households, selectedHouseholdId, onHouseholdSelect }: HouseholdFieldProps) => {
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [isCreatingHousehold, setIsCreatingHousehold] = useState(false);
  
  const generateInvitationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createNewHousehold = async () => {
    if (!newHouseholdName.trim()) {
      toast.error("Please enter a household name");
      return;
    }

    const { data, error } = await supabase
      .from('households')
      .insert({ 
        name: newHouseholdName.trim(),
        invitation_code: generateInvitationCode()
      })
      .select()
      .single();

    if (error) {
      toast.error("Error creating household");
      return;
    }

    toast.success("Household created successfully");
    setNewHouseholdName("");
    setIsCreatingHousehold(false);
    onHouseholdSelect(data.id);
  };

  return (
    <div>
      <Label>Household</Label>
      {!isCreatingHousehold ? (
        <div className="flex gap-2 items-center">
          <Select value={selectedHouseholdId} onValueChange={onHouseholdSelect}>
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
  );
};
