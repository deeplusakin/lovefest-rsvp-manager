
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HouseholdRsvp } from "./HouseholdRsvp";

export const RsvpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [householdId, setHouseholdId] = useState<string | null>(null);

  // Handle QR code scans
  useEffect(() => {
    const codeFromQR = searchParams.get("code");
    if (codeFromQR) {
      setCode(codeFromQR);
      handleLogin(codeFromQR);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (invitationCode: string) => {
    setIsLoading(true);

    try {
      // Find the household with the given invitation code
      const { data: householdData, error: householdError } = await supabase
        .from("households")
        .select("id")
        .eq("invitation_code", invitationCode)
        .single();

      if (householdError || !householdData) {
        throw new Error("Invalid invitation code");
      }

      setHouseholdId(householdData.id);
      toast.success("Welcome! You can now RSVP for your household.");

    } catch (error: any) {
      toast.error(error.message);
      setHouseholdId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(code);
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
    <section className="py-24 bg-primary text-white">
      <div className="container max-w-md text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-8">RSVP</h2>
        <p className="text-gray-300 mb-8">
          Please enter your unique code or scan your QR code to RSVP for our wedding celebration.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Invitation Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Enter your code"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white text-primary hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </div>
    </section>
  );
};
