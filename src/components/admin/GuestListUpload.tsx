
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
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
            const { data: newGuest, error: guestError } = await supabase
              .from('guests')
              .insert({
                first_name: guest.first_name,
                last_name: guest.last_name,
                email: guest.email || null,
                dietary_restrictions: guest.dietary_restrictions || null,
                invitation_code: Math.random().toString(36).substring(2, 8),
                household_id: '00000000-0000-0000-0000-000000000000' // Adding the required household_id field
              })
              .select('id')
              .single();

            if (guestError) throw guestError;

            const { error: rsvpError } = await supabase
              .from('guest_events')
              .upsert({
                guest_id: newGuest.id,
                event_id: eventId,
                status: 'invited'
              });

            if (rsvpError) throw rsvpError;
            successCount++;
          } catch (error) {
            console.error('Error processing guest:', guest, error);
            errorCount++;
          }
        }

        toast.success(`Processed ${successCount} guests successfully${errorCount > 0 ? `. ${errorCount} errors occurred.` : ''}`);
        event.target.value = '';
        onUploadSuccess?.();  // Call the callback after successful upload
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
