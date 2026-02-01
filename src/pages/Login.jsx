import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setMsg(err?.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20 }}>Iniciar sesión</h1>
        <p style={{ marginTop: 6, color: "#6b7280", fontSize: 13 }}>
          Accede a tu panel de DMC Dental Solution.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, marginTop: 10 }}>
          <label style={{ fontSize: 13, fontWeight: 700 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="tuemail@correo.com"
            required
            style={inputStyle}
          />

          <label style={{ fontSize: 13, fontWeight: 700 }}>Contraseña</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            required
            style={inputStyle}
          />

          {msg ? (
            <div style={{ color: "#b91c1c", fontSize: 13, marginTop: 2 }}>{msg}</div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              height: 40,
              borderRadius: 12,
              border: "1px solid #111827",
              background: "#111827",
              color: "#fff",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  height: 40,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  padding: "0 12px",
  outline: "none",
};
