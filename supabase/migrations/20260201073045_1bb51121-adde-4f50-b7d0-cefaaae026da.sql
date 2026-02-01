-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view techniques" ON public.mobilization_techniques;

-- Create new policy that only allows authenticated users to view techniques
CREATE POLICY "Authenticated users can view mobilization techniques"
ON public.mobilization_techniques FOR SELECT
TO authenticated
USING (true);