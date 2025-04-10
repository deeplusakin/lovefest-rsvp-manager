
export type RsvpStatus = "invited" | "attending" | "declined" | "not_invited";

export interface AvailableEvent {
  id: string;
  name: string;
}

export interface AddEventFormProps {
  guestId: string;
  onCancel: () => void;
  onSuccess: () => void;
}
