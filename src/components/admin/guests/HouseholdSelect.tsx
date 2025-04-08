
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useHouseholds } from "../hooks/useHouseholds";

interface HouseholdSelectProps {
  guestId: string;
  householdId: string;
  onCancel: () => void;
  onNewHousehold: () => void;
}

export const HouseholdSelect: React.FC<HouseholdSelectProps> = ({ 
  guestId, 
  householdId,
  onCancel,
  onNewHousehold 
}) => {
  const { households, isLoading } = useHouseholds();
  
  const updateGuestHousehold = async (newHouseholdId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ household_id: newHouseholdId })
        .eq('id', guestId);

      if (error) throw error;

      toast.success("Household updated successfully");
      onCancel();
    } catch (error) {
      console.error('Error updating household:', error);
      toast.error("Error updating household");
    }
  };

  if (isLoading) {
    return <div>Loading households...</div>;
  }

  return (
    <div className="flex gap-2 items-center">
      <Select
        defaultValue={householdId}
        onValueChange={updateGuestHousehold}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select household" />
        </SelectTrigger>
        <SelectContent className="bg-white border rounded-md shadow-md">
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
        onClick={onNewHousehold}
      >
        New
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
};
