/**
 * cleanup_seed_data.mjs — run from the project root:
 *   node cleanup_seed_data.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gtoyomeqnxcnfxaeydaw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_X9lzVh3FWwVNQv4ixDstqg_Zg5F_CwG';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function count(table) {
  const { count: c } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return c ?? 0;
}

async function deleteAll(table) {
  // Use a filter that matches all rows (id != impossible UUID)
  const { error, count: c } = await supabase
    .from(table)
    .delete({ count: 'exact' })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    console.error(`  ✗ ${table}: ${error.message}`);
  } else {
    console.log(`  ✓ ${table}: deleted ${c ?? '?'} rows`);
  }
}

const tables = [
  'notifications',
  'challenge_media',
  'challenge_tags',
  'challenge_timeline',
  'ai_classifications',
  'challenges',
  'messages',
  'conversations',
];

console.log('\n=== JH Innovation Connect — Seed Data Cleanup ===\n');
console.log('--- Before ---');
for (const t of tables) console.log(`  ${t}: ${await count(t)}`);

console.log('\n--- Deleting (child tables first) ---');
for (const t of tables) await deleteAll(t);

console.log('\n--- After ---');
for (const t of tables) console.log(`  ${t}: ${await count(t)}`);

const profileCount = await count('profiles');
console.log(`\n  profiles (demo accounts): ${profileCount} — PRESERVED ✓`);
console.log('\n=== Done ===\n');
