// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });
      if (err) throw err;
      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authLeft">
          <div className="brandRow">
            <div className="brandLogo">DMC</div>
            <div>
              <div className="brandTitle">DMC Dental Solution</div>
              <div className="brandSub">Accede a tu clínica • Seguro • Multi-clínica</div>
            </div>
          </div>

          <div className="checkList">
            <div>🔒 Acceso seguro con Supabase</div>
            <div>🏥 Multi-clínica con permisos</div>
            <div>⚡ Diseño premium + rápido</div>
          </div>
        </div>

        <div className="authRight">
          <h2>Iniciar sesión</h2>
          <p className="muted">Bienvenido/a. Ingresa tus credenciales.</p>

          <form onSubmit={onSubmit} className="authForm">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Contraseña</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />

            <button className="btnPrimary" type="submit" disabled={loading}>
              {loading ? "Ingresando…" : "Iniciar sesión"}
            </button>
          </form>

          {error && <p className="alertError">{error}</p>}

          <div className="authLinks">
            <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
            <Link to="/register">Crear cuenta</Link>
          </div>

          <div className="muted" style={{ marginTop: 12 }}>
            © 2026 DMC Dental Solution
          </div>
        </div>
      </div>
    </div>
  );
}
