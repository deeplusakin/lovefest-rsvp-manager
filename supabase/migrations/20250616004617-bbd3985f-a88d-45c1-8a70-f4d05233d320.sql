
-- Drop existing RLS policies that might be conflicting
DROP POLICY IF EXISTS "Guests can be inserted publicly" ON public.guests;
DROP POLICY IF EXISTS "Guest events can be inserted publicly" ON public.guest_events;
DROP POLICY IF EXISTS "Households can be inserted publicly" ON public.households;

-- Create more permissive policies for admin operations
CREATE POLICY "Allow all guest operations" 
  ON public.guests 
  FOR ALL 
  TO public 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all guest_events operations" 
  ON public.guest_events 
  FOR ALL 
  TO public 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all household operations" 
  ON public.households 
  FOR ALL 
  TO public 
  USING (true)
  WITH CHECK (true);
