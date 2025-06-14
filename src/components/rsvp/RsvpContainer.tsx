
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HouseholdRsvp } from "@/components/HouseholdRsvp";
import { SecureRsvpForm } from "@/components/SecureRsvpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const RsvpContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [householdId, setHouseholdId] = useState<string | null>(null);

  // Handle QR code scans
  useEffect(() => {
    const codeFromQR = searchParams.get("code");
    console.log("QR code from URL:", codeFromQR);
    // Don't auto-validate here, let the user see the form first
  }, [searchParams]);

  const handleValidCode = (id: string) => {
    console.log("Valid household ID received:", id);
    setHouseholdId(id);
  };

  if (householdId) {
    return (
      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-center">RSVP for Your Household</h2>
          <p className="text-gray-600 mb-8 text-center">
            Please indicate whether each member of your household will be attending the events.
          </p>
          <HouseholdRsvp householdId={householdId} />
        </div>
      </section>
    );
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
