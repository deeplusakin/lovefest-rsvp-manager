
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CSVFormatError } from "./components/CSVFormatError";
import { GuestSubmitSection } from "./components/GuestSubmitSection";
import { useGuestUpload } from "./hooks/useGuestUpload";
import { GuestData, GuestListUploadProps } from "./types/csv-types";
import { parseCSV } from "./utils/csv-utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const GuestListUpload = ({ eventId, onUploadSuccess }: GuestListUploadProps) => {
  const [parsedGuests, setParsedGuests] = useState<GuestData[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [preserveRsvps, setPreserveRsvps] = useState(true);
  
  const { uploadGuests, uploading } = useGuestUpload(eventId, onUploadSuccess);

  const handleCSVFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    
    const file = event.target.files[0];
    setCsvFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { guests, error } = parseCSV(text);
      
      setParsedGuests(guests);
      setCsvError(error);
    };

    reader.onerror = () => {
      setCsvError("Error reading CSV file");
      setParsedGuests([]);
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    await uploadGuests(parsedGuests, replaceExisting, preserveRsvps);
    setParsedGuests([]);
    setCsvFile(null);
    
    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
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
          onClick={() => {
            setCsvFile(null);
            setParsedGuests([]);
            setCsvError(null);
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          }}
        >
          Clear
        </Button>
      </div>
      
      <CSVFormatError error={csvError} />
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="replace-mode" 
            checked={replaceExisting} 
            onCheckedChange={setReplaceExisting} 
          />
          <Label htmlFor="replace-mode">Replace all existing guest records</Label>
        </div>
        
        {replaceExisting && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="preserve-rsvps" 
              checked={preserveRsvps} 
              onCheckedChange={setPreserveRsvps} 
            />
            <Label htmlFor="preserve-rsvps">Preserve RSVP responses for existing guests</Label>
          </div>
        )}
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The Guest List is treated as the source of truth. Uploading will sync all guests to the RSVP system.
          </AlertDescription>
        </Alert>
      </div>

      <GuestSubmitSection 
        guestCount={parsedGuests.length} 
        onSubmit={handleSubmit}
        isUploading={uploading}
      />
    </div>
  );
};
