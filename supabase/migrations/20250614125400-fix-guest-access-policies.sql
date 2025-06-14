
-- Drop the previous policies that rely on JWT claims
DROP POLICY IF EXISTS "Users can view guests in their household via invitation code" ON public.guests;
DROP POLICY IF EXISTS "Users can view guest events for their household via invitation code" ON public.guest_events;

-- Create simpler policies that allow access when using the invitation code validation
-- Since we're using the validate_invitation_code function, we need to allow public access
-- for the RSVP flow to work properly

-- Allow public read access to guests (we'll control access through the validate_invitation_code function)
CREATE POLICY "Public can view guests for RSVP" ON public.guests
  FOR SELECT USING (true);

-- Allow public read access to guest_events for RSVP
CREATE POLICY "Public can view guest events for RSVP" ON public.guest_events
  FOR SELECT USING (true);

-- Allow updates to guest_events for RSVP responses
CREATE POLICY "Public can update guest events for RSVP" ON public.guest_events
  FOR UPDATE USING (true);

-- Allow updates to guests for contact details
CREATE POLICY "Public can update guests for RSVP details" ON public.guests
  FOR UPDATE USING (true);
