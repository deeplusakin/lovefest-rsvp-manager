
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface GuestSubmitSectionProps {
  guestCount: number;
  onSubmit: () => void;
  isUploading: boolean;
}

export const GuestSubmitSection = ({ 
  guestCount, 
  onSubmit, 
  isUploading 
}: GuestSubmitSectionProps) => {
  if (guestCount === 0) return null;
  
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2">
        {guestCount} guests ready to be uploaded
      </p>
      <Button 
        onClick={onSubmit} 
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        {isUploading ? 'Uploading...' : 'Submit Guest List'}
        {!isUploading && <Check className="h-4 w-4" />}
      </Button>
    </div>
  );
};
