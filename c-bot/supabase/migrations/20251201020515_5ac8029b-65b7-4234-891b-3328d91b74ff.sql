-- First drop the existing constraint that allows multiple roles
ALTER TABLE public.user_roles 
DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;

-- Add unique constraint on user_id alone to enforce single role per user
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Create a function to prevent role escalation
CREATE OR REPLACE FUNCTION public.check_single_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user already has a role
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id) THEN
        RAISE EXCEPTION 'User already has a role assigned. Role escalation is not permitted.';
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to enforce single role assignment
DROP TRIGGER IF EXISTS enforce_single_role ON public.user_roles;
CREATE TRIGGER enforce_single_role
BEFORE INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.check_single_role();