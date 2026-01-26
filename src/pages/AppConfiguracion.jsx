import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/settings.css";

const LS_APP_CONFIG = "dmc.appConfig.v1";

const DEFAULTS = {
  currency: "DOP",
  locale: "es-DO",
  invoice_prefix: "DMC",
  invoice_next: 1,
  show_logo: true,
  clinic_phone: "",
  clinic_email: "",
  clinic_address: "",
};

export default function AppConfiguracion() {
  const [cfg, setCfg] = useState(() => {
    try {
      return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(LS_APP_CONFIG) || "{}")) };
    } catch {
      return DEFAULTS;
    }
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_APP_CONFIG, JSON.stringify(cfg));
  }, [cfg]);

  const saveSupabase = async () => {
    const { data: u } = await supabase.auth.getUser();
    const userId = u?.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from("app_settings")
      .upsert(
        { user_id: userId, config: cfg, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    if (error) throw error;
  };

  const onSave = async () => {
    try {
      setBusy(true);
      setMsg("");
      try {
        await saveSupabase();
        setMsg("✅ Configuración guardada (Supabase + local).");
      } catch (e) {
        console.warn("app_settings table not ready:", e);
        setMsg("✅ Configuración guardada localmente. (Supabase no listo todavía)");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">App configuración</h1>
          <p className="settings-subtitle">
            Ajustes generales: moneda, formato, datos de factura y numeración.
          </p>
        </div>
        <div className="badge">🧩 Config</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="row">
            <div className="label">Moneda</div>
            <select className="select" value={cfg.currency} onChange={(e) => setCfg((p) => ({ ...p, currency: e.target.value }))}>
              <option value="DOP">DOP (RD$)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>

            <div className="label">Idioma / región</div>
            <select className="select" value={cfg.locale} onChange={(e) => setCfg((p) => ({ ...p, locale: e.target.value }))}>
              <option value="es-DO">Español (RD)</option>
              <option value="es-US">Español (US)</option>
              <option value="en-US">English (US)</option>
            </select>

            <div className="label">Mostrar logo en factura</div>
            <select className="select" value={cfg.show_logo ? "yes" : "no"} onChange={(e) => setCfg((p) => ({ ...p, show_logo: e.target.value === "yes" }))}>
              <option value="yes">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        <div className="card">
          <div className="row">
            <div className="label">Prefijo de factura</div>
            <input className="input" value={cfg.invoice_prefix} onChange={(e) => setCfg((p) => ({ ...p, invoice_prefix: e.target.value }))} />

            <div className="label">Siguiente número</div>
            <input
              className="input"
              type="number"
              value={cfg.invoice_next}
              onChange={(e) => setCfg((p) => ({ ...p, invoice_next: Number(e.target.value || 1) }))}
            />

            <div className="notice">
              Ejemplo: <b>{cfg.invoice_prefix}-{String(cfg.invoice_next).padStart(6, "0")}</b>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="row">
            <div className="label">Teléfono clínica</div>
            <input className="input" value={cfg.clinic_phone} onChange={(e) => setCfg((p) => ({ ...p, clinic_phone: e.target.value }))} placeholder="809-000-0000" />

            <div className="label">Email clínica</div>
            <input className="input" value={cfg.clinic_email} onChange={(e) => setCfg((p) => ({ ...p, clinic_email: e.target.value }))} placeholder="clinic@email.com" />

            <div className="label">Dirección</div>
            <textarea className="textarea" value={cfg.clinic_address} onChange={(e) => setCfg((p) => ({ ...p, clinic_address: e.target.value }))} placeholder="Calle, ciudad, país" />
          </div>
        </div>

        <div className="card">
          <div className="row">
            <div className="label">Vista rápida</div>
            <div className="notice">
              <div><b>Moneda:</b> {cfg.currency}</div>
              <div><b>Región:</b> {cfg.locale}</div>
              <div><b>Factura:</b> {cfg.invoice_prefix}-{String(cfg.invoice_next).padStart(6, "0")}</div>
            </div>
          </div>

          <div className="flex" style={{ marginTop: 14 }}>
            <button className="btn btn-primary" onClick={onSave} disabled={busy} type="button">
              {busy ? "Guardando..." : "Guardar configuración"}
            </button>
            {msg ? <div className="notice" style={{ flex: 1 }}>{msg}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
