
import { useState } from "react";
import { useFetchHouseholdGuests } from "./rsvp/useFetchHouseholdGuests";
import { useRsvpActions } from "./rsvp/useRsvpActions";
import { useMessageSubmission } from "./rsvp/useMessageSubmission";
import { useRsvpSubmission } from "./rsvp/useRsvpSubmission";

export const useHouseholdRsvp = (householdId: string) => {
  const {
    guests,
    loading,
    responses,
    setResponses,
    guestDetails,
    setGuestDetails
  } = useFetchHouseholdGuests(householdId);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    handleRsvpChange,
    handleGuestDetailChange
  } = useRsvpActions({
    responses,
    setResponses,
    guestDetails,
    setGuestDetails,
    guests
  });

  const { handleSubmitMessage } = useMessageSubmission({
    message,
    setMessage,
    guests,
    responses,
    setIsSubmitting,
    setHasChanges
  });

  const { handleSubmitRsvp } = useRsvpSubmission({
    guestDetails,
    setIsSubmitting,
    setHasChanges
  });

  return {
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
  };
};
