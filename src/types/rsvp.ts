
export interface GuestEvent {
  event_id: string;
  status: 'not_invited' | 'invited' | 'attending' | 'declined' | string;
  events: {
    name: string;
    date: string;
    location: string;
  };
}

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  dietary_restrictions?: string | null;
  guest_events: GuestEvent[];
}

export interface GuestDetails {
  email?: string | null;
  phone?: string | null;
  dietary_restrictions?: string | null;
}

export interface RsvpResponses {
  [guestId: string]: { [eventId: string]: string };
}

export interface GuestDetailsMap {
  [guestId: string]: GuestDetails;
}
