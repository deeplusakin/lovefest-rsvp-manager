
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuestData {
  first_name: string;
  last_name: string;
  email?: string;
  dietary_restrictions?: string;
}

export const useGuestUpload = (eventId: string, onUploadSuccess?: () => void) => {
  const [uploading, setUploading] = useState(false);

  const uploadGuests = async (
    guests: GuestData[], 
    replaceExisting: boolean = false,
    preserveRsvpResponses: boolean = true
  ) => {
    if (guests.length === 0) {
      toast.error("No guest data to upload");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // If replacing existing, we'll handle that by removing old data
      if (replaceExisting) {
        // Delete all guests associated with this event
        const { error: deleteError } = await supabase
          .from('guest_events')
          .delete()
          .eq('event_id', eventId);
        
        if (deleteError) throw deleteError;
        
        toast.success(`Removed existing guest list for this event`);
      }

      // Group guests by last name (assumed household)
      const households: Record<string, GuestData[]> = {};
      
      guests.forEach(guest => {
        const householdKey = guest.last_name.trim().toLowerCase();
        if (!households[householdKey]) {
          households[householdKey] = [];
        }
        households[householdKey].push(guest);
      });

      // Process each household
      for (const [householdKey, householdGuests] of Object.entries(households)) {
        try {
          // Check if a household with this name already exists
          const { data: existingHousehold, error: householdError } = await supabase
            .from('households')
            .select('*')
            .ilike('name', `${householdGuests[0].last_name} Household`)
            .limit(1);
          
          let householdId;
          
          if (householdError) throw householdError;
          
          // If household exists, use it; otherwise create a new one
          if (existingHousehold && existingHousehold.length > 0) {
            householdId = existingHousehold[0].id;
          } else {
            // Generate invitation code using our new function
            const { data: codeData, error: codeError } = await supabase
              .rpc('generate_invitation_code');
              
            if (codeError) throw codeError;
            
            const invitationCode = codeData;
            
            // Create new household
            const { data: newHousehold, error: createError } = await supabase
              .from('households')
              .insert({
                name: `${householdGuests[0].last_name} Household`,
                invitation_code: invitationCode
              })
              .select('id')
              .single();
            
            if (createError) throw createError;
            
            householdId = newHousehold.id;
          }

          // Add all guests to this household
          for (const guest of householdGuests) {
            // Check if this guest already exists in this household
            const { data: existingGuest, error: existingGuestError } = await supabase
              .from('guests')
              .select('id')
              .eq('household_id', householdId)
              .ilike('first_name', guest.first_name)
              .ilike('last_name', guest.last_name);
            
            if (existingGuestError) throw existingGuestError;
            
            let guestId;
            
            if (existingGuest && existingGuest.length > 0) {
              // Update existing guest
              guestId = existingGuest[0].id;
              const { error: updateError } = await supabase
                .from('guests')
                .update({
                  email: guest.email,
                  dietary_restrictions: guest.dietary_restrictions
                })
                .eq('id', guestId);
              
              if (updateError) throw updateError;
            } else {
              // Create new guest
              const { data: newGuest, error: guestError } = await supabase
                .from('guests')
                .insert({
                  first_name: guest.first_name,
                  last_name: guest.last_name,
                  email: guest.email || null,
                  dietary_restrictions: guest.dietary_restrictions || null,
                  household_id: householdId
                })
                .select('id')
                .single();

              if (guestError) throw guestError;
              guestId = newGuest.id;
            }

            // Add the guest to the event if they're not already added
            const { error: rsvpError } = await supabase
              .from('guest_events')
              .upsert({
                guest_id: guestId,
                event_id: eventId,
                status: 'invited'
              });

            if (rsvpError) throw rsvpError;
            
            successCount++;
          }
        } catch (error) {
          console.error('Error processing household:', householdKey, error);
          errorCount += householdGuests.length;
        }
      }

      const message = replaceExisting 
        ? `Replaced guest list: ${successCount} guests added successfully` 
        : `Added ${successCount} guests successfully`;
        
      toast.success(`${message}${errorCount > 0 ? `. ${errorCount} errors occurred.` : ''}`);
      onUploadSuccess?.();
    } catch (error: any) {
      console.error("Error uploading guest list:", error);
      toast.error("Error uploading guest list: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadGuests,
    uploading
  };
};
