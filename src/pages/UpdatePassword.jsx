import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const onUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      setMsg("Contraseña actualizada. Ya puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err?.message || "No se pudo actualizar la contraseña.");
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
                <span>Cambia tu contraseña de forma segura</span>
              </div>
            </div>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
              Crea una nueva contraseña para tu cuenta.
            </p>
            <div className="footer">© {new Date().getFullYear()} DMC Dental Solution</div>
          </div>

          <div className="auth-right">
            <h2 className="auth-title">Crear nueva contraseña</h2>
            <p className="auth-sub">Tu enlace fue verificado. Ahora define tu nueva clave.</p>

            {error ? <div className="alert">{error}</div> : null}
            {msg ? <div className="alert success">{msg}</div> : null}

            <form className="form" onSubmit={onUpdate}>
              <div className="field">
                <div className="label">Nueva contraseña</div>
                <div className="password-wrap">
                  <input
                    className="input"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShow((v) => !v)}
                  >
                    {show ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="field">
                <div className="label">Repetir contraseña</div>
                <input
                  className="input"
                  type={show ? "text" : "password"}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar contraseña"}
              </button>

              <div className="actions" style={{ justifyContent: "space-between" }}>
                <Link className="link" to="/login">Volver al login</Link>
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
