import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/settings.css";

export default function CambiarPassword() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const validate = () => {
    if (password.length < 8) return "La contraseña debe tener mínimo 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "Incluye al menos 1 letra MAYÚSCULA.";
    if (!/[0-9]/.test(password)) return "Incluye al menos 1 número.";
    if (password !== password2) return "Las contraseñas no coinciden.";
    return "";
  };

  const onSave = async () => {
    const err = validate();
    if (err) return setMsg("❌ " + err);

    try {
      setBusy(true);
      setMsg("");

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setMsg("❌ No hay sesión activa. Vuelve a iniciar sesión.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setPassword("");
      setPassword2("");
      setMsg("✅ Contraseña actualizada correctamente.");
    } catch (e) {
      console.error(e);
      setMsg("❌ No se pudo cambiar la contraseña. Revisa consola.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Cambiar contraseña</h1>
          <p className="settings-subtitle">
            Recomendado: mínimo 8 caracteres, 1 mayúscula y 1 número.
          </p>
        </div>
        <div className="badge">🔒 Security</div>
      </div>

      <div className="card">
        <div className="grid-2">
          <div className="row">
            <div className="label">Nueva contraseña</div>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Tip: usa frases + números (Ej: <span className="kbd">Dmc2026!Clinica</span>)
            </div>
          </div>

          <div className="row">
            <div className="label">Confirmar contraseña</div>
            <input className="input" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="••••••••" />
          </div>
        </div>

        <div className="flex" style={{ marginTop: 14 }}>
          <button className="btn btn-primary" onClick={onSave} disabled={busy} type="button">
            {busy ? "Guardando..." : "Guardar cambios"}
          </button>
          {msg ? <div className="notice" style={{ flex: 1 }}>{msg}</div> : null}
        </div>
      </div>
    </div>
  );
}
