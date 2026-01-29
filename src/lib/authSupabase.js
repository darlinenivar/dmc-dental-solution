import { supabase } from "./supabaseClient";

// ✅ Devuelve true/false (por ahora false hasta que lo conectemos real)
export async function getSuperAdminStatus() {
  try {
    // Aquí luego pondremos la lógica real
    return false;
  } catch (e) {
    console.error("getSuperAdminStatus error:", e);
    return false;
  }
}

// ✅ Devuelve lista de clínicas (por ahora [])
export async function getMyClinics() {
  try {
    // Aquí luego pondremos la lógica real (tabla clinics / user_profiles)
    return [];
  } catch (e) {
    console.error("getMyClinics error:", e);
    return [];
  }
}
