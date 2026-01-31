// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/auth.css";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    clinic_name: "",
    country: "United States",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) return setError("La contraseña debe tener mínimo 6 caracteres.");
    if (form.password !== form.confirm) return setError("Las contraseñas no coinciden.");
    if (!form.clinic_name.trim()) return setError("Escribe el nombre de la clínica.");

    setLoading(true);
    try {
      // Guardamos datos extra en metadata (el trigger/func en SQL puede leer esto si quieres)
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            first_name: form.first_name,
            last_name: form.last_name,
            phone: form.phone,
            clinic_name: form.clinic_name,
            country: form.country,
          },
        },
      });

      if (signUpError) throw signUpError;

      nav("/login", { replace: true });
    } catch (err) {
      setError(err?.message || "Database error saving new user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <h2>Crear cuenta</h2>
        <p className="muted">Completa tus datos y la información de tu clínica.</p>

        <form onSubmit={onSubmit} className="auth-form grid">
          <div>
            <label>Nombre</label>
            <input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} placeholder="Ej: Darline" required />
          </div>

          <div>
            <label>Apellido</label>
            <input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} placeholder="Ej: Nivar" required />
          </div>

          <div>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" required />
          </div>

          <div>
            <label>Teléfono (opcional)</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 809..." />
          </div>

          <div>
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Mínimo 6 caracteres" required />
          </div>

          <div>
            <label>Repetir contraseña</label>
            <input type="password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} placeholder="Repite la contraseña" required />
          </div>

          <div>
            <label>Nombre de la clínica</label>
            <input value={form.clinic_name} onChange={(e) => set("clinic_name", e.target.value)} placeholder="Ej: DMC Dental - Manhattan" required />
          </div>

          <div>
            <label>País</label>
            <select value={form.country} onChange={(e) => set("country", e.target.value)}>
              <option>United States</option>
              <option>Dominican Republic</option>
              <option>Puerto Rico</option>
              <option>Mexico</option>
              <option>Colombia</option>
            </select>
          </div>

          <button className="btn-primary full" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        {error && <p className="alert error">{error}</p>}

        <button className="btn-secondary" type="button" onClick={() => nav("/login")}>
          Volver al inicio
        </button>

        <div className="auth-links">
          <span className="muted">¿Ya tienes cuenta?</span>
          <Link to="/login">Login ahora</Link>
        </div>
      </div>
    </div>
  );
}
