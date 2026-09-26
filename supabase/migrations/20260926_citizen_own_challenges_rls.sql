-- =========================================================================
-- JH Innovation Connect / SIH 2026
-- Migration: Ensure citizens can always read their OWN submitted challenges
-- =========================================================================

-- Citizen: can always read their own submissions (any status)
DROP POLICY IF EXISTS `Citizens can view own challenges` ON public.challenges;
CREATE POLICY `Citizens can view own challenges`
ON public.challenges FOR SELECT
TO authenticated
USING (
  auth.uid() = submitted_by
);
