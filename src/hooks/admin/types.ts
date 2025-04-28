
import { Event, Contribution } from "@/types/admin";

export interface AdminDataState {
  events: Event[];
  contributions: Contribution[];
  totalContributions: number;
  isLoading: boolean;
  isError: boolean;
  lastFetchTime: number;
}

export interface AdminDataHookReturn extends AdminDataState {
  fetchData: () => Promise<void>;
  fetchEvents: () => Promise<Event[]>;
  fetchContributions: () => Promise<Contribution[]>;
}
