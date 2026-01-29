import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Esto te dará un error CLARO en producción si faltan variables
  throw new Error(
    "Faltan variables de entorno: VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Revisa Netlify > Environment variables y luego redeploy."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
