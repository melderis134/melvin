'use client';

import { createClient } from '@supabase/supabase-js';

// Cliente para uso en el navegador (anon key). RLS está abierta a nivel de
// tabla porque el acceso ya se protege con el gate de contraseña de la app.
export function createBrowserSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
