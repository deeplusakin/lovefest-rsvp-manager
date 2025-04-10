
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Guest } from "../types/guest";

interface HouseholdCellProps {
  guest: Guest;
  editingHousehold: boolean;
  isCreatingNewHousehold: boolean;
  newHouseholdName: string;
  setNewHouseholdName: (value: string) => void;
  onCreateNewHousehold: () => void;
  onCancelEditHousehold: () => void;
  households: any[];
  onUpdateGuestHousehold: (householdId: string) => void;
  onStartCreateNewHousehold: () => void;
  onEditHousehold: () => void;
  onEditHouseholdData: () => void;
  isHouseholdSelected: boolean;
  onSelectHousehold: (checked: boolean) => void;
}

export const HouseholdCell: React.FC<HouseholdCellProps> = ({
  guest,
  editingHousehold,
  isCreatingNewHousehold,
  newHouseholdName,
  setNewHouseholdName,
  onCreateNewHousehold,
  onCancelEditHousehold,
  households,
  onUpdateGuestHousehold,
  onStartCreateNewHousehold,
  onEditHousehold,
  onEditHouseholdData,
  isHouseholdSelected,
  onSelectHousehold
}) => {
  if (editingHousehold) {
    if (isCreatingNewHousehold) {
      return (
        <div className="flex gap-2 items-center">
          <Input
            value={newHouseholdName}
            onChange={(e) => setNewHouseholdName(e.target.value)}
            placeholder="Enter household name"
            className="w-48"
          />
          <Button size="sm" onClick={onCreateNewHousehold}>
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancelEditHousehold}
          >
            Cancel
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex gap-2 items-center">
          <Select
            defaultValue={guest.household_id}
            onValueChange={onUpdateGuestHousehold}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select household" />
            </SelectTrigger>
            <SelectContent className="bg-white border rounded-md shadow-md">
              {households.map((household: any) => (
                <SelectItem key={household.id} value={household.id}>
                  {household.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={onStartCreateNewHousehold}
          >
            New
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancelEditHousehold}
          >
            Cancel
          </Button>
        </div>
      );
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <span>{guest.household.name}</span>
      <Checkbox 
        checked={isHouseholdSelected}
        onCheckedChange={(checked) => onSelectHousehold(checked === true)}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={onEditHousehold}
      >
        Change
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onEditHouseholdData}
      >
        Edit
      </Button>
    </div>
  );
};
