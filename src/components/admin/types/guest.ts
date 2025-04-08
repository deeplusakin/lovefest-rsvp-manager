
export interface Household {
  id: string;
  name: string;
  invitation_code: string;
  address: string | null;
}

export interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  dietary_restrictions: string | null;
  household: {
    name: string;
    invitation_code: string;
    address: string | null;
  };
  household_id: string;
}
