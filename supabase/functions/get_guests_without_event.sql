
-- Function to get all guests who don't have a record for a specific event
CREATE OR REPLACE FUNCTION public.get_guests_without_event(event_id_param UUID)
RETURNS TABLE(guest_id UUID) AS $$
BEGIN
  RETURN QUERY
    SELECT g.id AS guest_id
    FROM guests g
    WHERE NOT EXISTS (
      SELECT 1
      FROM guest_events ge
      WHERE ge.guest_id = g.id
      AND ge.event_id = event_id_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
