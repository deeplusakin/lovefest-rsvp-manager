
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CSVFormatErrorProps {
  error: string | null;
}

export const CSVFormatError = ({ error }: CSVFormatErrorProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mt-2">
      <AlertTitle>Error with CSV file</AlertTitle>
      <AlertDescription>
        {error}
        <div className="mt-2 text-sm">
          <p>Required format: CSV file with these columns:</p>
          <p className="font-mono mt-1">first_name,last_name,email,dietary_restrictions</p>
          <p className="mt-1">Where first_name and last_name are required, others are optional.</p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
