
import { useState } from "react";
import { SecureRsvpForm } from "@/components/SecureRsvpForm";
import { HouseholdRsvp } from "@/components/HouseholdRsvp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RsvpFormProps {
  onHouseholdFound?: (householdId: string) => void;
}

export const RsvpForm = ({ onHouseholdFound }: RsvpFormProps) => {
  const [householdId, setHouseholdId] = useState<string | null>(null);

  const handleValidCode = (id: string) => {
    console.log("RsvpForm received valid household ID:", id);
    setHouseholdId(id);
    onHouseholdFound?.(id);
  };

  if (householdId) {
    return <HouseholdRsvp householdId={householdId} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif mb-4">RSVP</h1>
        <p className="text-lg text-muted-foreground">
          We're excited to celebrate with you! Please enter your invitation code to RSVP.
        </p>
      </div>
      
      <SecureRsvpForm onValidCode={handleValidCode} />
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            If you're having trouble finding your invitation code or accessing the RSVP form, please contact us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your invitation code can be found on your wedding invitation or in the invitation email we sent you.
            If you still can't find it, please reach out to us and we'll help you get access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
