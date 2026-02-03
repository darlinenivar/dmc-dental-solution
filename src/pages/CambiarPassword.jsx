import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function CambiarPassword() {
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function updatePassword() {
    setError("");
    setMsg("");

    if (pass1.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }
    if (pass1 !== pass2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: pass1 });
      if (error) throw error;

      setMsg("✅ Contraseña actualizada correctamente.");
      setPass1("");
      setPass2("");
    } catch (e) {
      setError(e.message || "Error actualizando contraseña.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h1>Cambiar contraseña</h1>
      <p style={{ color: "#555" }}>
        Esto actualiza tu contraseña en Supabase Auth.
      </p>

      <label style={{ display: "block", marginTop: 12 }}>
        <span style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
          Nueva contraseña
        </span>
        <input
          type="password"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
          }}
        />
      </label>

      <label style={{ display: "block", marginTop: 12 }}>
        <span style={{ display: "block", fontSize: 13, marginBottom: 6 }}>
          Confirmar contraseña
        </span>
        <input
          type="password"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
          }}
        />
      </label>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button
          onClick={updatePassword}
          disabled={saving}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "none",
            background: "#111827",
            color: "#fff",
            cursor: "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Guardando..." : "Actualizar"}
        </button>

        <Link to="/dashboard/configuracion" style={{ alignSelf: "center" }}>
          ← Volver
        </Link>
      </div>

      {error ? (
        <div
          style={{
            marginTop: 14,
            padding: 10,
            borderRadius: 12,
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#7f1d1d",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      ) : null}

      {msg ? (
        <div
          style={{
            marginTop: 14,
            padding: 10,
            borderRadius: 12,
            background: "#dcfce7",
            border: "1px solid #bbf7d0",
            color: "#14532d",
            fontSize: 13,
          }}
        >
          {msg}
        </div>
      ) : null}
    </div>
  );
}
