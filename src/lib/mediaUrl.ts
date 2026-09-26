/**
 * mediaUrl.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Utility that converts any stored media reference into a renderable URL.
 *
 * Supabase Storage can save either:
 *   a) A full https://...supabase.co/storage/v1/object/public/... URL  → use directly
 *   b) A bare storage path like "challenge-id/photos/1234.jpg"          → resolve via getPublicUrl
 *   c) A blob: URL (temporary, only valid in the same browser session)  → treat as broken
 *
 * Both known bucket names are tried in order: "challenge-evidence" first, then "media".
 */

import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gtoyomeqnxcnfxaeydaw.supabase.co';

/** Ordered list of buckets to try when resolving a bare storage path. */
const STORAGE_BUCKETS = ['challenge-evidence', 'media'] as const;

/**
 * Returns true when the value is already a fully-qualified HTTP(S) URL
 * pointing at Supabase Storage (or any other CDN/host).
 */
function isAbsoluteUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('http://');
}

/**
 * Returns true when the value looks like a Supabase Storage path
 * (relative, no scheme, not a blob: URL).
 */
function isStoragePath(value: string): boolean {
  return !isAbsoluteUrl(value) && !value.startsWith('blob:') && value.trim().length > 0;
}

/**
 * Build the public URL for a given bucket + path using the Supabase JS client.
 * The client always returns a URL regardless of whether the bucket is public,
 * but the URL will only load if the bucket actually has public read enabled.
 */
function buildPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Resolve a stored media value (either a full URL or a bare path) into a
 * renderable URL.
 *
 * Rules:
 * 1. Already-absolute Supabase URL → return as-is.
 * 2. blob: URL → return empty string (stale session blob; cannot be recovered).
 * 3. Bare storage path → build public URL for each known bucket in order;
 *    the first non-empty result is returned (we pick "challenge-evidence" first
 *    because that's the primary bucket tried during upload).
 */
export function resolveMediaUrl(storedValue: string | null | undefined): string {
  if (!storedValue || !storedValue.trim()) return '';

  const v = storedValue.trim();

  // Case 1: already a full URL (Supabase Storage or any CDN)
  if (isAbsoluteUrl(v)) {
    // Validate it at least points to the right Supabase project
    // (prevents someone accidentally storing a foreign URL)
    return v;
  }

  // Case 2: blob: URL — these are temporary and die with the browser tab.
  // Nothing we can do; return empty to trigger the onError fallback.
  if (v.startsWith('blob:')) {
    console.warn('[mediaUrl] Stale blob: URL found in database — media was not uploaded correctly:', v);
    return '';
  }

  // Case 3: bare storage path — try each bucket in order
  for (const bucket of STORAGE_BUCKETS) {
    const url = buildPublicUrl(bucket, v);
    if (url && url.startsWith('https://')) {
      return url;
    }
  }

  // Fallback: construct a direct URL manually using the first bucket
  // (getPublicUrl should always work, but just in case)
  const fallback = `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKETS[0]}/${v}`;
  console.warn('[mediaUrl] Could not resolve via SDK, using manual fallback URL:', fallback);
  return fallback;
}

/**
 * Classify a URL as image or video based on its file extension.
 * Returns 'unknown' if the extension is not recognisable.
 */
export function getMediaType(url: string): 'image' | 'video' | 'unknown' {
  const lower = url.toLowerCase().split('?')[0]; // strip query params
  if (/\.(jpg|jpeg|png|webp|gif|avif|heic)$/.test(lower)) return 'image';
  if (/\.(mp4|webm|mov|avi|mkv|ogg)$/.test(lower)) return 'video';
  return 'unknown';
}

