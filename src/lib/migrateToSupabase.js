// src/lib/migrateToSupabase.js
import {
  sb_upsertPatients,
  sb_upsertAppointments,
  sb_insertInvoiceFull,
  sb_insertQuoteFull,
  sb_insertOdontogram,
} from "./dbSupabase";

import { setStorageMode } from "./storageMode";

// lee JSON local
function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export async function migrateAllToSupabase() {
  // 1) Patients
  const patients = readLS("dmc_patients_v1", []);
  await sb_upsertPatients(patients);

  // 2) Appointments
  const appts = readLS("dmc_appointments_v1", []);
  await sb_upsertAppointments(appts);

  // 3) Invoices (v4)
  const invoices = readLS("dmc_invoices_v4", []);
  for (const inv of invoices) {
    await sb_insertInvoiceFull(inv);
  }

  // 4) Quotes (v4)
  const quotes = readLS("dmc_quotes_v4", []);
  for (const q of quotes) {
    await sb_insertQuoteFull(q);
  }

  // 5) Odontograms (v2: { patientId: [ ...odontograms ] })
  const odontogramsByPatient = readLS("dmc_odontograms_v2", {});
  for (const patientId of Object.keys(odontogramsByPatient || {})) {
    const list = odontogramsByPatient[patientId] || [];
    for (const o of list) {
      await sb_insertOdontogram(patientId, o);
    }
  }

  // 6) Cambiar modo a HYBRID primero (seguro)
  setStorageMode("hybrid");
  return true;
}
