
-- Update all guest_events to use the correct event ID
UPDATE guest_events 
SET event_id = '65cf2379-2a1b-4dbe-8436-1f4d8da2cc0a'
WHERE event_id IS NOT NULL;

-- Verify the update worked
SELECT ge.*, e.name as event_name 
FROM guest_events ge 
LEFT JOIN events e ON ge.event_id = e.id
LIMIT 5;
