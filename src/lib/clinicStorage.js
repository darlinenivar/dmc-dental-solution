// src/lib/clinicStorage.js
// Maneja clinicId activo en localStorage (simple y confiable)

const KEY = "dmc_active_clinic_id";

export function getActiveClinicId() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setActiveClinicId(clinicId) {
  try {
    if (!clinicId) return;
    localStorage.setItem(KEY, String(clinicId));
  } catch {
    // ignore
  }
}

export function clearActiveClinicId() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
