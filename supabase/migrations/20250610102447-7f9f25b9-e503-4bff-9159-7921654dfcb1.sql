
-- Fix the contributions table RLS policies to allow proper access to existing messages
-- while maintaining security

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view all contributions" ON public.contributions;
DROP POLICY IF EXISTS "Contributors can view own contributions" ON public.contributions;
DROP POLICY IF EXISTS "Anyone can insert contributions" ON public.contributions;

-- Create new policies that work correctly

-- Allow admins full access
CREATE POLICY "Admin can manage all contributions" ON public.contributions
  FOR ALL USING (public.is_current_user_admin());

-- Allow public to view all contributions (for the contribution wall)
CREATE POLICY "Public can view contributions" ON public.contributions
  FOR SELECT USING (true);

-- Allow anyone to insert contributions (for RSVP messages and donations)
CREATE POLICY "Anyone can insert contributions" ON public.contributions
  FOR INSERT WITH CHECK (true);

-- Allow contributors to update their own contributions
CREATE POLICY "Contributors can update own contributions" ON public.contributions
  FOR UPDATE USING (
    guest_id IN (
      SELECT g.id FROM public.guests g
      JOIN public.households h ON g.household_id = h.id
      WHERE h.invitation_code IN (
        SELECT unnest(string_to_array(current_setting('request.jwt.claims', true)::json->>'invitation_codes', ','))
      )
    )
  );
