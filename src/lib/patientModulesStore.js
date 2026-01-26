// src/lib/patientModulesStore.js
const KEY = "dmc_patient_modules_v1";

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

function saveAll(all) {
  localStorage.setItem(KEY, JSON.stringify(all || {}));
}

export function getModules(patientId) {
  const all = loadAll();
  return all[patientId] || {};
}

export function setModules(patientId, modules) {
  const all = loadAll();
  all[patientId] = modules || {};
  saveAll(all);
  return all[patientId];
}

export function updateModule(patientId, key, value) {
  const all = loadAll();
  const current = all[patientId] || {};
  all[patientId] = { ...current, [key]: value };
  saveAll(all);
  return all[patientId];
}
