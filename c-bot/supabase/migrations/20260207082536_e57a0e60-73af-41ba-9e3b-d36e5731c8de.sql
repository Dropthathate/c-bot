-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view mobilization techniques" ON public.mobilization_techniques;

-- Create new policy enforcing subscription tier access
-- Active Recovery ($19/mo) and Pro ($49/mo) users can view techniques
CREATE POLICY "Paid users can view mobilization techniques"
ON public.mobilization_techniques FOR SELECT
TO authenticated
USING (
  public.get_subscription_tier(auth.uid()) IN ('active_recovery', 'pro')
);