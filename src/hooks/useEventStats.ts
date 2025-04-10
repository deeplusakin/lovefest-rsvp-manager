
import { Event } from "@/types/admin";

export const useEventStats = () => {
  const getEventStats = (event: Event) => {
    const totalInvited = event.guest_events?.length || 0;
    const responded = event.guest_events?.filter(ge => ge.status !== 'invited').length || 0;
    const attending = event.guest_events?.filter(ge => ge.status === 'attending').length || 0;
    const notAttending = event.guest_events?.filter(ge => ge.status === 'declined').length || 0;

    return {
      totalInvited,
      responded,
      attending,
      notAttending
    };
  };

  return { getEventStats };
};
