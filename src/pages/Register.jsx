// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [country, setCountry] = useState("United States");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!firstName.trim() || !lastName.trim()) return setError("Completa nombre y apellido.");
    if (!email.trim()) return setError("Completa tu email.");
    if (pass.length < 6) return setError("La contraseña debe tener mínimo 6 caracteres.");
    if (pass !== pass2) return setError("Las contraseñas no coinciden.");
    if (!clinicName.trim()) return setError("Completa el nombre de la clínica.");

    setLoading(true);
    try {
      const full_name = `${firstName.trim()} ${lastName.trim()}`;

      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: {
            full_name,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim() || null,
            clinic_name: clinicName.trim(),
            country,
          },
        },
      });

      if (err) throw err;

      // Si tu proyecto requiere confirmación por email:
      // data.user existe pero session puede ser null.
      if (!data?.session) {
        setMsg("Cuenta creada ✅ Revisa tu email para confirmar y luego inicia sesión.");
        return;
      }

      setMsg("Cuenta creada ✅ Entrando…");
      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo crear la cuenta.");
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
              <div className="brandSub">Registro premium • Se crea tu clínica automáticamente</div>
            </div>
          </div>

          <div className="checkList">
            <div>✅ 1 sola página para registrarse</div>
            <div>✅ Multi-clínica real (RLS + Supabase)</div>
            <div>✅ Clínica automática al crear cuenta</div>
          </div>

          <p className="muted">
            Completa tus datos y la información de tu clínica. Luego podrás gestionar doctores, pacientes y citas desde el dashboard.
          </p>
          <div className="muted">© 2026 DMC Dental Solution</div>
        </div>

        <div className="authRight">
          <h2>Crear cuenta</h2>
          <p className="muted">Completa tus datos y la información de tu clínica.</p>

          <form onSubmit={onSubmit} className="authForm grid2">
            <div>
              <label>Nombre</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ej: Darline" />
            </div>

            <div>
              <label>Apellido</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ej: Nivar" />
            </div>

            <div>
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>

            <div>
              <label>Teléfono (opcional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 809…" />
            </div>

            <div>
              <label>Contraseña</label>
              <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>

            <div>
              <label>Repetir contraseña</label>
              <input type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="Repite la contraseña" />
            </div>

            <div>
              <label>Nombre de la clínica</label>
              <input value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="Ej: DMC Dental - Manhattan" />
            </div>

            <div>
              <label>País</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option>United States</option>
                <option>Dominican Republic</option>
                <option>Puerto Rico</option>
                <option>Mexico</option>
              </select>
            </div>

            <div className="gridFull">
              <button className="btnPrimary" type="submit" disabled={loading}>
                {loading ? "Creando…" : "Crear mi cuenta"}
              </button>

              <button className="btnGhost" type="button" onClick={() => nav("/login")}>
                Volver al inicio
              </button>
            </div>
          </form>

          {error && <p className="alertError">{error}</p>}
          {msg && <p className="alertOk">{msg}</p>}

          <div className="authLinks">
            <span className="muted">¿Ya tienes cuenta?</span>
            <Link to="/login">Login ahora</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
