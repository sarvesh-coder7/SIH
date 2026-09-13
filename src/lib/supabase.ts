import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gtoyomeqnxcnfxaeydaw.supabase.co';
const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_X9lzVh3FWwVNQv4ixDstqg_Zg5F_CwG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

