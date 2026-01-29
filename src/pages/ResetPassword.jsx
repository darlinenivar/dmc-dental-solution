import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

export default function ResetPassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Cuando llegas desde el email, supabase setea sesión automáticamente
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        setMsg({
          type: "error",
          text:
            "Tu enlace no está activo o expiró. Vuelve a solicitar la recuperación.",
        });
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!password || password.length < 6) {
      setMsg({ type: "error", text: "Mínimo 6 caracteres." });
      return;
    }
    if (password !== password2) {
      setMsg({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg({ type: "success", text: "Contraseña actualizada ✅" });
      setTimeout(() => nav("/login"), 900);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.message || "No se pudo actualizar. Intenta de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-card">
          <h3>Crear nueva contraseña</h3>
          <p>Escribe tu nueva contraseña para terminar el proceso.</p>

          {msg.text ? (
            <div className={`alert ${msg.type}`}>{msg.text}</div>
          ) : null}

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="field">
              <label>Nueva contraseña</label>
              <input
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label>Confirmar contraseña</label>
              <input
                className="input"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => nav("/login")}
            >
              Volver al login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
