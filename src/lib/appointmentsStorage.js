const KEY = "dmc_appointments_v1";

export function loadAppointments() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAppointments(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}
