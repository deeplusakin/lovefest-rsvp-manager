
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface GuestBulkActionsProps {
  selectedGuestsCount: number;
  selectedHouseholdsCount: number;
  onDeleteGuests: () => void;
  onDeleteHouseholds: () => void;
}

export const GuestBulkActions: React.FC<GuestBulkActionsProps> = ({
  selectedGuestsCount,
  selectedHouseholdsCount,
  onDeleteGuests,
  onDeleteHouseholds
}) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="space-x-2">
        <Button 
          variant="destructive" 
          size="sm"
          disabled={selectedGuestsCount === 0}
          onClick={onDeleteGuests}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected Guests ({selectedGuestsCount})
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          disabled={selectedHouseholdsCount === 0}
          onClick={onDeleteHouseholds}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected Households ({selectedHouseholdsCount})
        </Button>
      </div>
    </div>
  );
};
