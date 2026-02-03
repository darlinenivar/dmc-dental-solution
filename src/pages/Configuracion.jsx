import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const TABS = [
  { id: "clinica", label: "Clínica" },
  { id: "cuenta", label: "Cuenta" },
  { id: "seguridad", label: "Seguridad" },
];

const emptyClinic = {
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
  theme_color: "#2563eb",
};

export default function Configuracion() {
  const [tab, setTab] = useState("clinica");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);
  const [clinicId, setClinicId] = useState(null);
  const [clinic, setClinic] = useState(emptyClinic);

  const title = useMemo(() => {
    if (tab === "clinica") return "Configuración de la clínica";
    if (tab === "cuenta") return "Cuenta";
    return "Seguridad";
  }, [tab]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");
      setMsg("");

      const { data: u, error: uErr } = await supabase.auth.getUser();
      if (uErr) {
        if (!alive) return;
        setError(uErr.message);
        setLoading(false);
        return;
      }

      const currentUser = u?.user ?? null;
      if (!alive) return;

      setUser(currentUser);

      if (!currentUser) {
        setError("No hay sesión activa. Inicia sesión para ver Configuración.");
        setLoading(false);
        return;
      }

      // Buscar clínica del usuario
      const { data: row, error: cErr } = await supabase
        .from("clinics")
        .select("*")
        .eq("owner_user_id", currentUser.id)
        .maybeSingle();

      if (cErr) {
        if (!alive) return;
        setError(cErr.message);
        setLoading(false);
        return;
      }

      // Si no existe, crear una por defecto
      if (!row) {
        const payload = {
          owner_user_id: currentUser.id,
          ...emptyClinic,
          name: "Mi Clínica",
        };

        const { data: created, error: insErr } = await supabase
          .from("clinics")
          .insert(payload)
          .select("*")
          .single();

        if (insErr) {
          if (!alive) return;
          setError(insErr.message);
          setLoading(false);
          return;
        }

        if (!alive) return;
        setClinicId(created.id);
        setClinic({
          name: created.name ?? "",
          phone: created.phone ?? "",
          address: created.address ?? "",
          city: created.city ?? "",
          state: created.state ?? "",
          zip: created.zip ?? "",
          country: created.country ?? "US",
          theme_color: created.theme_color ?? "#2563eb",
        });

        setLoading(false);
        return;
      }

      // Existe
      if (!alive) return;
      setClinicId(row.id);
      setClinic({
        name: row.name ?? "",
        phone: row.phone ?? "",
        address: row.address ?? "",
        city: row.city ?? "",
        state: row.state ?? "",
        zip: row.zip ?? "",
        country: row.country ?? "US",
        theme_color: row.theme_color ?? "#2563eb",
      });

      setLoading(false);
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  async function saveClinic() {
    setSaving(true);
    setMsg("");
    setError("");

    try {
      if (!user) throw new Error("No hay usuario autenticado.");
      if (!clinicId) throw new Error("No existe clinicId todavía.");

      const update = {
        ...clinic,
      };

      const { error: upErr } = await supabase
        .from("clinics")
        .update(update)
        .eq("id", clinicId)
        .eq("owner_user_id", user.id);

      if (upErr) throw upErr;

      // Aplicar theme en vivo (opcional pero pro)
      document.documentElement.style.setProperty("--brand", clinic.theme_color);

      setMsg("✅ Cambios guardados.");
    } catch (e) {
      setError(e.message || "Error guardando cambios.");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    setError("");
    setMsg("");
    const { error: outErr } = await supabase.auth.signOut();
    if (outErr) setError(outErr.message);
    else window.location.href = "/";
  }

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>{title}</h1>
          <p style={{ marginTop: 0, color: "#555" }}>
            Datos guardados en Supabase (protegidos por RLS).
          </p>
        </div>

        <Link to="/dashboard" style={{ alignSelf: "center" }}>
          ← Volver
        </Link>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: tab === t.id ? "#111827" : "#fff",
              color: tab === t.id ? "#fff" : "#111827",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div>⏳ Cargando…</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div
            style={{
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              background: "#fff",
            }}
          >
            {tab === "clinica" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field
                    label="Nombre de la clínica *"
                    value={clinic.name}
                    onChange={(v) => setClinic((s) => ({ ...s, name: v }))}
                  />
                  <Field
                    label="Teléfono"
                    value={clinic.phone}
                    onChange={(v) => setClinic((s) => ({ ...s, phone: v }))}
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <Field
                    label="Dirección"
                    value={clinic.address}
                    onChange={(v) => setClinic((s) => ({ ...s, address: v }))}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                  <Field
                    label="Ciudad"
                    value={clinic.city}
                    onChange={(v) => setClinic((s) => ({ ...s, city: v }))}
                  />
                  <Field
                    label="Estado"
                    value={clinic.state}
                    onChange={(v) => setClinic((s) => ({ ...s, state: v }))}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                  <Field
                    label="Zip"
                    value={clinic.zip}
                    onChange={(v) => setClinic((s) => ({ ...s, zip: v }))}
                  />
                  <Field
                    label="País"
                    value={clinic.country}
                    onChange={(v) => setClinic((s) => ({ ...s, country: v }))}
                  />
                </div>

                <div style={{ marginTop: 12 }}>
                  <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
                    Color principal
                  </label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      type="color"
                      value={clinic.theme_color}
                      onChange={(e) =>
                        setClinic((s) => ({ ...s, theme_color: e.target.value }))
                      }
                      style={{ width: 54, height: 36 }}
                    />
                    <span style={{ fontSize: 13, color: "#555" }}>
                      Se usará luego para el tema.
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button
                    onClick={saveClinic}
                    disabled={saving || !clinic.name.trim()}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "none",
                      background: "#2563eb",
                      color: "#fff",
                      cursor: "pointer",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>

                  <button
                    onClick={() => {
                      setMsg("");
                      setError("");
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {tab === "cuenta" && (
              <>
                <h3 style={{ marginTop: 0 }}>Tu cuenta</h3>

                <div style={{ marginTop: 10, fontSize: 14 }}>
                  <div>
                    <strong>Email:</strong> {user?.email || "—"}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <strong>User ID:</strong> <code>{user?.id || "—"}</code>
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <button
                    onClick={logout}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "none",
                      background: "#dc2626",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}

            {tab === "seguridad" && (
              <>
                <h3 style={{ marginTop: 0 }}>Seguridad</h3>
                <p style={{ color: "#555", marginTop: 0 }}>
                  Cambia tu contraseña de acceso.
                </p>

                <Link to="/dashboard/cambiar-password">Ir a cambiar contraseña →</Link>
              </>
            )}

            {/* Alerts */}
            {error ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  borderRadius: 12,
                  background: "#fee2e2",
                  border: "1px solid #fecaca",
                  color: "#7f1d1d",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            ) : null}

            {msg ? (
              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  borderRadius: 12,
                  background: "#dcfce7",
                  border: "1px solid #bbf7d0",
                  color: "#14532d",
                  fontSize: 13,
                }}
              >
                {msg}
              </div>
            ) : null}
          </div>

          {/* Right */}
          <div
            style={{
              padding: 16,
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              background: "#fafafa",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Qué guarda esta sección</h3>
            <ul style={{ marginTop: 8, color: "#444" }}>
              <li>✅ Datos de la clínica</li>
              <li>✅ Color principal (tema)</li>
              <li>🔒 Protegido por RLS (solo tu cuenta ve/edita)</li>
            </ul>

            <div style={{ marginTop: 16, padding: 12, background: "#fff", borderRadius: 12 }}>
              <strong>Siguiente paso</strong>
              <p style={{ marginTop: 8, color: "#555", fontSize: 13 }}>
                Cuando esto esté estable en Vercel, conectamos estos datos al diseño global
                (logo/nombre/colores) y seguimos con Pacientes.
              </p>

              <div style={{ fontSize: 13 }}>
                <Link to="/politicas-privacidad">Ver Política de Privacidad</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", fontSize: 13, marginBottom: 6 }}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          outline: "none",
        }}
      />
    </label>
  );
}
