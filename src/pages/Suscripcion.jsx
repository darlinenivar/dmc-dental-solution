import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/settings.css";

const LS_TIER = "dmc.subscriptionTier.v1";

const TIERS = [
  {
    id: "free",
    title: "Free",
    price: "$0",
    perks: ["Pacientes (básico)", "Citas (básico)", "Procedimientos (local)"],
  },
  {
    id: "pro",
    title: "Pro",
    price: "$29/mo",
    perks: ["Factura PRO", "Backup JSON", "Soporte prioritario", "Multi-clínica"],
    highlight: true,
  },
  {
    id: "premium",
    title: "Premium",
    price: "$59/mo",
    perks: ["Todo lo Pro", "Equipos conectados", "Finanzas avanzadas", "Odontograma Pro"],
  },
];

export default function Suscripcion() {
  const [tier, setTier] = useState(() => localStorage.getItem(LS_TIER) || "pro");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_TIER, tier);
  }, [tier]);

  const saveSupabase = async (tierId) => {
    // Si existe tabla "subscriptions", lo guarda. Si no existe, no rompe.
    const { data: u } = await supabase.auth.getUser();
    const userId = u?.user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from("subscriptions")
      .upsert({ user_id: userId, tier: tierId, updated_at: new Date().toISOString() }, { onConflict: "user_id" });

    if (error) throw error;
  };

  const onSave = async () => {
    try {
      setBusy(true);
      setMsg("");
      try {
        await saveSupabase(tier);
        setMsg("✅ Suscripción guardada (Supabase + local).");
      } catch (e) {
        console.warn("subscriptions table not ready:", e);
        setMsg("✅ Suscripción guardada localmente. (Supabase no listo todavía)");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Suscripción</h1>
          <p className="settings-subtitle">
            Selecciona tu plan. Esto habilita/oculta funciones “Premium” dentro del sistema.
          </p>
        </div>
        <div className="badge">⭐ Plans</div>
      </div>

      <div className="grid-2">
        {TIERS.map((t) => (
          <div
            key={t.id}
            className="card"
            style={{
              borderColor: tier === t.id ? "rgba(31,111,235,.35)" : "rgba(0,0,0,.08)",
              outline: t.highlight ? "2px solid rgba(31,111,235,.12)" : "none",
            }}
          >
            <div className="flex">
              <div style={{ fontSize: 20, fontWeight: 900 }}>{t.title}</div>
              <div className="right badge">{t.price}</div>
            </div>

            <ul style={{ margin: "12px 0 0", paddingLeft: 18, opacity: 0.9 }}>
              {t.perks.map((p) => (
                <li key={p} style={{ margin: "6px 0" }}>{p}</li>
              ))}
            </ul>

            <div className="flex" style={{ marginTop: 14 }}>
              <button
                className={`btn ${tier === t.id ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTier(t.id)}
                type="button"
              >
                {tier === t.id ? "Seleccionado" : "Elegir"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="flex">
          <button className="btn btn-primary" onClick={onSave} disabled={busy} type="button">
            {busy ? "Guardando..." : "Guardar"}
          </button>
          {msg ? <div className="notice" style={{ flex: 1 }}>{msg}</div> : null}
        </div>
      </div>
    </div>
  );
}
