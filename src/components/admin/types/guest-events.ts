
export type RsvpStatus = "not_invited" | "invited" | "attending" | "declined";

export interface AvailableEvent {
  id: string;
  name: string;
}

export interface AddEventFormProps {
  guestId: string;
  onCancel: () => void;
  onSuccess: () => void;
}
