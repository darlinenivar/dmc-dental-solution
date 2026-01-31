import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMessage("Listo ✅ Revisa tu email. Te enviamos el enlace para crear una nueva contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-left">
          <div className="brand-row">
            <div className="brand-badge">DMC</div>
            <div>
              <div className="brand-title">DMC Dental Solution</div>
              <div className="brand-sub">Recuperación de acceso segura</div>
            </div>
          </div>

          <div className="auth-desc">
            Escribe tu email y te enviamos el enlace para crear una nueva contraseña.
            El enlace se abre en esta misma web (este dominio).
          </div>

          <div className="auth-footer">© {new Date().getFullYear()} DMC Dental Solution</div>
        </div>

        <div className="auth-right">
          <div className="auth-title">Recuperar contraseña</div>
          <div className="auth-desc">Escribe tu email y te enviamos el enlace.</div>

          <form className="auth-form" onSubmit={sendReset}>
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@clinica.com"
                required
              />
            </div>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            {error && <div className="msg-error">{error}</div>}
            {message && <div className="msg-success">{message}</div>}

            <div className="auth-links">
              <Link className="auth-link" to="/login">Volver a iniciar sesión</Link>
              <Link className="auth-link" to="/register">Crear cuenta</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
