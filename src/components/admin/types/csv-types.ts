
export interface GuestData {
  first_name: string;
  last_name: string;
  email?: string;
  dietary_restrictions?: string;
}

export interface GuestListUploadProps {
  eventId: string;
  onUploadSuccess?: () => void;
}
