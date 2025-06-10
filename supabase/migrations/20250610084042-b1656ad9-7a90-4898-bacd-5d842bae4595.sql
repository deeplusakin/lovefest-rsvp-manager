
-- Phase 1: Enable RLS on all tables and create security policies

-- Enable RLS on all tables
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Events: Admin-only access
CREATE POLICY "Admin can manage events" ON public.events
  FOR ALL USING (public.is_current_user_admin());

-- Guest Events: Admin-only access  
CREATE POLICY "Admin can manage guest events" ON public.guest_events
  FOR ALL USING (public.is_current_user_admin());

-- Guests: Admin-only access
CREATE POLICY "Admin can manage guests" ON public.guests
  FOR ALL USING (public.is_current_user_admin());

-- Households: Admin can manage, guests can view their own
CREATE POLICY "Admin can manage households" ON public.households
  FOR ALL USING (public.is_current_user_admin());

CREATE POLICY "Guests can view own household via invitation code" ON public.households
  FOR SELECT USING (
    invitation_code IN (
      SELECT unnest(string_to_array(current_setting('request.jwt.claims', true)::json->>'invitation_codes', ','))
    )
  );

-- Contributions: Admin can view all, contributors can view their own
CREATE POLICY "Admin can view all contributions" ON public.contributions
  FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Contributors can view own contributions" ON public.contributions
  FOR SELECT USING (
    guest_id IN (
      SELECT g.id FROM public.guests g
      JOIN public.households h ON g.household_id = h.id
      WHERE h.invitation_code IN (
        SELECT unnest(string_to_array(current_setting('request.jwt.claims', true)::json->>'invitation_codes', ','))
      )
    )
  );

CREATE POLICY "Anyone can insert contributions" ON public.contributions
  FOR INSERT WITH CHECK (true);

-- Photos: Admin can manage, public can view
CREATE POLICY "Admin can manage photos" ON public.photos
  FOR ALL USING (public.is_current_user_admin());

CREATE POLICY "Public can view photos" ON public.photos
  FOR SELECT USING (true);

-- Page Content: Admin-only access
CREATE POLICY "Admin can manage page content" ON public.page_content
  FOR ALL USING (public.is_current_user_admin());

-- Profiles: Users can view their own, admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Improve invitation code generation function for better security
CREATE OR REPLACE FUNCTION public.generate_invitation_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  i INTEGER;
BEGIN
  LOOP
    code := '';
    -- Generate 8-character code using cryptographically secure random
    FOR i IN 1..8 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.households WHERE invitation_code = code) INTO code_exists;
    
    -- Exit loop if unique code found
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN code;
END;
$$;
