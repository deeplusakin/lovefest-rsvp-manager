
import { Event, EventStats } from "@/types/admin";

export const getEventStats = (event: Event): EventStats => {
  const totalInvited = event.guest_events.filter(g => g.status !== 'not_invited').length;
  const responded = event.guest_events.filter(g => ['attending', 'declined'].includes(g.status)).length;
  const attending = event.guest_events.filter(g => g.status === 'attending').length;
  const notAttending = event.guest_events.filter(g => g.status === 'declined').length;

  return { totalInvited, responded, attending, notAttending };
};
