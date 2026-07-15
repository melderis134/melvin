import { createClient } from '@supabase/supabase-js';

// Cliente para Server Components / Server Actions / Route Handlers.
// Usa la service role key: nunca se debe importar desde un componente cliente.
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
