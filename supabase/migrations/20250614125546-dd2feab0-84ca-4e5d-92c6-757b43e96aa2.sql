
-- Add RLS policies to allow guests to view their household members via invitation code
CREATE POLICY "Users can view guests in their household via invitation code" ON public.guests
  FOR SELECT USING (
    household_id IN (
      SELECT h.id FROM public.households h
      WHERE h.invitation_code IN (
        SELECT unnest(string_to_array(current_setting('request.jwt.claims', true)::json->>'invitation_codes', ','))
      )
    )
  );

-- Also ensure guest_events can be accessed for the same household
CREATE POLICY "Users can view guest events for their household via invitation code" ON public.guest_events
  FOR SELECT USING (
    guest_id IN (
      SELECT g.id FROM public.guests g
      JOIN public.households h ON g.household_id = h.id
      WHERE h.invitation_code IN (
        SELECT unnest(string_to_array(current_setting('request.jwt.claims', true)::json->>'invitation_codes', ','))
      )
    )
  );
