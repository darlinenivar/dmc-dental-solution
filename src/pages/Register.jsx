import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { supabase } from "../supabaseClient";

export default function Register() {
  const nav = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [country, setCountry] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    // 1) Sign up
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      setErr(error.message);
      return;
    }

    const userId = data?.user?.id;
    if (!userId) {
      setLoading(false);
      setErr("No se pudo obtener el usuario. Intenta iniciar sesión.");
      return;
    }

    // 2) Crear clínica
    const { data: clinicRow, error: clinicErr } = await supabase
      .from("clinics")
      .insert({ name: clinicName.trim(), country: country.trim() })
      .select("*")
      .single();

    if (clinicErr) {
      setLoading(false);
      setErr("Error creando clínica: " + clinicErr.message);
      return;
    }

    // 3) Crear perfil
    const { error: profileErr } = await supabase.from("profiles").insert({
      id: userId,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      role: "clinic_admin",
      clinic_id: clinicRow.id,
    });

    setLoading(false);

    if (profileErr) {
      setErr("Error creando perfil: " + profileErr.message);
      return;
    }

    setOk("Cuenta creada ✅ Ahora inicia sesión.");
    setTimeout(() => nav("/login"), 800);
  }

  return (
    <AuthLayout
      title="Crear usuario"
      subtitle="Completa tus datos y los de tu clínica."
    >
      {err && <div className="alert alertError">{err}</div>}
      {ok && <div className="alert alertOk">{ok}</div>}

      <form className="form" onSubmit={onSubmit}>
        <div className="row2">
          <div>
            <label className="label">Nombre</label>
            <input className="input" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Apellido</label>
            <input className="input" value={lastName} onChange={(e)=>setLastName(e.target.value)} required />
          </div>
        </div>

        <div className="row2">
          <div>
            <label className="label">Teléfono</label>
            <input className="input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+1..." />
          </div>
          <div>
            <label className="label">País</label>
            <input className="input" value={country} onChange={(e)=>setCountry(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="label">Nombre de la clínica</label>
          <input className="input" value={clinicName} onChange={(e)=>setClinicName(e.target.value)} required />
        </div>

        <div className="row2">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
        </div>

        <div className="actions">
          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear usuario"}
          </button>

          <Link className="btn btnGhost" to="/login">
            Volver
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
