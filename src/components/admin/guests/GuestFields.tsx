
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  dietaryRestrictions: string;
  onChange: (field: string, value: string) => void;
}

export const GuestFields = ({
  firstName,
  lastName,
  email,
  dietaryRestrictions,
  onChange
}: GuestFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            required
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            required
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Email (optional)</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div>
        <Label>Dietary Restrictions (optional)</Label>
        <Input
          value={dietaryRestrictions}
          onChange={(e) => onChange("dietaryRestrictions", e.target.value)}
        />
      </div>
    </>
  );
};
