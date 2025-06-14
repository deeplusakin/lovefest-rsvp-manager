
import { useHouseholdRsvp } from "@/hooks/useHouseholdRsvp";
import { GuestRsvpCard } from "./rsvp/GuestRsvpCard";
import { MessageForm } from "./rsvp/MessageForm";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface HouseholdRsvpProps {
  householdId: string;
}

export const HouseholdRsvp = ({ householdId }: HouseholdRsvpProps) => {
  console.log("HouseholdRsvp component rendering with householdId:", householdId);
  
  const {
    guests,
    loading,
    responses,
    message,
    setMessage,
    isSubmitting,
    hasChanges,
    guestDetails,
    handleRsvpChange,
    handleGuestDetailChange,
    handleSubmitMessage,
    handleSubmitRsvp
  } = useHouseholdRsvp(householdId);

  console.log("HouseholdRsvp state:", { guests: guests?.length, loading, responses });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading household members...</span>
      </div>
    );
  }

  if (!guests || guests.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600 mb-4">No household members found.</p>
        <p className="text-sm text-gray-500">
          If this seems incorrect, please contact us for assistance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {guests.map(guest => (
          <GuestRsvpCard 
            key={guest.id}
            guest={guest}
            responses={responses[guest.id] || {}}
            guestDetails={guestDetails[guest.id]}
            onRsvpChange={handleRsvpChange}
            onDetailChange={handleGuestDetailChange}
          />
        ))}
      </div>

      <MessageForm 
        message={message}
        isSubmitting={isSubmitting}
        onMessageChange={setMessage}
        onSubmit={handleSubmitMessage}
      />

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSubmitRsvp} 
          disabled={isSubmitting || !hasChanges}
          size="lg"
          className="flex items-center gap-2"
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
          {!isSubmitting && <Check className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
