
-- First, let's see what's currently in the events table
SELECT * FROM events;

-- Check what event_ids exist in guest_events
SELECT DISTINCT event_id FROM guest_events;

-- Check the actual guest_events data
SELECT ge.guest_id, ge.event_id, ge.status, g.first_name, g.last_name
FROM guest_events ge
JOIN guests g ON ge.guest_id = g.id
LIMIT 10;

-- If the events table is empty, let's create the event again
INSERT INTO events (id, name, date, location, description) 
VALUES ('65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a', 'Wedding Ceremony', '2025-08-30T21:00:00+00:00', 'Beautiful Garden Venue', 'The main wedding ceremony')
ON CONFLICT (id) DO NOTHING;

-- Verify we now have the event and it matches guest_events
SELECT e.*, 
       (SELECT COUNT(*) FROM guest_events WHERE event_id = e.id) as guest_count
FROM events e 
WHERE e.id = '65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a';
