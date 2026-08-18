-- Add length constraints to SOAP note text fields
ALTER TABLE public.soap_notes
  ADD CONSTRAINT soap_notes_subjective_length CHECK (subjective IS NULL OR char_length(subjective) <= 5000),
  ADD CONSTRAINT soap_notes_objective_length CHECK (objective IS NULL OR char_length(objective) <= 5000),
  ADD CONSTRAINT soap_notes_assessment_length CHECK (assessment IS NULL OR char_length(assessment) <= 5000),
  ADD CONSTRAINT soap_notes_plan_length CHECK (plan IS NULL OR char_length(plan) <= 5000),
  ADD CONSTRAINT soap_notes_client_name_length CHECK (char_length(client_name) >= 1 AND char_length(client_name) <= 255);

-- Tighten RLS policies to require therapist role on UPDATE/DELETE
ALTER POLICY "Therapists can update their own SOAP notes"
  ON public.soap_notes
  USING ((auth.uid() = therapist_id) AND has_role(auth.uid(), 'therapist'::app_role));

ALTER POLICY "Therapists can delete their own SOAP notes"
  ON public.soap_notes
  USING ((auth.uid() = therapist_id) AND has_role(auth.uid(), 'therapist'::app_role));
