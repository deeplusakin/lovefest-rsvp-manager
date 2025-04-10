
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest } from "../types/guest";

export const useGuestEdit = (onDelete: () => void) => {
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  const handleGuestChange = (field: keyof Guest, value: string) => {
    if (!editingGuest) return;
    
    setEditingGuest({
      ...editingGuest,
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

  return {
    editingGuest,
    setEditingGuest,
    handleGuestChange,
    updateGuest
  };
};
