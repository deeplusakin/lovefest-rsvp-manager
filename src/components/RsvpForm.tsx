
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
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">RSVP Period Has Ended</h3>
            <p className="text-gray-300 mb-6">
              Thank you for your interest in RSVPing to our wedding celebration. 
              The RSVP period has now closed and we are no longer accepting responses.
            </p>
            <p className="text-gray-300">
              If you have any urgent questions or concerns, please contact us directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
