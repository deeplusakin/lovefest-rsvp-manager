
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GuestData } from "../types/csv-types";
import { generateInvitationCode } from "../utils/csv-utils";

export const useGuestUpload = (eventId: string, onUploadSuccess?: () => void) => {
  const [uploading, setUploading] = useState(false);
  const [weddingEventId, setWeddingEventId] = useState<string | null>(null);

  // Fetch the Wedding event ID when the hook is initialized
  useEffect(() => {
    const fetchWeddingEventId = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('id')
        .ilike('name', '%wedding%')
        .limit(1);
      
      if (error) {
        console.error('Error fetching Wedding event:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setWeddingEventId(data[0].id);
      }
    };

    fetchWeddingEventId();
  }, []);

  const uploadGuests = async (guests: GuestData[], replaceExisting: boolean = true) => {
    if (guests.length === 0) {
      toast.error("No guest data to upload");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // If we're replacing existing guests for this event, first remove them
      if (replaceExisting) {
        // Get all guests currently associated with this event
        const { data: existingGuestEvents, error: fetchError } = await supabase
          .from('guest_events')
          .select('guest_id')
          .eq('event_id', eventId);
        
        if (fetchError) {
          console.error('Error fetching existing guest events:', fetchError);
          throw fetchError;
        }

        if (existingGuestEvents && existingGuestEvents.length > 0) {
          // Remove all guest_events associations for this event
          const { error: deleteError } = await supabase
            .from('guest_events')
            .delete()
            .eq('event_id', eventId);
          
          if (deleteError) {
            console.error('Error removing existing guest events:', deleteError);
            throw deleteError;
          }

          // Also delete the guests themselves if they're no longer needed
          // Note: This will only delete guests that don't have any other event associations
          for (const guestEvent of existingGuestEvents) {
            // Check if this guest is associated with any other events
            const { data: otherEvents, error: otherEventsError } = await supabase
              .from('guest_events')
              .select('event_id')
              .eq('guest_id', guestEvent.guest_id)
              .neq('event_id', eventId);
            
            if (otherEventsError) {
              console.error('Error checking other events for guest:', otherEventsError);
              continue;
            }
            
            // If the guest isn't associated with any other events, delete them
            if (!otherEvents || otherEvents.length === 0) {
              // Get household ID first (so we can check if it should be deleted)
              const { data: guestData, error: guestError } = await supabase
                .from('guests')
                .select('household_id')
                .eq('id', guestEvent.guest_id)
                .single();
              
              if (guestError) {
                console.error('Error fetching guest household:', guestError);
                continue;
              }
              
              const householdId = guestData?.household_id;
              
              // Delete the guest
              const { error: deleteGuestError } = await supabase
                .from('guests')
                .delete()
                .eq('id', guestEvent.guest_id);
              
              if (deleteGuestError) {
                console.error('Error deleting guest:', deleteGuestError);
                continue;
              }
              
              // If there are no other guests in this household, delete it too
              if (householdId) {
                const { data: otherGuests, error: otherGuestsError } = await supabase
                  .from('guests')
                  .select('id')
                  .eq('household_id', householdId);
                
                if (otherGuestsError) {
                  console.error('Error checking other guests for household:', otherGuestsError);
                  continue;
                }
                
                if (!otherGuests || otherGuests.length === 0) {
                  const { error: deleteHouseholdError } = await supabase
                    .from('households')
                    .delete()
                    .eq('id', householdId);
                  
                  if (deleteHouseholdError) {
                    console.error('Error deleting household:', deleteHouseholdError);
                  }
                }
              }
            }
          }
          
          toast.success(`Removed ${existingGuestEvents.length} existing guest associations from this event`);
        }
      }

      // Now add the new guests
      for (const guest of guests) {
        try {
          // First create a new household for the guest
          const { data: household, error: householdError } = await supabase
            .from('households')
            .insert({
              name: `${guest.first_name} ${guest.last_name} Household`,
              invitation_code: generateInvitationCode()
            })
            .select('id')
            .single();

          if (householdError) throw householdError;

          // Then create the guest with the new household ID
          const { data: newGuest, error: guestError } = await supabase
            .from('guests')
            .insert({
              first_name: guest.first_name,
              last_name: guest.last_name,
              email: guest.email || null,
              dietary_restrictions: guest.dietary_restrictions || null,
              household_id: household.id
            })
            .select('id')
            .single();

          if (guestError) throw guestError;

          // Add the guest to the specified event (from props)
          const { error: currentEventError } = await supabase
            .from('guest_events')
            .upsert({
              guest_id: newGuest.id,
              event_id: eventId,
              status: 'invited'
            });

          if (currentEventError) throw currentEventError;

          // If we have a wedding event ID and it's different from the current event,
          // also add the guest to the wedding event
          if (weddingEventId && weddingEventId !== eventId) {
            const { error: weddingEventError } = await supabase
              .from('guest_events')
              .upsert({
                guest_id: newGuest.id,
                event_id: weddingEventId,
                status: 'invited'
              });

            if (weddingEventError) throw weddingEventError;
          }

          successCount++;
        } catch (error) {
          console.error('Error processing guest:', guest, error);
          errorCount++;
        }
      }

      const message = replaceExisting 
        ? `Replaced guest list: ${successCount} guests added successfully` 
        : `Processed ${successCount} guests successfully`;
        
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
    uploading,
    weddingEventId
  };
};
