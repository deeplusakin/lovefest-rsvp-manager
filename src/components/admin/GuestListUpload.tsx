
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface GuestListUploadProps {
  eventId: string;
}

export const GuestListUpload = ({ eventId }: GuestListUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    
    setUploading(true);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0].map(header => header.trim().toLowerCase());
        
        const guests = rows.slice(1).map(row => {
          const guest: any = {};
          row.forEach((value, index) => {
            guest[headers[index]] = value.trim();
          });
          return guest;
        });

        for (const guest of guests) {
          if (!guest.email) {
            console.log('Skipping guest with no email:', guest);
            continue;
          }

          const { data: existingGuest, error: guestError } = await supabase
            .from('guests')
            .select('id')
            .eq('email', guest.email)
            .maybeSingle();

          if (guestError) {
            console.error('Error checking for existing guest:', guestError);
            throw guestError;
          }

          let guestId = existingGuest?.id;

          if (!guestId) {
            const { data: newGuest, error: createError } = await supabase
              .from('guests')
              .insert({
                first_name: guest.first_name,
                last_name: guest.last_name,
                email: guest.email,
                dietary_restrictions: guest.dietary_restrictions,
                invitation_code: Math.random().toString(36).substring(2, 8),
                household_id: '00000000-0000-0000-0000-000000000000'
              })
              .select('id')
              .single();

            if (createError) {
              console.error('Error creating new guest:', createError);
              throw createError;
            }
            guestId = newGuest.id;
          }

          const { error: rsvpError } = await supabase
            .from('guest_events')
            .upsert({
              guest_id: guestId,
              event_id: eventId,
              status: 'invited'
            });

          if (rsvpError) {
            console.error('Error creating RSVP:', rsvpError);
            throw rsvpError;
          }
        }

        toast.success("Guest list uploaded successfully");
      } catch (error: any) {
        console.error("Error uploading guest list:", error);
        toast.error("Error uploading guest list: " + error.message);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="max-w-xs"
      />
      <Button variant="outline" disabled={uploading}>
        <Upload className="h-4 w-4 mr-2" />
        Upload CSV
      </Button>
    </div>
  );
};
