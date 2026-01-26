const LS_DOCTORS = "dmc.doctors.v1";
const LS_ACTIVE_DOCTOR = "dmc.doctors.active.v1";

export function loadDoctors() {
  try {
    const raw = localStorage.getItem(LS_DOCTORS);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveDoctors(list) {
  localStorage.setItem(LS_DOCTORS, JSON.stringify(list || []));
}

export function setActiveDoctorId(id) {
  localStorage.setItem(LS_ACTIVE_DOCTOR, id || "");
}

export function getActiveDoctorId() {
  return localStorage.getItem(LS_ACTIVE_DOCTOR) || "";
}

export function getActiveDoctor() {
  const docs = loadDoctors();
  const id = getActiveDoctorId();
  return docs.find((d) => d.id === id) || docs[0] || null;
}

export function getActiveSignaturePng() {
  return getActiveDoctor()?.signaturePng || "";
}
