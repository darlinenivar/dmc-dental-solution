const KEY = "dmc_odontograms_v2";

/**
 * Estructura:
 * {
 *   [patientId]: [
 *     {
 *       id: string,
 *       name: string,
 *       createdAt: number,
 *       teeth: { [toothNumber]: { estado: string, nota: string } },
 *       treatments: { [toothNumber]: Array<{ id, fecha, tipo, nota, costo? }> }
 *     }
 *   ]
 * }
 */
export function loadOdontograms() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveOdontograms(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function oid() {
  return crypto?.randomUUID?.() ?? String(Date.now());
}

export function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
