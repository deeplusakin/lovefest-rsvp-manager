
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Household } from "../types/guest";

export const useHouseholdOperations = (onDelete: () => void) => {
  const [editingHousehold, setEditingHousehold] = useState<string | null>(null);
  const [isCreatingNewHousehold, setIsCreatingNewHousehold] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [editingHouseholdData, setEditingHouseholdData] = useState<Household | null>(null);
  const [allHouseholds, setAllHouseholds] = useState<Household[]>([]);

  useEffect(() => {
    fetchAllHouseholds();
  }, []);

  const fetchAllHouseholds = async () => {
    const { data, error } = await supabase
      .from('households')
      .select('id, name, invitation_code, address')
      .order('name');
    
    if (!error && data) {
      setAllHouseholds(data);
    }
  };

  const isHouseholdNameDuplicate = (name: string, excludeId?: string) => {
    return allHouseholds.some(
      h => h.id !== excludeId && h.name.toLowerCase() === name.toLowerCase()
    );
  };

  const createNewHousehold = async (guestId: string) => {
    if (!newHouseholdName.trim()) {
      toast.error("Please enter a household name");
      return;
    }

    if (isHouseholdNameDuplicate(newHouseholdName)) {
      toast.error("A household with this name already exists");
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
      await fetchAllHouseholds();
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

  const updateHousehold = async () => {
    if (!editingHouseholdData) return;
    
    if (!editingHouseholdData.name.trim()) {
      toast.error("Household name cannot be empty");
      return;
    }

    if (isHouseholdNameDuplicate(editingHouseholdData.name, editingHouseholdData.id)) {
      toast.error("A household with this name already exists");
      return;
    }

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
      await fetchAllHouseholds();
      onDelete(); // Refresh guest list to show updated household information
    } catch (error) {
      console.error('Error updating household:', error);
      toast.error("Error updating household");
    }
  };

  const openHouseholdEdit = (householdId: string, households: Household[]) => {
    const household = households.find(h => h.id === householdId);
    if (household) {
      setEditingHouseholdData({ ...household });
    }
  };

  return {
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
  };
};
