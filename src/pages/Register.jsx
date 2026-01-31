import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [pais, setPais] = useState("United States");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const redirectTo = useMemo(() => {
    // cuando confirman email (si lo tienes habilitado)
    return `${window.location.origin}/login`;
  }, []);

  const onRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (password.length < 6) return setError("La contraseña debe tener mínimo 6 caracteres.");
    if (password !== password2) return setError("Las contraseñas no coinciden.");
    if (!clinicName.trim()) return setError("Escribe el nombre de la clínica.");

    setLoading(true);

    try {
      // ✅ Sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            first_name: nombre,
            last_name: apellido,
            phone: telefono || null,
            clinic_name: clinicName,
            country: pais,
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Nota: si tienes confirmación de email ON, supabase manda correo.
      // Si la tienes OFF, puedes entrar directo.
      setMsg("Cuenta creada. Si tu proyecto requiere confirmación, revisa tu email. Luego inicia sesión.");

      // Si quieres navegar de una vez:
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err?.message || "No se pudo crear la cuenta.");
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
                <span>Registro premium • Se crea tu clínica automáticamente</span>
              </div>
            </div>

            <div className="pills">
              <div className="pill">✅ <b>1 sola página</b> <small>para registrarse</small></div>
              <div className="pill">✅ <b>Multi-clínica</b> <small>real (RLS + Supabase)</small></div>
              <div className="pill">✅ <b>Clínica automática</b> <small>al crear cuenta</small></div>
            </div>

            <div className="hr" />

            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>
              Completa tus datos y la información de tu clínica. Luego podrás gestionar doctores,
              pacientes y citas desde el dashboard.
            </p>

            <div className="footer">© {new Date().getFullYear()} DMC Dental Solution</div>
          </div>

          <div className="auth-right">
            <h2 className="auth-title">Crear cuenta</h2>
            <p className="auth-sub">Completa tus datos y la información de tu clínica.</p>

            {error ? <div className="alert">{error}</div> : null}
            {msg ? <div className="alert success">{msg}</div> : null}

            <form className="form" onSubmit={onRegister}>
              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <div className="label">Nombre</div>
                  <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Darline" required />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <div className="label">Apellido</div>
                  <input className="input" value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Ej: Nivar" required />
                </div>
              </div>

              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <div className="label">Email</div>
                  <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <div className="label">Teléfono (opcional)</div>
                  <input className="input" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+1 809..." />
                </div>
              </div>

              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <div className="label">Contraseña</div>
                  <div className="password-wrap">
                    <input
                      className="input"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required
                    />
                    <button type="button" className="password-toggle" onClick={() => setShow((v) => !v)}>
                      {show ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>
                <div className="field" style={{ flex: 1 }}>
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
              </div>

              <div className="row">
                <div className="field" style={{ flex: 1 }}>
                  <div className="label">Nombre de la clínica</div>
                  <input
                    className="input"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="Ej: DMC Dental - Manhattan"
                    required
                  />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <div className="label">País</div>
                  <select className="input" value={pais} onChange={(e) => setPais(e.target.value)}>
                    <option>United States</option>
                    <option>Dominican Republic</option>
                    <option>Puerto Rico</option>
                    <option>Mexico</option>
                    <option>Colombia</option>
                    <option>Spain</option>
                  </select>
                </div>
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear mi cuenta"}
              </button>

              {/* ✅ Botón volver al inicio */}
              <button className="btn-ghost" type="button" onClick={() => navigate("/login")}>
                Volver al inicio
              </button>

              <div className="actions" style={{ justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>¿Ya tienes cuenta?</span>
                <Link className="link" to="/login">Login ahora</Link>
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
