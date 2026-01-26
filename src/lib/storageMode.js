const MODE_KEY = "dmc_storage_mode_v1"; // "local" | "hybrid" | "supabase"

export function getStorageMode() {
  return localStorage.getItem(MODE_KEY) || "local";
}
export function setStorageMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}
