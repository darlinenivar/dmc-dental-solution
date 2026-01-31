// src/pages/ForgotPassword.jsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const canSubmit = useMemo(() => email.trim().length > 3 && !loading, [email, loading]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setOk(
        "Listo. Si ese correo existe, te llegó un enlace para restablecer tu contraseña. Revisa Inbox y Spam."
      );
    } catch (err) {
      setError(err?.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-left">
            <div className="brand-row">
              <div className="brand-logo">DMC</div>
              <div>
                <div className="brand-title">DMC Dental Solution</div>
                <div className="brand-sub">Recuperación de acceso segura</div>
              </div>
            </div>

            <div className="auth-left-note">
              Te enviaremos un enlace para crear una nueva contraseña.
              <br />
              <br />
              <span className="small">
                Importante: el enlace se abre en la misma web donde estás (este dominio).
              </span>
            </div>
          </div>

          <div className="auth-right">
            <h1 className="auth-h1">Recuperar contraseña</h1>
            <div className="auth-h2">Escribe tu email y te enviamos el enlace.</div>

            {error ? <div className="alert error">{error}</div> : null}
            {ok ? <div className="alert ok">{ok}</div> : null}

            <form className="form" onSubmit={handleReset}>
              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@clinica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="btn" disabled={!canSubmit}>
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>

              <div className="row" style={{ marginTop: 8 }}>
                <Link className="link" to="/login">Volver a iniciar sesión</Link>
                <Link className="link" to="/register">Crear cuenta</Link>
              </div>

              <div className="footer">© {new Date().getFullYear()} DMC Dental Solution</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
