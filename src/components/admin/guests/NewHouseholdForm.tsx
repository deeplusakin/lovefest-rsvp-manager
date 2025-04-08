
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewHouseholdFormProps {
  guestId: string;
}

export const NewHouseholdForm: React.FC<NewHouseholdFormProps> = ({ guestId }) => {
  const [newHouseholdName, setNewHouseholdName] = useState("");

  const createNewHousehold = async () => {
    if (!newHouseholdName.trim()) {
      toast.error("Please enter a household name");
      return;
    }

    try {
      // Create new household with a random invitation code
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ 
          name: newHouseholdName.trim(),
          invitation_code: Math.random().toString(36).substring(2, 8).toUpperCase()
        })
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
    } catch (error) {
      console.error('Error creating household:', error);
      toast.error("Error creating household");
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        value={newHouseholdName}
        onChange={(e) => setNewHouseholdName(e.target.value)}
        placeholder="Enter household name"
        className="w-48"
      />
      <Button size="sm" onClick={createNewHousehold}>
        Save
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setNewHouseholdName("");
        }}
      >
        Cancel
      </Button>
    </div>
  );
};
