
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { Guest } from "../types/guest";
import { HouseholdCell } from "./HouseholdCell";

interface GuestRowProps {
  guest: Guest;
  isSelected: boolean;
  onSelectGuest: (guestId: string, checked: boolean) => void;
  onSelectHousehold: (householdId: string, checked: boolean) => void;
  isHouseholdSelected: boolean;
  onEditGuest: (guest: Guest) => void;
  onEditHousehold: (guestId: string) => void;
  onEditHouseholdData: (householdId: string) => void;
  onDeleteGuest: (guestId: string) => void;
  editingHousehold: string | null;
  isCreatingNewHousehold: boolean;
  newHouseholdName: string;
  setNewHouseholdName: (value: string) => void;
  onCreateNewHousehold: (guestId: string) => void;
  onCancelEditHousehold: () => void;
  households: any[];
  onUpdateGuestHousehold: (guestId: string, householdId: string) => void;
  onStartCreateNewHousehold: () => void;
}

export const GuestRow: React.FC<GuestRowProps> = ({
  guest,
  isSelected,
  onSelectGuest,
  onSelectHousehold,
  isHouseholdSelected,
  onEditGuest,
  onEditHousehold,
  onEditHouseholdData,
  onDeleteGuest,
  editingHousehold,
  isCreatingNewHousehold,
  newHouseholdName,
  setNewHouseholdName,
  onCreateNewHousehold,
  onCancelEditHousehold,
  households,
  onUpdateGuestHousehold,
  onStartCreateNewHousehold
}) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => 
            onSelectGuest(guest.id, checked === true)
          }
        />
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <span>{guest.first_name} {guest.last_name}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEditGuest(guest)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell>{guest.email || "-"}</TableCell>
      <TableCell>
        <HouseholdCell
          guest={guest}
          editingHousehold={editingHousehold === guest.id}
          isCreatingNewHousehold={isCreatingNewHousehold}
          newHouseholdName={newHouseholdName}
          setNewHouseholdName={setNewHouseholdName}
          onCreateNewHousehold={() => onCreateNewHousehold(guest.id)}
          onCancelEditHousehold={onCancelEditHousehold}
          households={households}
          onUpdateGuestHousehold={(householdId) => onUpdateGuestHousehold(guest.id, householdId)}
          onStartCreateNewHousehold={onStartCreateNewHousehold}
          onEditHousehold={() => onEditHousehold(guest.id)}
          onEditHouseholdData={() => onEditHouseholdData(guest.household_id)}
          isHouseholdSelected={isHouseholdSelected}
          onSelectHousehold={(checked) => onSelectHousehold(guest.household_id, checked)}
        />
      </TableCell>
      <TableCell>{guest.household.invitation_code}</TableCell>
      <TableCell>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDeleteGuest(guest.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
};
