
-- Enable RLS on tables that don't have it yet
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public access to events (so guests can see event details)
CREATE POLICY "Events are publicly readable" 
  ON public.events 
  FOR SELECT 
  TO public 
  USING (true);

-- Allow public access to households by invitation code (for RSVP lookup)
CREATE POLICY "Households are accessible by invitation code" 
  ON public.households 
  FOR SELECT 
  TO public 
  USING (true);

-- Allow public access to guests (for RSVP functionality)
CREATE POLICY "Guests are publicly readable" 
  ON public.guests 
  FOR SELECT 
  TO public 
  USING (true);

-- Allow public access to guest_events (for RSVP functionality)
CREATE POLICY "Guest events are publicly readable" 
  ON public.guest_events 
  FOR SELECT 
  TO public 
  USING (true);

-- Allow public updates to guest_events (for RSVP responses)
CREATE POLICY "Guest events can be updated publicly" 
  ON public.guest_events 
  FOR UPDATE 
  TO public 
  USING (true);

-- Allow public updates to guests (for updating contact details during RSVP)
CREATE POLICY "Guests can be updated publicly" 
  ON public.guests 
  FOR UPDATE 
  TO public 
  USING (true);

-- Allow public insert to guests (for admin guest management)
CREATE POLICY "Guests can be inserted publicly" 
  ON public.guests 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Allow public insert to guest_events (for admin guest management)
CREATE POLICY "Guest events can be inserted publicly" 
  ON public.guest_events 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Allow public insert to households (for admin household management)
CREATE POLICY "Households can be inserted publicly" 
  ON public.households 
  FOR INSERT 
  TO public 
  WITH CHECK (true);
