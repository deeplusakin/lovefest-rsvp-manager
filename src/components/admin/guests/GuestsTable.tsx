
import React from "react";
import { Guest } from "../types/guest";
import { GuestRow } from "./GuestRow";
import { GuestEditDialog } from "./GuestEditDialog";
import { HouseholdEditDialog } from "./HouseholdEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useHouseholds } from "../hooks/useHouseholds";
import { Table, TableBody } from "@/components/ui/table";
import { useGuestOperations } from "../hooks/useGuestOperations";
import { useHouseholdOperations } from "../hooks/useHouseholdOperations";
import { useGuestEdit } from "../hooks/useGuestEdit";
import { GuestBulkActions } from "./GuestBulkActions";
import { GuestTableHeader } from "./GuestTableHeader";

interface GuestsTableProps {
  guests: Guest[];
  onDelete: () => void;
}

export const GuestsTable = ({ guests, onDelete }: GuestsTableProps) => {
  // Sort guests alphabetically by last name
  const sortedGuests = [...guests].sort((a, b) => a.last_name.localeCompare(b.last_name));
  
  // Group guests by household
  const guestsByHousehold: Record<string, Guest[]> = {};
  sortedGuests.forEach((guest) => {
    if (!guestsByHousehold[guest.household_id]) {
      guestsByHousehold[guest.household_id] = [];
    }
    guestsByHousehold[guest.household_id].push(guest);
  });
  
  // Sort households by first guest's last name for consistent ordering
  const sortedHouseholdIds = Object.keys(guestsByHousehold).sort((a, b) => {
    const aGuest = guestsByHousehold[a][0];
    const bGuest = guestsByHousehold[b][0];
    return aGuest.last_name.localeCompare(bGuest.last_name);
  });
  
  const { households, fetchHouseholds } = useHouseholds();
  
  const {
    selectedGuests,
    selectedHouseholds,
    showDeleteConfirm,
    bulkDeleteType,
    setShowDeleteConfirm,
    handleDelete,
    handleBulkDelete,
    confirmBulkDelete,
    handleSelectGuest,
    handleSelectHousehold,
    handleSelectAllGuests,
    handleSelectAllHouseholds
  } = useGuestOperations(onDelete);

  const {
    editingHousehold,
    isCreatingNewHousehold,
    newHouseholdName,
    editingHouseholdData,
    setEditingHousehold,
    setIsCreatingNewHousehold,
    setNewHouseholdName,
    setEditingHouseholdData,
    createNewHousehold,
    updateGuestHousehold,
    updateHousehold,
    openHouseholdEdit
  } = useHouseholdOperations(onDelete);

  const {
    editingGuest,
    setEditingGuest,
    handleGuestChange,
    updateGuest
  } = useGuestEdit(onDelete);

  // Get all guests for calculating selection states
  const allGuests = sortedHouseholdIds.flatMap(id => guestsByHousehold[id]);
  const isAllGuestsSelected = allGuests.length > 0 && selectedGuests.length === allGuests.length;
  
  // Get unique households for bulk selection
  const uniqueHouseholds = sortedHouseholdIds;
  const isAllHouseholdsSelected = uniqueHouseholds.length > 0 && 
    selectedHouseholds.length === uniqueHouseholds.length;

  return (
    <>
      <GuestBulkActions
        selectedGuestsCount={selectedGuests.length}
        selectedHouseholdsCount={selectedHouseholds.length}
        onDeleteGuests={() => handleBulkDelete('guests')}
        onDeleteHouseholds={() => handleBulkDelete('households')}
      />

      <div className="overflow-x-auto">
        <Table>
          <GuestTableHeader
            isAllGuestsSelected={isAllGuestsSelected}
            onSelectAllGuests={(checked) => handleSelectAllGuests(allGuests, checked)}
            isAllHouseholdsSelected={isAllHouseholdsSelected}
            onSelectAllHouseholds={(checked) => handleSelectAllHouseholds(uniqueHouseholds, checked)}
          />
          <TableBody>
            {sortedHouseholdIds.map((householdId) => (
              <React.Fragment key={householdId}>
                {/* Render household section */}
                {guestsByHousehold[householdId].map((guest) => (
                  <GuestRow
                    key={guest.id}
                    guest={guest}
                    isSelected={selectedGuests.includes(guest.id)}
                    onSelectGuest={handleSelectGuest}
                    onSelectHousehold={handleSelectHousehold}
                    isHouseholdSelected={selectedHouseholds.includes(guest.household_id)}
                    onEditGuest={(guest) => setEditingGuest({ ...guest })}
                    onEditHousehold={setEditingHousehold}
                    onEditHouseholdData={(householdId) => openHouseholdEdit(householdId, households)}
                    onDeleteGuest={handleDelete}
                    editingHousehold={editingHousehold}
                    isCreatingNewHousehold={isCreatingNewHousehold}
                    newHouseholdName={newHouseholdName}
                    setNewHouseholdName={setNewHouseholdName}
                    onCreateNewHousehold={createNewHousehold}
                    onCancelEditHousehold={() => {
                      setEditingHousehold(null);
                      setIsCreatingNewHousehold(false);
                      setNewHouseholdName("");
                    }}
                    households={households}
                    onUpdateGuestHousehold={updateGuestHousehold}
                    onStartCreateNewHousehold={() => setIsCreatingNewHousehold(true)}
                  />
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <GuestEditDialog
        guest={editingGuest}
        onClose={() => setEditingGuest(null)}
        onSave={updateGuest}
        onGuestChange={handleGuestChange}
      />

      <HouseholdEditDialog
        household={editingHouseholdData}
        onClose={() => setEditingHouseholdData(null)}
        onSave={updateHousehold}
        onHouseholdChange={(field, value) => {
          if (editingHouseholdData) {
            setEditingHouseholdData({
              ...editingHouseholdData,
              [field]: value
            });
          }
        }}
      />

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmBulkDelete}
        type={bulkDeleteType}
        count={bulkDeleteType === 'guests' ? selectedGuests.length : selectedHouseholds.length}
      />
    </>
  );
};
