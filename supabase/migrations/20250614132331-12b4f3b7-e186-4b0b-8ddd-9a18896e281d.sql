
-- Update the event date to match what's actually in the database
UPDATE events 
SET date = '2025-08-30T21:00:00+00:00'
WHERE name = 'Wedding Ceremony';

-- Also make sure the event ID matches what's being referenced in guest_events
-- Let's check what event_ids exist in guest_events and update accordingly
DO $$
DECLARE
    existing_event_id UUID;
BEGIN
    -- Get the first event_id from guest_events
    SELECT DISTINCT event_id INTO existing_event_id 
    FROM guest_events 
    LIMIT 1;
    
    -- If we found an event_id, update our event to use that ID
    IF existing_event_id IS NOT NULL THEN
        UPDATE events 
        SET id = existing_event_id
        WHERE name = 'Wedding Ceremony';
    END IF;
END $$;
