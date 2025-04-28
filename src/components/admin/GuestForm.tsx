
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HouseholdField } from "./guests/HouseholdField";
import { GuestFields } from "./guests/GuestFields";
import { useWeddingEvent } from "./hooks/useWeddingEvent";
import { Household } from "./types/guest";

interface GuestFormProps {
  onSuccess?: () => void;
}

export const GuestForm = ({ onSuccess }: GuestFormProps) => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>("");
  const [guestData, setGuestData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dietaryRestrictions: ""
  });
  
  const { weddingEventId } = useWeddingEvent();

  const fetchHouseholds = async () => {
    const { data, error } = await supabase
      .from('households')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error("Error fetching households");
      return;
    }
    
    setHouseholds(data || []);
  };

  const handleGuestDataChange = (field: string, value: string) => {
    setGuestData(prev => ({ ...prev, [field]: value }));
  };

  const createGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHouseholdId) {
      toast.error("Please select or create a household");
      return;
    }

    try {
      // Create the guest
      const { data: newGuest, error: guestError } = await supabase
        .from('guests')
        .insert({
          first_name: guestData.firstName,
          last_name: guestData.lastName,
          email: guestData.email || null,
          dietary_restrictions: guestData.dietaryRestrictions || null,
          household_id: selectedHouseholdId
        })
        .select('id')
        .single();

      if (guestError) throw guestError;

      // If we have a wedding event ID, automatically add the guest to this event
      if (weddingEventId) {
        const { error: rsvpError } = await supabase
          .from('guest_events')
          .insert({
            guest_id: newGuest.id,
            event_id: weddingEventId,
            status: 'invited'
          });

        if (rsvpError) {
          console.error('Error adding guest to Wedding event:', rsvpError);
          toast.error("Guest created but couldn't be added to the Wedding event");
        } else {
          toast.success("Guest added successfully and invited to the Wedding");
        }
      } else {
        toast.success("Guest added successfully");
      }

      setGuestData({
        firstName: "",
        lastName: "",
        email: "",
        dietaryRestrictions: ""
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating guest:', error);
      toast.error("Error creating guest");
    }
  };

  // Fetch households when component mounts
  useEffect(() => {
    fetchHouseholds();
  }, []);

  return (
    <form onSubmit={createGuest} className="space-y-6">
      <div className="space-y-4">
        <HouseholdField 
          households={households}
          selectedHouseholdId={selectedHouseholdId}
          onHouseholdSelect={setSelectedHouseholdId}
        />

        <GuestFields
          firstName={guestData.firstName}
          lastName={guestData.lastName}
          email={guestData.email}
          dietaryRestrictions={guestData.dietaryRestrictions}
          onChange={handleGuestDataChange}
        />
      </div>

      <Button type="submit">Add Guest</Button>
    </form>
  );
};
