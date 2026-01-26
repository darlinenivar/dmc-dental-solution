import { supabase } from "./supabaseClient";

// Login
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Sesión actual
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Saber si ya existe al menos 1 usuario (para bloquear register luego)
export async function hasAnyUser() {
  // Si tienes RLS, esto a veces no se puede desde anon.
  // Solución simple: permitir register siempre o controlarlo desde el dashboard.
  // Aquí lo dejamos como "false" si falla.
  try {
    const { count, error } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (error) throw error;
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

// Registro
export async function registerUser({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) throw error;
  return data;
}

// Forgot password (manda email)
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback`,
  });
  if (error) throw error;
}

// Cambiar password (cuando vuelve del email)
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}
