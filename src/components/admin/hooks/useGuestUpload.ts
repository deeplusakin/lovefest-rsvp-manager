
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

  const uploadGuests = async (guests: GuestData[]) => {
    if (guests.length === 0) {
      toast.error("No guest data to upload");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
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

      toast.success(`Processed ${successCount} guests successfully${errorCount > 0 ? `. ${errorCount} errors occurred.` : ''}`);
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
