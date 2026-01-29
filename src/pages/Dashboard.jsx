// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2>Dashboard</h2>
      <p>Sesión iniciada como: <b>{user?.email}</b></p>

      <button
        onClick={signOut}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #cbd5e1",
          background: "white",
          cursor: "pointer",
          fontWeight: 700
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
}
