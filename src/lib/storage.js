// src/lib/storage.js

// ====== Keys (mantengo tus nombres que ya usa migrateToSupabase) ======
const KEYS = {
  patients: "dmc_patients_v1",
  appointments: "dmc_appointments_v1",
  invoices: "dmc_invoices_v4",
  quotes: "dmc_quotes_v4",
  odontogramsByPatient: "dmc_odontograms_v2", // { [patientId]: odontograms[] }
  clinic: "dmc_clinic_v1",
};

// ====== Helpers ======
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(prefix = "") {
  // UUID simple compatible
  const s = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return prefix ? `${prefix}_${s}` : s;
}

// ===== PATIENTS =====
export function loadPatients() {
  return read(KEYS.patients, []);
}

export function savePatients(patients) {
  write(KEYS.patients, Array.isArray(patients) ? patients : []);
}

// ===== APPOINTMENTS =====
export function loadAppointments() {
  return read(KEYS.appointments, []);
}

export function saveAppointments(appts) {
  write(KEYS.appointments, Array.isArray(appts) ? appts : []);
}

// ===== CLINIC =====
export function loadClinic() {
  return read(KEYS.clinic, {
    name: "",
    phone: "",
    email: "",
    address: "",
    logoDataUrl: "",
    stampDataUrl: "",
  });
}

export function saveClinic(clinic) {
  write(KEYS.clinic, clinic || {});
}

// ===== ODONTOGRAMS =====
export function loadOdontogramsByPatient() {
  return read(KEYS.odontogramsByPatient, {});
}

export function saveOdontogramsByPatient(map) {
  write(KEYS.odontogramsByPatient, map || {});
}

export function getPatientOdontograms(patientId) {
  const map = loadOdontogramsByPatient();
  return map?.[patientId] || [];
}

export function createOdontogramForPatient(patientId, odontogram) {
  const map = loadOdontogramsByPatient();
  const list = map[patientId] || [];
  const o = {
    id: odontogram?.id || uid("odg"),
    createdAt: odontogram?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...odontogram,
  };
  list.push(o);
  map[patientId] = list;
  saveOdontogramsByPatient(map);
  return o;
}

export function updateOdontogram(patientId, updated) {
  const map = loadOdontogramsByPatient();
  const list = map[patientId] || [];
  const next = list.map((o) =>
    o.id === updated.id ? { ...o, ...updated, updatedAt: new Date().toISOString() } : o
  );
  map[patientId] = next;
  saveOdontogramsByPatient(map);
  return true;
}

export function deleteOdontogram(patientId, odontogramId) {
  const map = loadOdontogramsByPatient();
  const list = map[patientId] || [];
  map[patientId] = list.filter((o) => o.id !== odontogramId);
  saveOdontogramsByPatient(map);
  return true;
}
