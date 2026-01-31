import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/login.css";

export default function Register() {
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [country, setCountry] = useState("United States");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (password !== password2) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Signup Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { firstName, lastName, phone, country, clinicName },
        },
      });

      if (error) {
        setErr(error.message);
        return;
      }

      // Si tu trigger crea la clínica automáticamente, aquí NO hacemos nada más.
      // Si no tienes trigger, aquí es donde crearíamos clinics + membership.

      setMsg("Cuenta creada ✅ Revisa tu email si Supabase requiere confirmación.");
      // Puedes enviar al login:
      nav("/login", { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Error creando cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-shell">
        <div className="auth-card">
          <div className="auth-left">
            <div className="brand-row">
              <div className="brand-logo">DMC</div>
              <div>
                <div className="brand-title">DMC Dental Solution</div>
                <div className="brand-subtitle">
                  Registro premium • Se crea tu clínica automáticamente
                </div>
              </div>
            </div>

            <div className="list">
              <div className="list-item">✅ 1 sola página para registrarse</div>
              <div className="list-item">✅ Multi-clínica real (RLS + Supabase)</div>
              <div className="list-item">✅ Clínica automática al crear cuenta</div>
            </div>

            <div className="hint">
              Completa tus datos y la información de tu clínica. Luego podrás gestionar doctores, pacientes y citas desde el dashboard.
            </div>
          </div>

          <div className="auth-right">
            <h2 className="auth-h">Crear cuenta</h2>
            <p className="auth-p">Completa tus datos y la información de tu clínica.</p>

            {err ? <div className="auth-error">{err}</div> : null}
            {msg ? <div className="auth-success">{msg}</div> : null}

            <form onSubmit={onSubmit} className="auth-form">
              <div className="grid2">
                <div>
                  <label className="auth-label">Nombre</label>
                  <input className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ej: Darline" />
                </div>
                <div>
                  <label className="auth-label">Apellido</label>
                  <input className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ej: Nivar" />
                </div>
              </div>

              <div className="grid2">
                <div>
                  <label className="auth-label">Email</label>
                  <input className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" />
                </div>
                <div>
                  <label className="auth-label">Teléfono (opcional)</label>
                  <input className="auth-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 809..." />
                </div>
              </div>

              <div className="grid2">
                <div>
                  <label className="auth-label">Contraseña</label>
                  <input className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" type="password" autoComplete="new-password" />
                </div>
                <div>
                  <label className="auth-label">Repetir contraseña</label>
                  <input className="auth-input" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Repite la contraseña" type="password" autoComplete="new-password" />
                </div>
              </div>

              <div className="grid2">
                <div>
                  <label className="auth-label">Nombre de la clínica</label>
                  <input className="auth-input" value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="Ej: DMC Dental - Manhattan" />
                </div>
                <div>
                  <label className="auth-label">País</label>
                  <select className="auth-input" value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option>United States</option>
                    <option>Dominican Republic</option>
                    <option>Puerto Rico</option>
                    <option>Mexico</option>
                    <option>Colombia</option>
                  </select>
                </div>
              </div>

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Creando..." : "Crear mi cuenta"}
              </button>
            </form>

            {/* ✅ AQUÍ el botón que pediste */}
            <div className="auth-footer spread">
              <Link className="auth-link" to="/login">
                Volver al inicio
              </Link>

              <Link className="auth-link strong" to="/login">
                Login ahora
              </Link>
            </div>

            <div className="auth-copy">© {new Date().getFullYear()} DMC Dental Solution</div>
          </div>
        </div>
      </div>
    </div>
  );
}
