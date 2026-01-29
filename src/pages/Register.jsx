// src/pages/Register.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../styles/auth.css";

export default function Register() {
  const { signUp } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    clinic_name: "",
    country: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  function set(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);

    // Guardamos los datos para crear perfil/clinica cuando haya sesión (si hay confirmación por email)
    localStorage.setItem("pending_signup", JSON.stringify({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim(),
      clinic_name: form.clinic_name.trim(),
      country: form.country.trim(),
    }));

    const { error } = await signUp(form.email.trim(), form.password);
    setLoading(false);

    if (error) {
      setErr(error.message || "No se pudo crear el usuario.");
      return;
    }

    setOk("Usuario creado. Si Supabase requiere confirmación por email, revisa tu correo y luego inicia sesión.");
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-left">
          <div className="brand">
            <div className="brand-badge">DMC</div>
            <div>
              <h1>Crear usuario</h1>
              <p>Multi-clínicas • Acceso por roles</p>
            </div>
          </div>

          <div className="features">
            <div className="feature"><div className="dot" /><div>Se crea perfil + clínica + membership.</div></div>
            <div className="feature"><div className="dot" /><div>Super admin por lista de emails en Netlify.</div></div>
            <div className="feature"><div className="dot" /><div>Luego controlaremos roles 100% desde DB.</div></div>
          </div>
        </div>

        <div className="auth-right">
          <h2 className="title">Registro</h2>
          <p className="subtitle">Completa tus datos y los de la clínica.</p>

          {err ? <div className="error">{err}</div> : null}
          {ok ? <div className="ok">{ok}</div> : null}

          <form className="form" onSubmit={onSubmit}>
            <div className="row2">
              <div>
                <div className="label">Nombre</div>
                <input className="input" value={form.first_name} onChange={(e)=>set("first_name", e.target.value)} required />
              </div>
              <div>
                <div className="label">Apellido</div>
                <input className="input" value={form.last_name} onChange={(e)=>set("last_name", e.target.value)} required />
              </div>
            </div>

            <div className="row2">
              <div>
                <div className="label">Correo</div>
                <input className="input" value={form.email} onChange={(e)=>set("email", e.target.value)} autoComplete="email" required />
              </div>
              <div>
                <div className="label">Teléfono</div>
                <input className="input" value={form.phone} onChange={(e)=>set("phone", e.target.value)} required />
              </div>
            </div>

            <div className="row2">
              <div>
                <div className="label">Clínica (nombre)</div>
                <input className="input" value={form.clinic_name} onChange={(e)=>set("clinic_name", e.target.value)} required />
              </div>
              <div>
                <div className="label">País</div>
                <input className="input" value={form.country} onChange={(e)=>set("country", e.target.value)} required />
              </div>
            </div>

            <div>
              <div className="label">Contraseña</div>
              <input className="input" type="password" value={form.password} onChange={(e)=>set("password", e.target.value)} autoComplete="new-password" required />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Creando..." : "Crear usuario"}
            </button>

            <div className="linkrow">
              <Link className="a" to="/login">Volver al login</Link>
              <span className="small">Al crear, se prepara para multi-clínicas.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
