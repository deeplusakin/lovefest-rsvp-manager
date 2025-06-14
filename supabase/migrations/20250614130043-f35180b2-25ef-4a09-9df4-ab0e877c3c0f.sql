
-- Drop all existing RLS policies on guests and guest_events tables
DROP POLICY IF EXISTS "Admin can manage guests" ON public.guests;
DROP POLICY IF EXISTS "Public can view guests for RSVP" ON public.guests;
DROP POLICY IF EXISTS "Public can update guests for RSVP details" ON public.guests;
DROP POLICY IF EXISTS "Users can view guests in their household via invitation code" ON public.guests;

DROP POLICY IF EXISTS "Admin can manage guest events" ON public.guest_events;
DROP POLICY IF EXISTS "Public can view guest events for RSVP" ON public.guest_events;
DROP POLICY IF EXISTS "Public can update guest events for RSVP" ON public.guest_events;
DROP POLICY IF EXISTS "Users can view guest events for their household via invitation code" ON public.guest_events;

-- Disable RLS on guests and guest_events tables for RSVP functionality
ALTER TABLE public.guests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_events DISABLE ROW LEVEL SECURITY;
