// src/lib/patientsStore.js
const KEY = "dmc_patients_v1";

export function loadPatients() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function savePatients(patients) {
  localStorage.setItem(KEY, JSON.stringify(patients || []));
}

export function upsertPatient(patient) {
  const patients = loadPatients();
  const idx = patients.findIndex((p) => p.id === patient.id);
  const next = idx >= 0 ? patients.map((p, i) => (i === idx ? patient : p)) : [patient, ...patients];
  savePatients(next);
  return next;
}

export function getPatientById(id) {
  const patients = loadPatients();
  return patients.find((p) => p.id === id) || null;
}

export function deletePatient(id) {
  const patients = loadPatients();
  const next = patients.filter((p) => p.id !== id);
  savePatients(next);
  return next;
}

export function createPatient(data) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(), // NO se muestra al usuario (solo interno)
    createdAt: now,
    updatedAt: now,
    nombre: data.nombre?.trim() || "",
    apellido: data.apellido?.trim() || "",
    fechaNacimiento: data.fechaNacimiento || "",
    genero: data.genero || "",
    contacto: data.contacto?.trim() || "",
    contactoEmergencia: data.contactoEmergencia?.trim() || "",
    alergias: data.alergias?.trim() || "",
    email: data.email?.trim() || "",
    nota: data.nota?.trim() || "",
  };
}

export function formatPatientName(p) {
  const n = (p?.nombre || "").trim();
  const a = (p?.apellido || "").trim();
  return `${n} ${a}`.trim() || "Paciente";
}

export function initials(p) {
  const n = (p?.nombre || "").trim();
  const a = (p?.apellido || "").trim();
  const i1 = n ? n[0].toUpperCase() : "P";
  const i2 = a ? a[0].toUpperCase() : "X";
  return `${i1}${i2}`;
}
