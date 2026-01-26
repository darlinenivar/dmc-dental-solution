import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/settings.css";

const LS_ACTIVE_CLINIC = "dmc.activeClinicId.v1";
const LS_PAY_METHODS = "dmc.payMethods.v1";

const DEFAULT_METHODS = [
  { id: "cash", name: "Efectivo", enabled: true },
  { id: "card", name: "Tarjeta", enabled: true },
  { id: "transfer", name: "Transferencia", enabled: true },
  { id: "insurance", name: "Seguro", enabled: true },
];

function loadLocal() {
  try {
    const v = JSON.parse(localStorage.getItem(LS_PAY_METHODS) || "null");
    return Array.isArray(v) && v.length ? v : DEFAULT_METHODS;
  } catch {
    return DEFAULT_METHODS;
  }
}
function saveLocal(methods) {
  localStorage.setItem(LS_PAY_METHODS, JSON.stringify(methods));
}

export default function MetodoPago() {
  const clinicId = localStorage.getItem(LS_ACTIVE_CLINIC) || "";
  const [methods, setMethods] = useState(loadLocal);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => saveLocal(methods), [methods]);
  const enabledCount = useMemo(() => methods.filter((m) => m.enabled).length, [methods]);

  const trySaveSupabase = async (next) => {
    if (!clinicId) return;
    // tabla opcional: payment_methods(clinic_id uuid primary key, methods jsonb, updated_at timestamptz)
    const { error } = await supabase
      .from("payment_methods")
      .upsert({ clinic_id: clinicId, methods: next, updated_at: new Date().toISOString() }, { onConflict: "clinic_id" });
    if (error) throw error;
  };

  const persist = async (next, okMsg) => {
    setMethods(next);
    setBusy(true);
    setMsg("");
    try {
      try {
        await trySaveSupabase(next);
        setMsg(`✅ ${okMsg} (Supabase + local)`);
      } catch {
        setMsg(`✅ ${okMsg} (solo local, Supabase no listo)`);
      }
    } finally {
      setBusy(false);
    }
  };

  const add = async () => {
    const n = name.trim();
    if (!n) return;
    const next = [{ id: crypto.randomUUID?.() || String(Date.now()) + Math.random(), name: n, enabled: true }, ...methods];
    setName("");
    await persist(next, "Método agregado");
  };

  const toggle = async (id) => {
    const next = methods.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m));
    await persist(next, "Estado actualizado");
  };

  const remove = async (id) => {
    const next = methods.filter((m) => m.id !== id);
    await persist(next, "Método eliminado");
  };

  const reset = async () => persist(DEFAULT_METHODS, "Restablecido");

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Método de pago</h1>
          <p className="settings-subtitle">Activa/desactiva métodos, agrega personalizados y guarda por clínica.</p>
        </div>
        <div className="badge">💳 {enabledCount} activos</div>
      </div>

      {!clinicId && (
        <div className="notice card" style={{ marginBottom: 14 }}>
          ⚠️ No hay clínica activa. Se guardará en local hasta que tengas <span className="kbd">clinic_id</span>.
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Agregar método</h3>
          <div className="flex">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Apple Pay, Zelle, PayPal…" style={{ minWidth: 280 }} />
            <button className="btn btn-primary" onClick={add} disabled={busy || !name.trim()} type="button">
              {busy ? "Guardando..." : "Agregar"}
            </button>
            <button className="btn btn-ghost" onClick={reset} disabled={busy} type="button">Restablecer</button>
          </div>
          {msg ? <div className="notice" style={{ marginTop: 12 }}>{msg}</div> : null}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Lista</h3>
          <table className="table">
            <thead>
              <tr><th>Método</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.id}>
                  <td><b>{m.name}</b></td>
                  <td>{m.enabled ? "Activo ✅" : "Inactivo ⛔"}</td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-ghost" onClick={() => toggle(m.id)} disabled={busy} type="button">
                      {m.enabled ? "Desactivar" : "Activar"}
                    </button>
                    <button className="btn btn-danger" onClick={() => remove(m.id)} disabled={busy} type="button" style={{ marginLeft: 8 }}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="notice" style={{ marginTop: 12 }}>
            Tip: estos métodos se usan en <b>Factura PRO</b> para registrar pagos.
          </div>
        </div>
      </div>
    </div>
  );
}
