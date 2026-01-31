// src/lib/safeAsync.js
export function isAbortError(err) {
  if (!err) return false;
  const name = err?.name || "";
  const msg = String(err?.message || "");
  return (
    name === "AbortError" ||
    msg.toLowerCase().includes("aborted") ||
    msg.toLowerCase().includes("abort")
  );
}

export function ignoreAbort(err) {
  if (isAbortError(err)) return true;
  return false;
}

/**
 * Wrapper para promesas: evita que AbortError ensucie consola.
 * Si NO es abort, re-lanza el error.
 */
export async function safe(promise) {
  try {
    return await promise;
  } catch (err) {
    if (ignoreAbort(err)) return null;
    throw err;
  }
}
