
import { Session } from '@supabase/supabase-js';

export interface AdminAuthCache {
  isAdmin: boolean;
  userId: string | null;
  session: Session | null;
  lastChecked: number;
}

export interface AdminAuthContextType {
  isAdmin: boolean;
  userId: string | null;
  session: Session | null;
  isCheckingAuth: boolean;
  logout: () => Promise<void>;
}
