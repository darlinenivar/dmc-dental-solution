const KEY = "dmc_invoices_v2";
const COUNTER_KEY = "dmc_invoice_counter_v1";

export function loadInvoices() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveInvoices(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function iid() {
  return crypto?.randomUUID?.() ?? String(Date.now());
}

export function money(n) {
  const x = Number(n || 0);
  return Number.isFinite(x) ? x : 0;
}

export function nextInvoiceNumber() {
  const raw = localStorage.getItem(COUNTER_KEY);
  const current = raw ? Number(raw) : 0;
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return formatInvoiceNumber(next);
}

export function formatInvoiceNumber(n) {
  const num = Number(n || 0);
  const padded = String(num).padStart(4, "0");
  return `INV-${padded}`;
}
