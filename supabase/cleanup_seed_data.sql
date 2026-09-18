-- ============================================================
-- JH Innovation Connect — Seed Data Cleanup
-- Run this in the Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/gtoyomeqnxcnfxaeydaw/sql
--
-- This script ONLY deletes rows from application data tables.
-- It does NOT:
--   - Drop any tables
--   - Delete auth users
--   - Delete profiles rows (demo accounts)
--   - Remove RLS policies
--   - Remove storage buckets
-- ============================================================

-- Step 1: Delete child table rows first (foreign key order)
DELETE FROM public.challenge_media;
DELETE FROM public.challenge_tags;
DELETE FROM public.challenge_timeline;
DELETE FROM public.ai_classifications;

-- Step 2: Delete all challenges (seed/sample data)
DELETE FROM public.challenges;

-- Step 3: Delete notifications
DELETE FROM public.notifications;

-- Step 4: Delete messages and conversations
DELETE FROM public.messages;
DELETE FROM public.conversations;

-- Step 5: Verify results
SELECT 'challenges' AS table_name, COUNT(*) AS remaining FROM public.challenges
UNION ALL SELECT 'challenge_media', COUNT(*) FROM public.challenge_media
UNION ALL SELECT 'challenge_tags', COUNT(*) FROM public.challenge_tags
UNION ALL SELECT 'challenge_timeline', COUNT(*) FROM public.challenge_timeline
UNION ALL SELECT 'ai_classifications', COUNT(*) FROM public.ai_classifications
UNION ALL SELECT 'notifications', COUNT(*) FROM public.notifications
UNION ALL SELECT 'messages', COUNT(*) FROM public.messages
UNION ALL SELECT 'conversations', COUNT(*) FROM public.conversations
UNION ALL SELECT 'profiles (preserved)', COUNT(*) FROM public.profiles;

-- Expected result: all application tables show 0, profiles shows your demo account count
