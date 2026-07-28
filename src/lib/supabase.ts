import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isPlaceholderUrl = !supabaseUrl || 
  supabaseUrl.includes('your-project-ref') || 
  supabaseUrl.includes('xyzcompany') || 
  supabaseUrl.includes('placeholder') ||
  supabaseUrl.includes('your-supabase-url') ||
  supabaseUrl.includes('example.com');

const isPlaceholderKey = !supabaseAnonKey || 
  supabaseAnonKey.includes('your-anon-key') || 
  supabaseAnonKey.includes('dummykey') || 
  supabaseAnonKey.includes('your-private-service-role-key') ||
  supabaseAnonKey === 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !isPlaceholderUrl && 
  !isPlaceholderKey
);

// Create browser client
export function createClient() {
  if (!isSupabaseConfigured) {
    // Return dummy client object that will fail gracefully if invoked
    return createSupabaseClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();

