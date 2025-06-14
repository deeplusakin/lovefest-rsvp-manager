
import { Event, EventStats } from "@/types/admin";

export const getEventStats = (event: Event | null): EventStats => {
  if (!event || !event.guest_events) {
    return { totalInvited: 0, responded: 0, attending: 0, notAttending: 0 };
  }
  
  const totalInvited = event.guest_events.filter(g => g.status !== 'not_invited').length;
  const responded = event.guest_events.filter(g => ['attending', 'declined'].includes(g.status)).length;
  const attending = event.guest_events.filter(g => g.status === 'attending').length;
  const notAttending = event.guest_events.filter(g => g.status === 'declined').length;

  return { totalInvited, responded, attending, notAttending };
};
