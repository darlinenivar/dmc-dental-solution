import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ IMPORTANTE:
// - Si faltan variables, NO creamos el cliente (evita pantalla blanca)
// - Así la app no se rompe en producción
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const supabaseEnvOk = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseEnvDebug = {
  hasUrl: Boolean(supabaseUrl),
  hasKey: Boolean(supabaseAnonKey),
  urlPreview: supabaseUrl ? supabaseUrl.slice(0, 35) + "..." : null,
};
