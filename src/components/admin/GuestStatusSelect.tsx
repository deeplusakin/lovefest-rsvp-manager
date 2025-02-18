
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RsvpStatus } from "./types/guest-events";

interface GuestStatusSelectProps {
  status: RsvpStatus;
  onStatusChange: (status: RsvpStatus) => void;
  disabled?: boolean;
}

export const GuestStatusSelect = ({ status, onStatusChange, disabled }: GuestStatusSelectProps) => {
  return (
    <Select
      value={status}
      onValueChange={(value: RsvpStatus) => onStatusChange(value)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
        <SelectItem value="invited">Invited</SelectItem>
        <SelectItem value="attending">Attending</SelectItem>
        <SelectItem value="declined">Declined</SelectItem>
      </SelectContent>
    </Select>
  );
};
