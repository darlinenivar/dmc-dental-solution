import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ✅ URL de retorno (tu dominio actual)
  const redirectTo = useMemo(() => {
    // Debe apuntar a tu página que recibe el recovery (UpdatePassword)
    return `${window.location.origin}/update-password`;
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setMsg("Listo. Te enviamos un enlace para crear una nueva contraseña.");
    } catch (err) {
      setError(err?.message || "No se pudo enviar el enlace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-shell">
        <div className="auth-grid">
          <div className="auth-left">
            <div className="brand">
              <div className="brand-badge">DMC</div>
              <div className="brand-title">
                <b>DMC Dental Solution</b>
                <span>Recuperación de acceso segura</span>
              </div>
            </div>

            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
              Escribe tu email y te enviamos el enlace para crear una nueva contraseña.
              El enlace abre en la misma web donde estás (este dominio).
            </p>

            <div className="footer">© {new Date().getFullYear()} DMC Dental Solution</div>
          </div>

          <div className="auth-right">
            <h2 className="auth-title">Recuperar contraseña</h2>
            <p className="auth-sub">Escribe tu email y te enviamos el enlace.</p>

            {error ? <div className="alert">{error}</div> : null}
            {msg ? <div className="alert success">{msg}</div> : null}

            <form className="form" onSubmit={handleSend}>
              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@clinica.com"
                  required
                />
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>

              <div className="actions" style={{ justifyContent: "space-between" }}>
                <Link className="link" to="/login">Volver a iniciar sesión</Link>
                <Link className="link" to="/register">Crear cuenta</Link>
              </div>

              <div className="footer" style={{ textAlign: "center" }}>
                © {new Date().getFullYear()} DMC Dental Solution
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
