
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface GuestListUploadProps {
  eventId: string;
  onUploadSuccess?: () => void;
}

interface GuestData {
  first_name: string;
  last_name: string;
  email?: string;
  dietary_restrictions?: string;
}

export const GuestListUpload = ({ eventId, onUploadSuccess }: GuestListUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [weddingEventId, setWeddingEventId] = useState<string | null>(null);

  // Fetch the Wedding event ID when the component mounts
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

  const validateHeaders = (headers: string[]): boolean => {
    const requiredHeaders = ['first_name', 'last_name'];
    const validHeaders = ['first_name', 'last_name', 'email', 'dietary_restrictions'];
    
    // Check if all required headers are present
    if (!requiredHeaders.every(h => headers.includes(h))) {
      toast.error("CSV must include first_name and last_name columns");
      return false;
    }
    
    // Check if all headers are valid
    if (!headers.every(h => validHeaders.includes(h))) {
      toast.error(`Invalid columns found. Valid columns are: ${validHeaders.join(', ')}`);
      return false;
    }
    
    return true;
  };

  const generateInvitationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

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
        
        if (!validateHeaders(headers)) {
          setUploading(false);
          return;
        }

        const guests = rows.slice(1)
          .filter(row => row.length === headers.length && row.some(cell => cell.trim()))
          .map(row => {
            const guest: Record<string, string> = {};
            row.forEach((value, index) => {
              guest[headers[index]] = value.trim();
            });
            return guest;
          });

        if (guests.length === 0) {
          toast.error("No valid guest data found in CSV");
          setUploading(false);
          return;
        }

        let successCount = 0;
        let errorCount = 0;

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
        event.target.value = '';
        onUploadSuccess?.();
      } catch (error: any) {
        console.error("Error uploading guest list:", error);
        toast.error("Error uploading guest list: " + error.message);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading CSV file");
      setUploading(false);
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
        disabled={uploading}
      />
      <Button variant="outline" disabled={uploading}>
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </Button>
    </div>
  );
};
