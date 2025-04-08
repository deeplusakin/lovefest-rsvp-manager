
import { useHouseholdRsvp } from "@/hooks/useHouseholdRsvp";
import { GuestRsvpCard } from "./rsvp/GuestRsvpCard";
import { MessageForm } from "./rsvp/MessageForm";

interface HouseholdRsvpProps {
  householdId: string;
}

export const HouseholdRsvp = ({ householdId }: HouseholdRsvpProps) => {
  const {
    guests,
    loading,
    responses,
    message,
    setMessage,
    isSubmitting,
    handleRsvpChange,
    handleSubmitMessage
  } = useHouseholdRsvp(householdId);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            onRsvpChange={handleRsvpChange}
          />
        ))}
      </div>

      <MessageForm 
        message={message}
        isSubmitting={isSubmitting}
        onMessageChange={setMessage}
        onSubmit={handleSubmitMessage}
      />
    </div>
  );
};
