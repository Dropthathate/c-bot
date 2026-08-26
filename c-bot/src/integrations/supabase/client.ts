import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const configuredPublishableKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_PUBLISHABLE_KEY = configuredPublishableKey && configuredPublishableKey !== 'your_anon_key' ? configuredPublishableKey : undefined;
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
export const supabaseConfigurationMessage = 'Account sign-in is unavailable while this beta deployment is missing its identity configuration.';

const unavailableError = { message: supabaseConfigurationMessage, name: 'ConfigurationUnavailableError' };

// A thenable query builder keeps optional or protected routes from crashing in a public beta deployment.
// It always returns a configuration error and never makes a request to a placeholder vendor endpoint.
const unavailableQuery: Record<string | symbol, unknown> = new Proxy({}, {
  get: (_target, property) => {
    if (property === 'then') {
      return (resolve: (value: { data: null; error: typeof unavailableError }) => void) => resolve({ data: null, error: unavailableError });
    }
    return () => unavailableQuery;
  },
});

const unavailableClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: unavailableError }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: unavailableError }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
  },
  from: () => unavailableQuery,
} as unknown as ReturnType<typeof createClient<Database>>;

const configuredClient = isSupabaseConfigured
  ? createClient<Database>(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : unavailableClient;

// Import this client normally. Missing public config keeps the landing page available and disables account routes safely.
export const supabase = configuredClient;
