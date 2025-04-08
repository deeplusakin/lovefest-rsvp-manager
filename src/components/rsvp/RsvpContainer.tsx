
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HouseholdRsvp } from "@/components/HouseholdRsvp";
import { RsvpForm } from "./RsvpForm";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

export const RsvpContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [householdId, setHouseholdId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    setIsSubmitted(false);
  };

  const handleSubmitRsvp = () => {
    setIsSubmitting(true);
    
    // Simulate submission completion
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Your RSVP has been successfully submitted. Thank you!");
      
      // Don't redirect after submission so they can update if needed
    }, 1500);
  };

  const handleUpdateRsvp = () => {
    // Allow users to update their RSVP by going back to the invitation code form
    setHouseholdId(null);
    setIsSubmitted(false);
  };

  if (householdId) {
    return (
      <section className="py-12 bg-white">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-serif mb-8 text-center">RSVP for Your Household</h2>
          <p className="text-gray-600 mb-8 text-center">
            Please indicate whether each member of your household will be attending the events.
          </p>
          
          <HouseholdRsvp 
            householdId={householdId} 
          />
          
          {!isSubmitted ? (
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={handleSubmitRsvp} 
                disabled={isSubmitting}
                size="lg"
                className="flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                {!isSubmitting && <Check className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center space-y-4">
              <div className="text-center bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center mb-2">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">Your RSVP has been submitted successfully</span>
                </div>
                <p className="text-green-600">Thank you for your response!</p>
              </div>
              <Button 
                onClick={handleUpdateRsvp} 
                variant="outline"
                className="flex items-center gap-2"
              >
                Update RSVP
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  return <RsvpForm onHouseholdFound={onHouseholdFound} />;
};
