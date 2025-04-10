
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface GuestTableHeaderProps {
  isAllGuestsSelected: boolean;
  onSelectAllGuests: (checked: boolean) => void;
  isAllHouseholdsSelected: boolean;
  onSelectAllHouseholds: (checked: boolean) => void;
}

export const GuestTableHeader: React.FC<GuestTableHeaderProps> = ({
  isAllGuestsSelected,
  onSelectAllGuests,
  isAllHouseholdsSelected,
  onSelectAllHouseholds
}) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox 
            checked={isAllGuestsSelected}
            onCheckedChange={(checked) => onSelectAllGuests(checked === true)}
          />
        </TableHead>
        <TableHead>Guest</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>
          <div className="flex items-center gap-2">
            Household
            <Checkbox 
              checked={isAllHouseholdsSelected}
              onCheckedChange={(checked) => onSelectAllHouseholds(checked === true)}
            />
          </div>
        </TableHead>
        <TableHead>Invitation Code</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
