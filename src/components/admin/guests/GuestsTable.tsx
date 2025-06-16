
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
import { useGuestGroups } from "../hooks/useGuestGroups";

interface GuestsTableProps {
  guests: Guest[];
  onDelete: () => void;
}

export const GuestsTable = ({ guests, onDelete }: GuestsTableProps) => {
  const { households, fetchHouseholds } = useHouseholds();
  
  const { 
    sortedHouseholdIds, 
    guestsByHousehold, 
    allGuests,
    uniqueHouseholds 
  } = useGuestGroups(guests);
  
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
    allHouseholds,
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

  // Calculate selection states
  const isAllGuestsSelected = allGuests.length > 0 && 
    selectedGuests.length === allGuests.length;
  
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
              <div key={householdId}>
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
              </div>
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
        allHouseholds={allHouseholds}
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
