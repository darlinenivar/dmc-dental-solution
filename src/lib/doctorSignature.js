// src/lib/doctorSignature.js
import { supabase } from "./supabaseClient";

const LS_KEY = "doctor_signature";

export async function getSessionUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user?.id || null;
}

export async function loadDoctorSignature() {
  // 1) intenta Supabase
  const userId = await getSessionUserId();
  if (userId) {
    const { data, error } = await supabase
      .from("doctor_profiles")
      .select("signature_data_url")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data?.signature_data_url) {
      // también guardo cache local por seguridad
      localStorage.setItem(LS_KEY, data.signature_data_url);
      return data.signature_data_url;
    }
  }

  // 2) fallback local
  return localStorage.getItem(LS_KEY) || null;
}

export async function saveDoctorSignature(dataUrl) {
  // 1) guarda local (siempre)
  localStorage.setItem(LS_KEY, dataUrl);

  // 2) guarda en Supabase si hay sesión
  const userId = await getSessionUserId();
  if (!userId) return { ok: true, where: "local" };

  const { error } = await supabase
    .from("doctor_profiles")
    .upsert(
      { user_id: userId, signature_data_url: dataUrl, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  if (error) return { ok: false, error };
  return { ok: true, where: "supabase" };
}

export async function clearDoctorSignature() {
  localStorage.removeItem(LS_KEY);

  const userId = await getSessionUserId();
  if (!userId) return { ok: true, where: "local" };

  const { error } = await supabase
    .from("doctor_profiles")
    .update({ signature_data_url: null, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) return { ok: false, error };
  return { ok: true, where: "supabase" };
}
