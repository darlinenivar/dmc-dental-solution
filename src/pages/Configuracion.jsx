import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Configuracion() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState({
    clinic_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    theme_color: "#eb8525",
  });

  const canSave = useMemo(() => form.clinic_name.trim().length > 1, [form.clinic_name]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError("");
      setOk("");

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      // Trae tu clínica (si no existe, la crea)
      const { data, error: selErr } = await supabase
        .from("clinics")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!alive) return;

      if (selErr) {
        setError(selErr.message);
        setLoading(false);
        return;
      }

      if (!data) {
        // Crear registro inicial
        const { data: created, error: insErr } = await supabase
          .from("clinics")
          .insert({
            owner_user_id: user.id,
            clinic_name: "Mi Clínica",
          })
          .select("*")
          .single();

        if (insErr) {
          setError(insErr.message);
          setLoading(false);
          return;
        }

        setForm({
          clinic_name: created.clinic_name ?? "",
          phone: created.phone ?? "",
          address: created.address ?? "",
          city: created.city ?? "",
          state: created.state ?? "",
          zip: created.zip ?? "",
          theme_color: created.theme_color ?? "",
        });

        setLoading(false);
        return;
      }

      // Existe
      setForm({
        clinic_name: data.clinic_name ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        zip: data.zip ?? "",
        theme_color: data.theme_color ?? "#2563eb",
      });

      setLoading(false);
    };

    load();
    return () => {
      alive = false;
    };
  }, [navigate]);

  const onChange = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setOk("");
    setError("");

    if (!canSave) {
      setError("El nombre de la clínica es obligatorio.");
      return;
    }

    setSaving(true);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;

    if (!user) {
      setSaving(false);
      navigate("/login", { replace: true });
      return;
    }

    // Upsert por owner_id (1 clínica por cuenta)
    const { error: upErr } = await supabase
      .from("clinics")
      .upsert(
        {
          owner_user_id: user.id,
          clinic_name: form.clinic_name.trim(),
          phone: form.phone || null,
          address: form.address || null,
          city: form.city || null,
          state: form.state || null,
          zip: form.zip || null,
          theme_color: form.theme_color || "#2563eb",
        },
        { onConflict: "owner_id" }
      );

    setSaving(false);

    if (upErr) {
      setError(upErr.message);
      return;
    }

    setOk("✅ Configuración guardada correctamente.");
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ margin: 0 }}>Configuración</h2>
        <p style={{ color: "#6b7280" }}>Cargando…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 980 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Configuración</h2>
          <p style={{ marginTop: 8, color: "#6b7280" }}>
            Datos de la clínica y ajustes básicos (guardado en Supabase).
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            border: "1px solid #e5e7eb",
            background: "#fff",
            padding: "10px 12px",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          ← Volver
        </button>
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 320px", gap: 14 }}>
        {/* Form */}
        <form onSubmit={onSave} style={panelStyle}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Nombre de la clínica" required>
              <input value={form.clinic_name} onChange={onChange("clinic_name")} placeholder="DMC Dental Solution" style={inputStyle} />
            </Field>

            <Field label="Teléfono">
              <input value={form.phone} onChange={onChange("phone")} placeholder="(000) 000-0000" style={inputStyle} />
            </Field>

            <Field label="Dirección" span2>
              <input value={form.address} onChange={onChange("address")} placeholder="Calle / número" style={inputStyle} />
            </Field>

            <Field label="Ciudad">
              <input value={form.city} onChange={onChange("city")} placeholder="Ciudad" style={inputStyle} />
            </Field>

            <Field label="Estado">
              <input value={form.state} onChange={onChange("state")} placeholder="Estado" style={inputStyle} />
            </Field>

            <Field label="Zip">
              <input value={form.zip} onChange={onChange("zip")} placeholder="00000" style={inputStyle} />
            </Field>

            <Field label="Color principal" help="Se usará luego para el tema.">
              <input type="color" value={form.theme_color} onChange={onChange("theme_color")} style={{ height: 42, width: "100%" }} />
            </Field>
          </div>

          {error ? <div style={errStyle}>{error}</div> : null}
          {ok ? <div style={okStyle}>{ok}</div> : null}

          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{
                background: "#f9fafb",
                color: "#111827",
                border: "1px solid #e5e7eb",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* Panel lateral */}
        <div style={panelStyle}>
          <h3 style={{ marginTop: 0 }}>Qué guarda esta sección</h3>
          <ul style={{ color: "#374151", marginTop: 10, lineHeight: 1.8 }}>
            <li>✅ Datos de la clínica</li>
            <li>✅ Color principal (tema)</li>
            <li>🔒 Protegido por RLS (solo tu cuenta ve/edita)</li>
          </ul>

          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Siguiente paso</div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>
              Cuando esto funcione en Vercel, conectamos estos datos al diseño (logo/nombre/colores) y seguimos con Pacientes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, help, children, required, span2 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: span2 ? "1 / -1" : "auto" }}>
      <label style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>
        {label} {required ? <span style={{ color: "#ef4444" }}>*</span> : null}
      </label>
      {children}
      {help ? <div style={{ fontSize: 12, color: "#6b7280" }}>{help}</div> : null}
    </div>
  );
}

const panelStyle = {
  border: "1px solid #e5e7eb",
  background: "#fff",
  borderRadius: 12,
  padding: 14,
  boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
};

const inputStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: "10px 12px",
  outline: "none",
  fontSize: 14,
};

const errStyle = {
  marginTop: 12,
  padding: 10,
  borderRadius: 10,
  background: "#fff1f2",
  border: "1px solid #fecdd3",
  color: "#9f1239",
  fontSize: 13,
};

const okStyle = {
  marginTop: 12,
  padding: 10,
  borderRadius: 10,
  background: "#ecfdf5",
  border: "1px solid #bbf7d0",
  color: "#065f46",
  fontSize: 13,
};
