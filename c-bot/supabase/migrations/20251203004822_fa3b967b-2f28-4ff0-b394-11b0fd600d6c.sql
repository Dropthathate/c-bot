-- Protect subscription_tier from client-side manipulation
CREATE OR REPLACE FUNCTION public.prevent_subscription_tier_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  jwt json;
  jwt_role text;
BEGIN
  -- Only run logic when subscription_tier is actually changing
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    BEGIN
      -- Safely read JWT claims; this may fail for internal calls (no JWT)
      jwt := current_setting('request.jwt.claims', true)::json;
      jwt_role := COALESCE(jwt->>'role', '');
    EXCEPTION WHEN others THEN
      -- If we can't read claims (e.g. internal migration or console), allow
      RETURN NEW;
    END;

    -- Block direct client-side updates (role = 'authenticated')
    -- Allow only service role (e.g. backend payment/webhook processes)
    IF jwt_role IS DISTINCT FROM 'service_role' THEN
      RAISE EXCEPTION 'Direct updates to subscription_tier are not allowed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Ensure a single, well-defined trigger exists
DROP TRIGGER IF EXISTS protect_subscription_tier ON public.profiles;

CREATE TRIGGER protect_subscription_tier
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_subscription_tier_self_update();