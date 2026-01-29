import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

/**
 * IMPORTANTE (multiclínicas):
 * - Aquí creamos el usuario en Auth.
 * - Luego intentamos guardar datos en tablas (si existen):
 *   - clinics (id, name, country, created_by)
 *   - profiles (id, first_name, last_name, phone, role)
 *   - clinic_members (clinic_id, user_id, role)
 *
 * Si aún no tienes tablas, igual funcionará el signup (Auth),
 * y luego hacemos la parte de DB cuando me digas.
 */

export default function Register() {
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [clinicName, setClinicName] = useState("");
  const [clinicCountry, setClinicCountry] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!firstName || !lastName || !phone || !clinicName || !clinicCountry || !email || !password) {
      setMsg({ type: "error", text: "Completa todos los campos." });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "La contraseña debe tener mínimo 6 caracteres." });
      return;
    }

    try {
      setLoading(true);

      // 1) Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            clinic_name: clinicName,
            clinic_country: clinicCountry,
          },
        },
      });

      if (error) throw error;

      // 2) Intentar crear registros en DB (si existen)
      // (Si no existen, no rompemos el flujo)
      const userId = data?.user?.id;

      if (userId) {
        // profile
        await supabase
          .from("profiles")
          .upsert({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            phone,
            role: "clinic_admin", // primer usuario de esa clínica = admin de clínica
          })
          .throwOnError()
          .catch(() => null);

        // clinic
        const clinicInsert = await supabase
          .from("clinics")
          .insert({
            name: clinicName,
            country: clinicCountry,
            created_by: userId,
          })
          .select("id")
          .single()
          .catch(() => null);

        const clinicId = clinicInsert?.data?.id;

        // membership
        if (clinicId) {
          await supabase
            .from("clinic_members")
            .insert({
              clinic_id: clinicId,
              user_id: userId,
              role: "clinic_admin",
            })
            .catch(() => null);
        }
      }

      setMsg({
        type: "success",
        text:
          "Usuario creado ✅ Revisa tu email para confirmar la cuenta (si tu proyecto lo requiere).",
      });

      setTimeout(() => nav("/login"), 1100);
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err?.message ||
          "No se pudo crear el usuario. Verifica los datos e intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-card">
          <h3>Crear usuario</h3>
          <p>Registro para multiclínicas (nombre, contacto y clínica)</p>

          {msg.text ? (
            <div className={`alert ${msg.type}`}>{msg.text}</div>
          ) : null}

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="row-2">
              <div className="field">
                <label>Nombre</label>
                <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="field">
                <label>Apellido</label>
                <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label>Teléfono</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 000 000 0000" />
              </div>
              <div className="field">
                <label>Correo</label>
                <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label>Clínica (nombre)</label>
                <input className="input" value={clinicName} onChange={(e) => setClinicName(e.target.value)} />
              </div>
              <div className="field">
                <label>Clínica (país)</label>
                <input className="input" value={clinicCountry} onChange={(e) => setClinicCountry(e.target.value)} placeholder="USA / RD / PR..." />
              </div>
            </div>

            <div className="field">
              <label>Contraseña</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Creando..." : "Crear usuario"}
            </button>

            <button type="button" className="btn btn-ghost" onClick={() => nav("/login")}>
              Volver al login
            </button>
          </form>

          <p className="small-note">
            Nota: como eres <b>Super Admin</b>, luego te hago el panel para:
            crear clínicas, invitar usuarios, asignar roles y ver todo por clínica.
          </p>
        </div>
      </div>
    </div>
  );
}
