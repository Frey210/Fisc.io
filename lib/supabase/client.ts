import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Warn in development if env vars are missing
  if (process.env.NODE_ENV === 'development') {
    console.warn('[Fisc.io] Supabase public environment variables missing.');
  }
}

// Client-side / public queries protected by RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
