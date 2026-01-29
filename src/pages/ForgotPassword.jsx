import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

export default function ForgotPassword() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!email) {
      setMsg({ type: "error", text: "Escribe tu email." });
      return;
    }

    try {
      setLoading(true);

      // IMPORTANTE: esta URL debe existir en tu app
      const redirectTo = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;

      setMsg({
        type: "success",
        text:
          "Listo ✅ Te enviamos un email para recuperar tu contraseña. Revisa Inbox o Spam.",
      });
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err?.message ||
          "No se pudo enviar el email. Verifica el correo e intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-card">
          <h3>Recuperar contraseña</h3>
          <p>Te enviaremos un enlace seguro para crear una contraseña nueva.</p>

          {msg.text ? (
            <div className={`alert ${msg.type}`}>{msg.text}</div>
          ) : null}

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@clinica.com"
                autoComplete="email"
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => nav("/login")}
            >
              Volver al login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
