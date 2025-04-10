
import { Guest } from "../types/guest";

export interface HouseholdGroup {
  householdId: string;
  guests: Guest[];
}

export const useGuestGroups = (guests: Guest[]) => {
  // Sort guests alphabetically by last name then first name
  const sortedGuests = [...guests].sort((a, b) => {
    const lastNameComparison = a.last_name.localeCompare(b.last_name);
    if (lastNameComparison !== 0) return lastNameComparison;
    return a.first_name.localeCompare(b.first_name);
  });
  
  // Group guests by household
  const guestsByHousehold: Record<string, Guest[]> = {};
  sortedGuests.forEach((guest) => {
    if (!guestsByHousehold[guest.household_id]) {
      guestsByHousehold[guest.household_id] = [];
    }
    guestsByHousehold[guest.household_id].push(guest);
  });
  
  // Sort households by first guest's last name for consistent ordering
  const sortedHouseholdIds = Object.keys(guestsByHousehold).sort((a, b) => {
    const aGuest = guestsByHousehold[a][0];
    const bGuest = guestsByHousehold[b][0];
    return aGuest.last_name.localeCompare(bGuest.last_name);
  });

  // Get all guests for calculating selection states
  const allGuests = sortedHouseholdIds.flatMap(id => guestsByHousehold[id]);
  
  // Get unique households for bulk selection
  const uniqueHouseholds = sortedHouseholdIds;

  return {
    sortedHouseholdIds,
    guestsByHousehold,
    allGuests,
    uniqueHouseholds
  };
};
