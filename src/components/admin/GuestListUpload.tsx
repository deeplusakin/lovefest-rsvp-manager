
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [parsedGuests, setParsedGuests] = useState<GuestData[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

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
      setCsvError("CSV must include first_name and last_name columns");
      return false;
    }
    
    // Check if all headers are valid
    if (!headers.every(h => validHeaders.includes(h))) {
      setCsvError(`Invalid columns found. Valid columns are: ${validHeaders.join(', ')}`);
      return false;
    }
    
    setCsvError(null);
    return true;
  };

  const generateInvitationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCSVFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    
    const file = event.target.files[0];
    setCsvFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0].map(header => header.trim().toLowerCase());
        
        if (!validateHeaders(headers)) {
          setParsedGuests([]);
          return;
        }

        const guests = rows.slice(1)
          .filter(row => row.length === headers.length && row.some(cell => cell.trim()))
          .map(row => {
            const guest: Record<string, string> = {};
            row.forEach((value, index) => {
              guest[headers[index]] = value.trim();
            });
            return guest as GuestData;
          });

        if (guests.length === 0) {
          setCsvError("No valid guest data found in CSV");
          setParsedGuests([]);
          return;
        }

        setParsedGuests(guests);
        setCsvError(null);
      } catch (error: any) {
        console.error("Error parsing CSV file:", error);
        setCsvError("Error parsing CSV file: " + error.message);
        setParsedGuests([]);
      }
    };

    reader.onerror = () => {
      setCsvError("Error reading CSV file");
      setParsedGuests([]);
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (parsedGuests.length === 0) {
      toast.error("No guest data to upload");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const guest of parsedGuests) {
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
      setParsedGuests([]);
      setCsvFile(null);
      if (csvFile) {
        // Clear the file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
      onUploadSuccess?.();
    } catch (error: any) {
      console.error("Error uploading guest list:", error);
      toast.error("Error uploading guest list: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".csv"
          onChange={handleCSVFile}
          className="max-w-xs"
          disabled={uploading}
        />
        <Button 
          variant="outline" 
          disabled={uploading || !csvFile}
          onClick={() => setCsvFile(null)}
        >
          Clear
        </Button>
      </div>
      
      {csvError && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Error with CSV file</AlertTitle>
          <AlertDescription>
            {csvError}
            <div className="mt-2 text-sm">
              <p>Required format: CSV file with these columns:</p>
              <p className="font-mono mt-1">first_name,last_name,email,dietary_restrictions</p>
              <p className="mt-1">Where first_name and last_name are required, others are optional.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {parsedGuests.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            {parsedGuests.length} guests ready to be uploaded
          </p>
          <Button 
            onClick={handleSubmit} 
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? 'Uploading...' : 'Submit Guest List'}
            {!uploading && <Check className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
};
