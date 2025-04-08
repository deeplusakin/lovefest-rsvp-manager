
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Household } from "../types/guest";

interface HouseholdEditDialogProps {
  household: Household | null;
  onClose: () => void;
  onSave: () => void;
  onHouseholdChange: (field: keyof Household, value: string) => void;
}

export const HouseholdEditDialog: React.FC<HouseholdEditDialogProps> = ({
  household,
  onClose,
  onSave,
  onHouseholdChange,
}) => {
  if (!household) return null;

  return (
    <Dialog open={!!household} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Household</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Household Name</label>
            <Input 
              value={household.name || ''}
              onChange={(e) => onHouseholdChange('name', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input 
              value={household.address || ''}
              onChange={(e) => onHouseholdChange('address', e.target.value || null)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Invitation Code</label>
            <Input 
              value={household.invitation_code || ''}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Invitation codes cannot be modified</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={onSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
