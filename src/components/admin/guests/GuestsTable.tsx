import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest, Household } from "../types/guest";
import { GuestRow } from "./GuestRow";
import { GuestEditDialog } from "./GuestEditDialog";
import { HouseholdEditDialog } from "./HouseholdEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useHouseholds } from "../hooks/useHouseholds";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface GuestsTableProps {
  guests: Guest[];
  onDelete: () => void;
}

export const GuestsTable = ({ guests, onDelete }: GuestsTableProps) => {
  // Sort guests alphabetically by last name, then by first name
  const sortedGuests = [...guests].sort((a, b) => {
    const lastNameComparison = a.last_name.localeCompare(b.last_name);
    if (lastNameComparison !== 0) return lastNameComparison;
    return a.first_name.localeCompare(b.first_name);
  });
  
  // For managing household edit state
  const [editingHousehold, setEditingHousehold] = useState<string | null>(null);
  const [isCreatingNewHousehold, setIsCreatingNewHousehold] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState("");
  
  // For editing a guest
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  
  // For editing a household directly
  const [editingHouseholdData, setEditingHouseholdData] = useState<Household | null>(null);
  
  // For bulk deletion
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectedHouseholds, setSelectedHouseholds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bulkDeleteType, setBulkDeleteType] = useState<'guests' | 'households'>('guests');

  const { households, fetchHouseholds } = useHouseholds();

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

  // Functions for bulk operations
  const handleSelectGuest = (guestId: string, checked: boolean) => {
    if (checked) {
      setSelectedGuests(prev => [...prev, guestId]);
    } else {
      setSelectedGuests(prev => prev.filter(id => id !== guestId));
    }
  };

  const handleSelectHousehold = (householdId: string, checked: boolean) => {
    if (checked) {
      setSelectedHouseholds(prev => [...prev, householdId]);
    } else {
      setSelectedHouseholds(prev => prev.filter(id => id !== householdId));
    }
  };
  
  const handleBulkDelete = (type: 'guests' | 'households') => {
    setBulkDeleteType(type);
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      if (bulkDeleteType === 'guests' && selectedGuests.length > 0) {
        // First, delete all guest_events records for these guests
        const { error: eventError } = await supabase
          .from('guest_events')
          .delete()
          .in('guest_id', selectedGuests);

        if (eventError) throw eventError;

        // Then delete the guest records
        const { error: guestError } = await supabase
          .from('guests')
          .delete()
          .in('id', selectedGuests);

        if (guestError) throw guestError;
        
        toast.success(`${selectedGuests.length} guests deleted successfully`);
        setSelectedGuests([]);
      } 
      else if (bulkDeleteType === 'households' && selectedHouseholds.length > 0) {
        // For each household:
        for (const householdId of selectedHouseholds) {
          // 1. Get all guests in this household
          const { data: householdGuests, error: guestFetchError } = await supabase
            .from('guests')
            .select('id')
            .eq('household_id', householdId);
            
          if (guestFetchError) throw guestFetchError;
          
          if (householdGuests && householdGuests.length > 0) {
            const guestIds = householdGuests.map(g => g.id);
            
            // 2. Delete guest_events records for these guests
            const { error: eventError } = await supabase
              .from('guest_events')
              .delete()
              .in('guest_id', guestIds);
              
            if (eventError) throw eventError;
            
            // 3. Delete the guest records
            const { error: guestError } = await supabase
              .from('guests')
              .delete()
              .in('id', guestIds);
              
            if (guestError) throw guestError;
          }
          
          // 4. Delete the household record
          const { error: householdError } = await supabase
            .from('households')
            .delete()
            .eq('id', householdId);
            
          if (householdError) throw householdError;
        }
        
        toast.success(`${selectedHouseholds.length} households deleted successfully`);
        setSelectedHouseholds([]);
      }
      
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error during bulk delete:', error);
      toast.error("Error during bulk delete operation");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const isAllGuestsSelected = sortedGuests.length > 0 && selectedGuests.length === sortedGuests.length;
  
  // Get unique households for bulk selection
  const uniqueHouseholds = Array.from(
    new Set(sortedGuests.map(guest => guest.household_id))
  );
  const isAllHouseholdsSelected = uniqueHouseholds.length > 0 && 
    selectedHouseholds.length === uniqueHouseholds.length;

  const createNewHousehold = async (guestId: string) => {
    if (!newHouseholdName.trim()) {
      toast.error("Please enter a household name");
      return;
    }

    try {
      // Create new household with a random invitation code
      const { data: household, error: householdError } = await supabase
        .from('households')
        .insert({ 
          name: newHouseholdName.trim(),
          invitation_code: Math.random().toString(36).substring(2, 8).toUpperCase()
        })
        .select()
        .single();

      if (householdError) throw householdError;

      // Update guest's household
      const { error: updateError } = await supabase
        .from('guests')
        .update({ household_id: household.id })
        .eq('id', guestId);

      if (updateError) throw updateError;

      toast.success("Household created and assigned successfully");
      setNewHouseholdName("");
      setIsCreatingNewHousehold(false);
      setEditingHousehold(null);
      fetchHouseholds();
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error creating household:', error);
      toast.error("Error creating household");
    }
  };

  const updateGuestHousehold = async (guestId: string, householdId: string) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ household_id: householdId })
        .eq('id', guestId);

      if (error) throw error;

      toast.success("Household updated successfully");
      setEditingHousehold(null);
      onDelete(); // Refresh guest list
    } catch (error) {
      console.error('Error updating household:', error);
      toast.error("Error updating household");
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="space-x-2">
          <Button 
            variant="destructive" 
            size="sm"
            disabled={selectedGuests.length === 0}
            onClick={() => handleBulkDelete('guests')}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected Guests ({selectedGuests.length})
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            disabled={selectedHouseholds.length === 0}
            onClick={() => handleBulkDelete('households')}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected Households ({selectedHouseholds.length})
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={isAllGuestsSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedGuests(sortedGuests.map(g => g.id));
                    } else {
                      setSelectedGuests([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Household
                  <Checkbox 
                    checked={isAllHouseholdsSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHouseholds(uniqueHouseholds);
                      } else {
                        setSelectedHouseholds([]);
                      }
                    }}
                  />
                </div>
              </TableHead>
              <TableHead>Invitation Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedGuests.map((guest) => (
              <GuestRow
                key={guest.id}
                guest={guest}
                isSelected={selectedGuests.includes(guest.id)}
                onSelectGuest={handleSelectGuest}
                onSelectHousehold={handleSelectHousehold}
                isHouseholdSelected={selectedHouseholds.includes(guest.household_id)}
                onEditGuest={(guest) => setEditingGuest({ ...guest })}
                onEditHousehold={setEditingHousehold}
                onEditHouseholdData={openHouseholdEdit}
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
        onHouseholdChange={handleHouseholdChange}
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
