
-- Check if the events table has any data
SELECT * FROM events;

-- If empty, create the missing event that guest_events is referencing
INSERT INTO events (id, name, date, location, description) 
VALUES ('65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a', 'Wedding Ceremony', '2025-08-30T21:00:00+00:00', 'Beautiful Garden Venue', 'The main wedding ceremony')
ON CONFLICT (id) DO NOTHING;

-- Verify the event now exists
SELECT * FROM events WHERE id = '65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a';
