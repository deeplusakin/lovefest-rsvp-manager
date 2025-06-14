
-- First, let's see what's currently in the events table
SELECT * FROM events;

-- If no events exist, create the Wedding Ceremony event
INSERT INTO events (id, name, date, location, description) 
VALUES ('65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a', 'Wedding Ceremony', '2025-08-30T21:00:00+00:00', 'Beautiful Garden Venue', 'The main wedding ceremony')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  date = EXCLUDED.date,
  location = EXCLUDED.location,
  description = EXCLUDED.description;

-- Verify the event was created/updated
SELECT * FROM events WHERE id = '65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a';
