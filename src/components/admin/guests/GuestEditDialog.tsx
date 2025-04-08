
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Guest } from "../types/guest";

interface GuestEditDialogProps {
  guest: Guest | null;
  onClose: () => void;
  onSave: () => void;
  onGuestChange: (field: keyof Guest, value: string) => void;
}

export const GuestEditDialog: React.FC<GuestEditDialogProps> = ({
  guest,
  onClose,
  onSave,
  onGuestChange,
}) => {
  if (!guest) return null;

  return (
    <Dialog open={!!guest} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Guest</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input 
                value={guest.first_name || ''}
                onChange={(e) => onGuestChange('first_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input 
                value={guest.last_name || ''}
                onChange={(e) => onGuestChange('last_name', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input 
              value={guest.email || ''}
              onChange={(e) => onGuestChange('email', e.target.value || null)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input 
              value={guest.phone || ''}
              onChange={(e) => onGuestChange('phone', e.target.value || null)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Dietary Restrictions</label>
            <Input 
              value={guest.dietary_restrictions || ''}
              onChange={(e) => onGuestChange('dietary_restrictions', e.target.value || null)}
            />
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
