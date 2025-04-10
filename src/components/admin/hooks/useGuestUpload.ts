import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GuestData } from "../types/csv-types";
import { generateInvitationCode } from "../utils/csv-utils";
import { RsvpStatus } from "../types/guest-events";

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

  const uploadGuests = async (
    guests: GuestData[], 
    replaceExisting: boolean = true,
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
      // Store existing RSVP responses if we want to preserve them
      let existingRsvps: Record<string, Record<string, {status: RsvpStatus, response_date: string | null}>> = {};
      
      if (preserveRsvpResponses && replaceExisting) {
        // Get all existing guest information to map between old and new guests (by name)
        const { data: existingGuests, error: existingGuestsError } = await supabase
          .from('guests')
          .select(`
            id, 
            first_name, 
            last_name,
            guest_events(status, event_id, response_date)
          `);
        
        if (existingGuestsError) {
          console.error('Error fetching existing guests:', existingGuestsError);
        } else if (existingGuests) {
          // Create a map of guest full names to their RSVP responses
          existingRsvps = existingGuests.reduce((acc, guest) => {
            const fullName = `${guest.first_name.toLowerCase()} ${guest.last_name.toLowerCase()}`;
            
            if (guest.guest_events && guest.guest_events.length > 0) {
              acc[fullName] = guest.guest_events.reduce((events, ge) => {
                events[ge.event_id] = {
                  status: ge.status as RsvpStatus,
                  response_date: ge.response_date
                };
                return events;
              }, {} as Record<string, {status: RsvpStatus, response_date: string | null}>);
            }
            
            return acc;
          }, {} as Record<string, Record<string, {status: RsvpStatus, response_date: string | null}>>);
        }
      }

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

      // Group guests by household
      const households: Record<string, GuestData[]> = {};
      
      // First, group guests by their last name (assuming people with the same last name are in the same household)
      guests.forEach(guest => {
        const householdKey = guest.last_name.trim().toLowerCase();
        if (!households[householdKey]) {
          households[householdKey] = [];
        }
        households[householdKey].push(guest);
      });

      // Now process each household
      for (const [householdKey, householdGuests] of Object.entries(households)) {
        try {
          // Create one household for all guests with the same last name
          const { data: household, error: householdError } = await supabase
            .from('households')
            .insert({
              name: `${householdGuests[0].last_name} Household`,
              invitation_code: generateInvitationCode()
            })
            .select('id')
            .single();

          if (householdError) throw householdError;

          // Add all guests to this household
          for (const guest of householdGuests) {
            // Create the guest with the household ID
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

            // Check if we have existing RSVP data for this guest
            const guestFullName = `${guest.first_name.toLowerCase()} ${guest.last_name.toLowerCase()}`;
            const existingGuestRsvps = existingRsvps[guestFullName];
            
            // Add the guest to the specified event (from props)
            let eventStatus: RsvpStatus = 'invited';
            let responseDate: string | null = null;
            
            if (existingGuestRsvps?.[eventId]) {
              eventStatus = existingGuestRsvps[eventId].status;
              responseDate = existingGuestRsvps[eventId].response_date;
            }
            
            const { error: currentEventError } = await supabase
              .from('guest_events')
              .upsert({
                guest_id: newGuest.id,
                event_id: eventId,
                status: eventStatus,
                response_date: responseDate
              });

            if (currentEventError) throw currentEventError;

            // If we have a wedding event ID and it's different from the current event,
            // also add the guest to the wedding event
            if (weddingEventId && weddingEventId !== eventId) {
              let weddingEventStatus: RsvpStatus = 'invited';
              let weddingResponseDate: string | null = null;
              
              if (existingGuestRsvps?.[weddingEventId]) {
                weddingEventStatus = existingGuestRsvps[weddingEventId].status;
                weddingResponseDate = existingGuestRsvps[weddingEventId].response_date;
              }
              
              const { error: weddingEventError } = await supabase
                .from('guest_events')
                .upsert({
                  guest_id: newGuest.id,
                  event_id: weddingEventId,
                  status: weddingEventStatus,
                  response_date: weddingResponseDate
                });

              if (weddingEventError) throw weddingEventError;
            }

            successCount++;
          }
        } catch (error) {
          console.error('Error processing household:', householdKey, error);
          errorCount += householdGuests.length;
        }
      }

      const message = replaceExisting 
        ? `Replaced guest list: ${successCount} guests added successfully` 
        : `Processed ${successCount} guests successfully`;
      
      const rsvpMessage = preserveRsvpResponses && replaceExisting
        ? ' (preserved existing RSVP responses)'
        : '';
        
      toast.success(`${message}${rsvpMessage}${errorCount > 0 ? `. ${errorCount} errors occurred.` : ''}`);
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
