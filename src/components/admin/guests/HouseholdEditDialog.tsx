
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Household } from "../types/guest";

interface HouseholdEditDialogProps {
  household: Household | null;
  onClose: () => void;
  onSave: () => void;
  onHouseholdChange: (field: keyof Household, value: string) => void;
  allHouseholds?: Household[];
}

export const HouseholdEditDialog: React.FC<HouseholdEditDialogProps> = ({
  household,
  onClose,
  onSave,
  onHouseholdChange,
  allHouseholds = [],
}) => {
  const [isNameDuplicate, setIsNameDuplicate] = useState(false);
  
  useEffect(() => {
    if (!household || !household.name) {
      setIsNameDuplicate(false);
      return;
    }
    
    const nameExists = allHouseholds.some(
      h => h.id !== household.id && 
      h.name.toLowerCase() === household.name.toLowerCase()
    );
    
    setIsNameDuplicate(nameExists);
  }, [household, allHouseholds]);
  
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
              className={isNameDuplicate ? "border-red-500" : ""}
            />
            {isNameDuplicate && (
              <p className="text-sm text-red-500 mt-1">A household with this name already exists</p>
            )}
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
            <Button 
              onClick={onSave}
              disabled={isNameDuplicate || !household.name.trim()}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
