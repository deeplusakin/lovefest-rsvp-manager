
-- Update the validate_invitation_code function to include SECURITY DEFINER
-- This allows the function to bypass RLS policies and access the households table
CREATE OR REPLACE FUNCTION public.validate_invitation_code(code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  household_id UUID;
BEGIN
  SELECT id INTO household_id
  FROM public.households
  WHERE invitation_code = code;
  
  RETURN household_id;
END;
$$;
