import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // NO tocamos la lógica base: loading + error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ tu login con supabase (mantenerlo simple y estable)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // opcional: “recordarme” (no obligatorio; supabase ya maneja sesión)
      // si quieres forzar persistencia, supabase ya usa localStorage por defecto.

      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Error iniciando sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-shell">
        <div className="auth-grid">
          {/* LEFT (premium info) */}
          <div className="auth-left">
            <div className="brand">
              <div className="brand-badge">DMC</div>
              <div className="brand-title">
                <b>DMC Dental Solution</b>
                <span>Accede a tu clínica • Seguro • Multi-clínica</span>
              </div>
            </div>

            <div className="pills">
              <div className="pill">🔒 <b>Acceso seguro</b> <small>con Supabase</small></div>
              <div className="pill">🏥 <b>Multi-clínica</b> <small>con permisos</small></div>
              <div className="pill">⚡ <b>Diseño</b> <small>premium + rápido</small></div>
            </div>

            <div className="hr" />

            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
              Si olvidaste tu contraseña, puedes recuperarla en segundos.
              Tu enlace se abrirá dentro del mismo dominio.
            </p>

            <div className="footer">© {new Date().getFullYear()} DMC Dental Solution</div>
          </div>

          {/* RIGHT (form) */}
          <div className="auth-right">
            <h2 className="auth-title">Iniciar sesión</h2>
            <p className="auth-sub">Bienvenido/a. Ingresa tus credenciales.</p>

            {error ? <div className="alert">{error}</div> : null}

            <form className="form" onSubmit={handleLogin}>
              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@clinica.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <div className="label">Contraseña</div>
                <div className="password-wrap">
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="actions">
                <label style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--muted)", fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Recordarme
                </label>

                <Link className="link" to="/forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </button>

              <div className="actions" style={{ justifyContent: "center", marginTop: 6 }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>¿No tienes cuenta?</span>
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
