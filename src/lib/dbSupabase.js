// src/lib/dbSupabase.js
import { supabase } from "./supabaseClient";

/**
 * Helpers
 */
function noClient() {
  return { ok: false, error: "Supabase client not configured (missing env vars)" };
}

async function safe(promise) {
  try {
    const { data, error } = await promise;
    if (error) return { ok: false, error: error.message, data: null };
    return { ok: true, data, error: null };
  } catch (e) {
    return { ok: false, error: e?.message || String(e), data: null };
  }
}

/**
 * NOTA:
 * Estos nombres de exports deben existir porque migrateToSupabase.js los importa.
 * Aunque aún no tengas tablas creadas, esto evita que tu app se ponga en blanco.
 */

// 1) Patients
export async function sb_upsertPatients(patients = []) {
  if (!supabase) return noClient();
  if (!Array.isArray(patients) || patients.length === 0) return { ok: true, count: 0 };

  // Tabla sugerida: patients
  const res = await safe(
    supabase.from("patients").upsert(patients, { onConflict: "id" }).select("id")
  );
  return { ...res, count: res.ok ? res.data?.length || 0 : 0 };
}

// 2) Appointments
export async function sb_upsertAppointments(appts = []) {
  if (!supabase) return noClient();
  if (!Array.isArray(appts) || appts.length === 0) return { ok: true, count: 0 };

  // Tabla sugerida: appointments
  const res = await safe(
    supabase.from("appointments").upsert(appts, { onConflict: "id" }).select("id")
  );
  return { ...res, count: res.ok ? res.data?.length || 0 : 0 };
}

// 3) Invoices (cabecera + items)
export async function sb_insertInvoiceFull(inv) {
  if (!supabase) return noClient();
  if (!inv) return { ok: true };

  // Tablas sugeridas: invoices, invoice_items
  // Si tu estructura aún no existe, no crashea: devuelve ok:false con error controlado.
  const { items = [], ...header } = inv;

  const head = await safe(supabase.from("invoices").insert(header).select("id").single());
  if (!head.ok) return head;

  if (Array.isArray(items) && items.length > 0) {
    const itemsWithInvoiceId = items.map((it) => ({ ...it, invoice_id: head.data.id }));
    const det = await safe(supabase.from("invoice_items").insert(itemsWithInvoiceId).select("id"));
    if (!det.ok) return det;
  }

  return { ok: true };
}

// 4) Quotes (cabecera + items)
export async function sb_insertQuoteFull(q) {
  if (!supabase) return noClient();
  if (!q) return { ok: true };

  // Tablas sugeridas: quotes, quote_items
  const { items = [], ...header } = q;

  const head = await safe(supabase.from("quotes").insert(header).select("id").single());
  if (!head.ok) return head;

  if (Array.isArray(items) && items.length > 0) {
    const itemsWithQuoteId = items.map((it) => ({ ...it, quote_id: head.data.id }));
    const det = await safe(supabase.from("quote_items").insert(itemsWithQuoteId).select("id"));
    if (!det.ok) return det;
  }

  return { ok: true };
}

// 5) Odontograms
export async function sb_insertOdontogram(patientId, odontogram) {
  if (!supabase) return noClient();
  if (!patientId || !odontogram) return { ok: true };

  // Tabla sugerida: odontograms
  const payload = { ...odontogram, patient_id: patientId };
  const res = await safe(supabase.from("odontograms").insert(payload).select("id"));
  return res;
}
