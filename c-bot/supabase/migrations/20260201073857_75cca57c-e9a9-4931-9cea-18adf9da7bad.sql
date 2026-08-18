-- Prevent any role modifications via UPDATE
CREATE POLICY "Prevent role modification"
ON public.user_roles FOR UPDATE
USING (false);