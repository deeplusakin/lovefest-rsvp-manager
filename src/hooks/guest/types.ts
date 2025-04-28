
import { Guest } from "@/components/admin/types/guest";

export interface GuestCache {
  data: Guest[];
  timestamp: number;
  isLoading: boolean;
  loadPromise: Promise<Guest[]> | null;
}

export interface UseGuestDataReturn {
  guests: Guest[];
  isLoading: boolean;
  isError: boolean;
  fetchGuests: (forceRefresh?: boolean) => Promise<Guest[]>;
  invalidateCache: () => void;
}
