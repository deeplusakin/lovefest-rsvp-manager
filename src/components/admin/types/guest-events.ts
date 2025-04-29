
export type RsvpStatus = "not_invited" | "invited" | "attending" | "declined" | string;

export interface AvailableEvent {
  id: string;
  name: string;
}

export interface AddEventFormProps {
  guestId: string;
  onCancel: () => void;
  onSuccess: () => void;
}
