
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest, Household } from "../types/guest";
import { GuestTableRow } from "./GuestTableRow";
import { GuestEditDialog } from "./GuestEditDialog";
import { HouseholdEditDialog } from "./HouseholdEditDialog";
import { useHouseholds } from "../hooks/useHouseholds";

interface GuestsTableProps {
  guests: Guest[];
  onDelete: () => void;
}

export const GuestsTable = ({ guests, onDelete }: GuestsTableProps) => {
  // For managing household edit state
  const [editingHousehold, setEditingHousehold] = useState<string | null>(null);
  const [isCreatingNewHousehold, setIsCreatingNewHousehold] = useState(false);
  
  // For editing a guest
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  
  // For editing a household directly
  const [editingHouseholdData, setEditingHouseholdData] = useState<Household | null>(null);

  const { fetchHouseholds } = useHouseholds();

  const handleDelete = async (guestId: string) => {
    try {
      // First, delete all guest_events records for this guest
      const { error: eventError } = await supabase
        .from('guest_events')
        .delete()
        .eq('guest_id', guestId);

      if (eventError) throw eventError;

      // Then delete the guest record
      const { error: guestError } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (guestError) throw guestError;
      
      toast.success("Guest deleted successfully");
      onDelete();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast.error("Error deleting guest");
    }
  };

  const handleGuestChange = (field: keyof Guest, value: string) => {
    if (!editingGuest) return;
    
    setEditingGuest({
      ...editingGuest,
      [field]: value
    });
  };

  const handleHouseholdChange = (field: keyof Household, value: string) => {
    if (!editingHouseholdData) return;
    
    setEditingHouseholdData({
      ...editingHouseholdData,
      [field]: value
    });
  };

  const updateGuest = async () => {
    if (!editingGuest) return;

    try {
      const { error } = await supabase
        .from('guests')
        .update({
          first_name: editingGuest.first_name,
          last_name: editingGuest.last_name,
          email: editingGuest.email,
          phone: editingGuest.phone,
          dietary_restrictions: editingGuest.dietary_restrictions
        })
        .eq('id', editingGuest.id);

      if (error) throw error;

      toast.success("Guest updated successfully");
      setEditingGuest(null);
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error updating guest:', error);
      toast.error("Error updating guest");
    }
  };

  const updateHousehold = async () => {
    if (!editingHouseholdData) return;

    try {
      const { error } = await supabase
        .from('households')
        .update({
          name: editingHouseholdData.name,
          address: editingHouseholdData.address
        })
        .eq('id', editingHouseholdData.id);

      if (error) throw error;

      toast.success("Household updated successfully");
      setEditingHouseholdData(null);
      fetchHouseholds();
      onDelete(); // Refresh guest list to show updated household information
    } catch (error) {
      console.error('Error updating household:', error);
      toast.error("Error updating household");
    }
  };

  // Function to open household edit dialog
  const openHouseholdEdit = (householdId: string) => {
    const household = guests.find(g => g.household_id === householdId)?.household;
    if (household) {
      setEditingHouseholdData({ 
        ...household,
        id: householdId
      });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Guest</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Household</th>
              <th className="text-left p-2">Invitation Code</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <GuestTableRow
                key={guest.id}
                guest={guest}
                onEdit={setEditingGuest}
                onDelete={handleDelete}
                onEditHousehold={setEditingHousehold}
                onEditHouseholdData={openHouseholdEdit}
                editingHousehold={editingHousehold}
                isCreatingNewHousehold={isCreatingNewHousehold}
                onStartCreateHousehold={() => setIsCreatingNewHousehold(true)}
                onCancelEditHousehold={() => {
                  setEditingHousehold(null);
                  setIsCreatingNewHousehold(false);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Guest Edit Dialog */}
      <GuestEditDialog
        guest={editingGuest}
        onClose={() => setEditingGuest(null)}
        onSave={updateGuest}
        onGuestChange={handleGuestChange}
      />

      {/* Household Edit Dialog */}
      <HouseholdEditDialog
        household={editingHouseholdData}
        onClose={() => setEditingHouseholdData(null)}
        onSave={updateHousehold}
        onHouseholdChange={handleHouseholdChange}
      />
    </>
  );
};
