
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest } from "../types/guest";

export const useGuestOperations = (onDelete: () => void) => {
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectedHouseholds, setSelectedHouseholds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bulkDeleteType, setBulkDeleteType] = useState<'guests' | 'households'>('guests');

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

  const handleSelectAllGuests = (guests: Guest[], checked: boolean) => {
    if (checked) {
      setSelectedGuests(guests.map(g => g.id));
    } else {
      setSelectedGuests([]);
    }
  };

  const handleSelectAllHouseholds = (householdIds: string[], checked: boolean) => {
    if (checked) {
      setSelectedHouseholds(householdIds);
    } else {
      setSelectedHouseholds([]);
    }
  };

  return {
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
  };
};
