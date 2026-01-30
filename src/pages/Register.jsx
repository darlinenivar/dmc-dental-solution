import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/auth.css";

const COUNTRIES = [
  "United States",
  "Dominican Republic",
  "Puerto Rico",
  "Mexico",
  "Colombia",
  "Venezuela",
  "Spain",
  "Other",
];

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "", // opcional
    email: "",
    password: "",
    password2: "",
    clinic_name: "",
    country: "United States",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  function setField(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    // Validaciones mínimas (phone NO requerido)
    if (!form.first_name.trim()) return setError("Escribe tu nombre.");
    if (!form.last_name.trim()) return setError("Escribe tu apellido.");
    if (!form.email.trim()) return setError("Escribe tu correo.");
    if (!form.clinic_name.trim()) return setError("Escribe el nombre de tu clínica.");

    if (form.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }
    if (form.password !== form.password2) {
      return setError("Las contraseñas no coinciden.");
    }

    setLoading(true);

    // Para flujos de reset/update password
    const redirectTo = `${window.location.origin}/update-password`;

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone || null, // opcional
          clinic_name: form.clinic_name,
          country: form.country,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Si email confirmations está ON, no habrá session al momento
    if (!data?.session) {
      setMsg("Cuenta creada. Revisa tu email para confirmar y luego inicia sesión.");
    } else {
      setMsg("Cuenta creada. Ya puedes iniciar sesión.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="brand">
            <div className="brand-badge">DMC</div>
            <div>
              <h1>DMC Dental Solution</h1>
              <p>Registro premium • Se crea tu clínica automáticamente</p>
            </div>
          </div>

          <div className="feature">
            <div>✅ <b>1 sola página</b> para registrarse</div>
            <div>✅ <b>Multi-clínica</b> real (RLS + Supabase)</div>
            <div>✅ <b>Clínica automática</b> al crear cuenta</div>
          </div>
        </div>

        <div className="auth-right">
          <h2 className="auth-title">Crear cuenta</h2>
          <p className="auth-sub">Completa tus datos y la información de tu clínica.</p>

          {msg && <div className="msg">{msg}</div>}
          {error && <div className="msg error">{error}</div>}

          <form className="form" onSubmit={onSubmit}>
            <div className="sectionTitle">Login Details</div>

            <div className="grid2">
              <div>
                <label className="label">Nombre</label>
                <input
                  className="input"
                  value={form.first_name}
                  onChange={(e) => setField("first_name", e.target.value)}
                  placeholder="Ej: Darline"
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="label">Apellido</label>
                <input
                  className="input"
                  value={form.last_name}
                  onChange={(e) => setField("last_name", e.target.value)}
                  placeholder="Ej: Nivar"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="grid2">
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="label">Teléfono <span style={{ fontWeight: 500, opacity: 0.8 }}>(opcional)</span></label>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+1 809..."
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="grid2">
              <div>
                <label className="label">Contraseña</label>
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="label">Repetir contraseña</label>
                <input
                  className="input"
                  type="password"
                  value={form.password2}
                  onChange={(e) => setField("password2", e.target.value)}
                  placeholder="Repite la contraseña"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="sectionTitle">Clinic Information</div>

            <div className="grid2">
              <div>
                <label className="label">Nombre de la clínica</label>
                <input
                  className="input"
                  value={form.clinic_name}
                  onChange={(e) => setField("clinic_name", e.target.value)}
                  placeholder="Ej: DMC Dental - Manhattan"
                />
              </div>

              <div>
                <label className="label">País</label>
                <select
                  className="input"
                  value={form.country}
                  onChange={(e) => setField("country", e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creando..." : "Crear mi cuenta"}
            </button>

            <div className="row">
              <span className="auth-sub" style={{ margin: 0 }}>¿Ya tienes cuenta?</span>
              <Link className="link" to="/login">Login ahora</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
