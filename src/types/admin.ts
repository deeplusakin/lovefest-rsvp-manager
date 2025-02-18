
export interface GuestEvent {
  guest: {
    first_name: string;
    last_name: string;
    email: string;
    dietary_restrictions: string | null;
  };
  status: 'not_invited' | 'invited' | 'attending' | 'declined';
  response_date: string | null;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string | null;
  guest_events: GuestEvent[];
}

export interface Contribution {
  id: string;
  amount: number;
  message: string | null;
  created_at: string;
  guests: {
    first_name: string;
    last_name: string;
  };
}

export interface EventFormData {
  name: string;
  date: string;
  location: string;
  description: string;
}

export interface EventStats {
  totalInvited: number;
  responded: number;
  attending: number;
  notAttending: number;
}
