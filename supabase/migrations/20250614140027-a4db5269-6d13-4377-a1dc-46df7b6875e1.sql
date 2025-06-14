
-- First check what's in the events table
SELECT COUNT(*) as event_count FROM events;

-- Force insert the event (this time with a more explicit approach)
DELETE FROM events WHERE id = '65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a';

INSERT INTO events (id, name, date, location, description) 
VALUES ('65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a', 'Wedding Ceremony', '2025-08-30T21:00:00+00:00', 'Beautiful Garden Venue', 'The main wedding ceremony');

-- Verify the event exists and check what guest_events are referencing
SELECT e.*, 
       (SELECT COUNT(*) FROM guest_events WHERE event_id = e.id) as linked_guests
FROM events e 
WHERE e.id = '65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a';

-- Also show all events to confirm
SELECT * FROM events;
