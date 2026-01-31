// src/lib/authSupabase.js
import { supabase } from "../supabaseClient";

/**
 * Devuelve el usuario actual (o null)
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user ?? null;
}

/**
 * Trae las clínicas asociadas al usuario actual.
 * - Primero intenta por owner_id
 * - Si tu DB usa otra estructura, lo ajustamos después.
 */
export async function getMyClinics() {
  const user = await getUser();
  if (!user) return [];

  // Ajusta el nombre de la tabla si es diferente en tu Supabase
  // (por ejemplo: "clinics", "clinic", "my_clinics", etc.)
  const { data, error } = await supabase
    .from("clinics")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getMyClinics error:", error);
    return [];
  }

  return data ?? [];
}

/**
 * Login
 */
export async function signInWithPassword(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Logout
 */
export async function signOut() {
  return supabase.auth.signOut();
}
