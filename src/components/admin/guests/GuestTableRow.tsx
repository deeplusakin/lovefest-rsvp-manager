
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Guest } from "../types/guest";

interface GuestTableRowProps {
  guest: Guest;
  onEdit: (guest: Guest) => void;
  onDelete: (guestId: string) => void;
  onEditHousehold: (guestId: string) => void;
  onEditHouseholdData: (householdId: string) => void;
  editingHousehold: string | null;
  isCreatingNewHousehold: boolean;
  onStartCreateHousehold: () => void;
  onCancelEditHousehold: () => void;
}

export const GuestTableRow: React.FC<GuestTableRowProps> = ({
  guest,
  onEdit,
  onDelete,
  onEditHousehold,
  onEditHouseholdData,
  editingHousehold,
  isCreatingNewHousehold,
  onStartCreateHousehold,
  onCancelEditHousehold,
}) => {
  const isEditing = editingHousehold === guest.id;

  return (
    <tr className="border-b">
      <td className="p-2">
        <div className="flex gap-2 items-center">
          <span>{guest.first_name} {guest.last_name}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(guest)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </td>
      <td className="p-2">{guest.email || "-"}</td>
      <td className="p-2">
        {isEditing ? (
          <HouseholdEditCell
            guest={guest}
            isCreatingNewHousehold={isCreatingNewHousehold}
            onStartCreateHousehold={onStartCreateHousehold}
            onCancelEditHousehold={onCancelEditHousehold}
          />
        ) : (
          <div className="flex gap-2 items-center">
            <span>{guest.household.name}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditHousehold(guest.id)}
            >
              Change
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditHouseholdData(guest.household_id)}
            >
              Edit
            </Button>
          </div>
        )}
      </td>
      <td className="p-2">{guest.household.invitation_code}</td>
      <td className="p-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(guest.id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

// Helper component for editing household
interface HouseholdEditCellProps {
  guest: Guest;
  isCreatingNewHousehold: boolean;
  onStartCreateHousehold: () => void;
  onCancelEditHousehold: () => void;
}

// This component is internal to the file, so no export
const HouseholdEditCell: React.FC<HouseholdEditCellProps> = ({
  guest,
  isCreatingNewHousehold,
  onStartCreateHousehold,
  onCancelEditHousehold,
}) => {
  if (isCreatingNewHousehold) {
    return <NewHouseholdForm guestId={guest.id} />;
  }

  return <HouseholdSelect guestId={guest.id} householdId={guest.household_id} onCancel={onCancelEditHousehold} onNewHousehold={onStartCreateHousehold} />;
};

// These components are imported from their own files
import { NewHouseholdForm } from "./NewHouseholdForm";
import { HouseholdSelect } from "./HouseholdSelect";
