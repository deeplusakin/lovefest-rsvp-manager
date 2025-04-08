
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HouseholdRsvp } from "@/components/HouseholdRsvp";
import { RsvpForm } from "./RsvpForm";

export const RsvpContainer = () => {
  const [searchParams] = useSearchParams();
  const [householdId, setHouseholdId] = useState<string | null>(null);

  // Handle QR code scans
  useEffect(() => {
    const codeFromQR = searchParams.get("code");
    if (codeFromQR) {
      handleCodeSubmit(codeFromQR);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCodeSubmit = (code: string) => {
    // We'll validate and get the household in the RsvpForm component
    // This component just needs to know IF we have a valid household
    setHouseholdId(null);
  };

  const onHouseholdFound = (id: string) => {
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

  return <RsvpForm onHouseholdFound={onHouseholdFound} />;
};
