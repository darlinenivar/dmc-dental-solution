import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/login.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setErr(error.message);
        return;
      }

      setMsg("Listo ✅ Te enviamos un email con el enlace para crear una nueva contraseña.");
    } catch (e2) {
      setErr(e2?.message || "Error enviando email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-shell">
        <div className="auth-card single">
          <div className="auth-left">
            <div className="brand-row">
              <div className="brand-logo">DMC</div>
              <div>
                <div className="brand-title">DMC Dental Solution</div>
                <div className="brand-subtitle">Recuperación de acceso segura</div>
              </div>
            </div>

            <div className="hint">
              Te enviaremos un enlace para crear una nueva contraseña. El enlace se abrirá en este mismo dominio.
            </div>
          </div>

          <div className="auth-right">
            <h2 className="auth-h">Recuperar contraseña</h2>
            <p className="auth-p">Escribe tu email y te enviamos el enlace.</p>

            {err ? <div className="auth-error">{err}</div> : null}
            {msg ? <div className="auth-success">{msg}</div> : null}

            <form onSubmit={onSubmit} className="auth-form">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@clinica.com"
                autoComplete="email"
              />

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
            </form>

            <div className="auth-footer spread">
              <Link className="auth-link" to="/login">
                Volver a iniciar sesión
              </Link>

              <Link className="auth-link strong" to="/register">
                Crear cuenta
              </Link>
            </div>

            <div className="auth-copy">© {new Date().getFullYear()} DMC Dental Solution</div>
          </div>
        </div>
      </div>
    </div>
  );
}
