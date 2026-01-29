// src/pages/UpdatePassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import "../styles/auth.css";

export default function UpdatePassword() {
  const nav = useNavigate();
  const { updatePassword } = useAuth();

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");

    if (p1.length < 6) return setErr("La contraseña debe tener al menos 6 caracteres.");
    if (p1 !== p2) return setErr("Las contraseñas no coinciden.");

    setLoading(true);
    const { error } = await updatePassword(p1);
    setLoading(false);

    if (error) {
      setErr(error.message || "No se pudo actualizar la contraseña.");
      return;
    }

    setOk("Contraseña actualizada. Ya puedes iniciar sesión.");
    setTimeout(() => nav("/login"), 700);
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-right">
          <h2 className="title">Nueva contraseña</h2>
          <p className="subtitle">Crea una contraseña nueva para tu cuenta.</p>

          {err ? <div className="error">{err}</div> : null}
          {ok ? <div className="ok">{ok}</div> : null}

          <form className="form" onSubmit={onSubmit}>
            <div>
              <div className="label">Contraseña nueva</div>
              <input className="input" type="password" value={p1} onChange={(e)=>setP1(e.target.value)} required />
            </div>
            <div>
              <div className="label">Confirmar contraseña</div>
              <input className="input" type="password" value={p2} onChange={(e)=>setP2(e.target.value)} required />
            </div>

            <button className="btn" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
