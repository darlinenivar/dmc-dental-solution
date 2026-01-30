import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { supabase } from "../supabaseClient";

export default function UpdatePassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErr(error.message);
      return;
    }

    setOk("Contraseña actualizada ✅");
    setTimeout(() => nav("/login"), 800);
  }

  return (
    <AuthLayout
      title="Actualizar contraseña"
      subtitle="Crea una nueva contraseña segura."
    >
      {err && <div className="alert alertError">{err}</div>}
      {ok && <div className="alert alertOk">{ok}</div>}

      <form className="form" onSubmit={onSubmit}>
        <div>
          <label className="label">Nueva contraseña</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="label">Confirmar contraseña</label>
          <input
            className="input"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="actions">
          <button className="btn btnPrimary" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
