import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpWithClinic } from "../lib/authSupabase";
import "../styles/auth.css";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    clinicName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const disabled = useMemo(() => {
    return (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.clinicName.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      form.password.length < 6
    );
  }, [form]);

  const onChange = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await signUpWithClinic({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        clinicName: form.clinicName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      // Nota: si tienes confirmación por email en Supabase,
      // aquí puedes mandar a /login con mensaje.
      nav("/login", { replace: true });
    } catch (ex) {
      console.error(ex);
      setErr(ex?.message || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <div className="auth-badge">DMC</div>
          <h1>DMC Dental Solution</h1>
          <p>Gestión clínica moderna • Segura • Profesional</p>
          <div className="pill">🟢 Extra Premium</div>
        </div>

        <div className="auth-right">
          <h2>Crear cuenta</h2>

          {err ? <div className="auth-error">{err}</div> : null}

          <form onSubmit={onSubmit} className="auth-form">
            <div className="grid-2">
              <div className="field">
                <label>Nombre</label>
                <input
                  value={form.firstName}
                  onChange={onChange("firstName")}
                  placeholder="Nombre"
                  autoComplete="given-name"
                />
              </div>

              <div className="field">
                <label>Apellido</label>
                <input
                  value={form.lastName}
                  onChange={onChange("lastName")}
                  placeholder="Apellido"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="field">
              <label>Clínica / Consultorio</label>
              <input
                value={form.clinicName}
                onChange={onChange("clinicName")}
                placeholder="Nombre del consultorio"
                autoComplete="organization"
              />
            </div>

            <div className="field">
              <label>Teléfono</label>
              <input
                value={form.phone}
                onChange={onChange("phone")}
                placeholder="Ej: 8090000000"
                autoComplete="tel"
              />
            </div>

            <div className="field">
              <label>Correo</label>
              <input
                value={form.email}
                onChange={onChange("email")}
                placeholder="name@email.com"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div className="field">
              <label>Contraseña</label>
              <input
                value={form.password}
                onChange={onChange("password")}
                type="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={disabled || loading}
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => nav("/login")}
            >
              ← Volver
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
