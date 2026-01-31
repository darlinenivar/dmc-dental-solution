// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!email.trim()) return setError("Escribe tu email.");

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (err) throw err;
      setMsg("Listo ✅ Te enviamos un enlace para crear tu nueva contraseña.");
    } catch (err) {
      setError(err?.message || "No se pudo enviar el enlace.");
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
              <div className="brandSub">Recuperación de acceso segura</div>
            </div>
          </div>
          <p className="muted">
            Escribe tu email y te enviamos el enlace para crear una nueva contraseña. El enlace abre en este mismo dominio.
          </p>
          <div className="muted">© 2026 DMC Dental Solution</div>
        </div>

        <div className="authRight">
          <h2>Recuperar contraseña</h2>
          <p className="muted">Escribe tu email y te enviamos el enlace.</p>

          <form onSubmit={onSubmit} className="authForm">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@clinica.com" />

            <button className="btnPrimary" type="submit" disabled={loading}>
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>

          {error && <p className="alertError">{error}</p>}
          {msg && <p className="alertOk">{msg}</p>}

          <div className="authLinks">
            <Link to="/login">Volver a iniciar sesión</Link>
            <Link to="/register">Crear cuenta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
