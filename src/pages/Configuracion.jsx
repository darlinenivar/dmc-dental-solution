import React, { useState } from "react";
import "../styles/dashboard.css";

export default function Configuracion() {
  const [form, setForm] = useState({
    clinic_name: "DMC Dental Solution",
    phone: "",
    city: "",
    state: "",
    zip: "",
    theme_color: "#1d4ed8",
  });

  function setField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function onSave(e) {
    e.preventDefault();
    alert("Listo. En el siguiente paso lo conectamos a Supabase sin errores.");
  }

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1>Configuración</h1>
        <p className="muted">Datos de la clínica y ajustes básicos (guardado en Supabase).</p>
      </div>

      <div className="config-grid">
        <form className="config-card" onSubmit={onSave}>
          <div className="row2">
            <label>
              Nombre de la clínica *
              <input value={form.clinic_name} onChange={(e) => setField("clinic_name", e.target.value)} required />
            </label>
            <label>
              Teléfono
              <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="(000) 000-0000" />
            </label>
          </div>

          <label>
            Ciudad
            <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="Ciudad" />
          </label>

          <div className="row2">
            <label>
              Estado
              <input value={form.state} onChange={(e) => setField("state", e.target.value)} placeholder="Estado" />
            </label>
            <label>
              Zip
              <input value={form.zip} onChange={(e) => setField("zip", e.target.value)} placeholder="00000" />
            </label>
          </div>

          <label>
            Color principal
            <input type="color" value={form.theme_color} onChange={(e) => setField("theme_color", e.target.value)} />
          </label>

          <div className="actions">
            <button className="btn" type="submit">Guardar cambios</button>
            <button className="btn ghost" type="button" onClick={() => window.history.back()}>
              Cancelar
            </button>
          </div>
        </form>

        <div className="config-side">
          <div className="config-card">
            <h3>Qué guarda esta sección</h3>
            <ul>
              <li>✅ Datos de la clínica</li>
              <li>✅ Color principal (tema)</li>
              <li>🔒 Protegido por RLS (solo tu cuenta ve/edita)</li>
            </ul>
          </div>

          <div className="config-card">
            <h3>Siguiente paso</h3>
            <p className="muted">
              Cuando esto esté estable en Vercel, conectamos estos campos a la tabla <strong>clinics</strong>
              (owner_user_id, name, phone, country, logo_url).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
