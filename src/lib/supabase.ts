import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

try {
    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
} catch (e) {
    console.warn('Supabase client failed to initialize:', e);
}

export { supabase };
