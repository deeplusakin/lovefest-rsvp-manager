import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Household } from "../types/guest";

interface DuplicateGroup {
  name: string;
  households: Household[];
}

export const useHouseholdConsolidation = (onSuccess: () => void) => {
  const [isConsolidating, setIsConsolidating] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const findDuplicateHouseholds = async () => {
    setIsLoading(true);
    try {
      // Get all households
      const { data: households, error } = await supabase
        .from('households')
        .select('id, name, invitation_code, address')
        .order('name');
      
      if (error) throw error;

      // Group households by lowercase name to find duplicates
      const householdsByName = new Map<string, Household[]>();
      
      households?.forEach((household) => {
        const lowerName = household.name.toLowerCase();
        if (!householdsByName.has(lowerName)) {
          householdsByName.set(lowerName, []);
        }
        householdsByName.get(lowerName)?.push(household as Household);
      });

      // Filter for groups with more than one household (duplicates)
      const duplicates: DuplicateGroup[] = [];
      householdsByName.forEach((householdGroup, name) => {
        if (householdGroup.length > 1) {
          duplicates.push({
            name,
            households: householdGroup
          });
        }
      });

      setDuplicateGroups(duplicates);
      return duplicates.length > 0;
    } catch (error) {
      console.error('Error finding duplicate households:', error);
      toast.error("Error finding duplicate households");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const consolidateHouseholds = async () => {
    setIsConsolidating(true);
    try {
      let totalConsolidated = 0;

      // Process each group of duplicates
      for (const group of duplicateGroups) {
        // Choose the first household as the one to keep
        const primaryHousehold = group.households[0];
        const duplicatesToRemove = group.households.slice(1);

        for (const duplicate of duplicatesToRemove) {
          // Update all guests from the duplicate household to the primary one
          const { error: updateError } = await supabase
            .from('guests')
            .update({ household_id: primaryHousehold.id })
            .eq('household_id', duplicate.id);
            
          if (updateError) throw updateError;

          // Delete the duplicate household
          const { error: deleteError } = await supabase
            .from('households')
            .delete()
            .eq('id', duplicate.id);

          if (deleteError) {
            console.error(`Error deleting household ${duplicate.id}:`, deleteError);
            toast.error(`Error deleting duplicate household: ${duplicate.name}`);
          } else {
            totalConsolidated++;
          }
        }
      }

      toast.success(`Consolidated ${totalConsolidated} duplicate households`);
      onSuccess();
      setDuplicateGroups([]);
    } catch (error) {
      console.error('Error consolidating households:', error);
      toast.error("Error consolidating households");
    } finally {
      setIsConsolidating(false);
    }
  };

  return {
    isConsolidating,
    duplicateGroups,
    isLoading,
    findDuplicateHouseholds,
    consolidateHouseholds
  };
};
