import React from "react";

export default function Placeholder({ title = "En construcción" }) {
  return (
    <div style={{ padding: 18 }}>
      <div
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,.06)",
          borderRadius: 14,
          padding: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,.04)",
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p style={{ opacity: 0.7, marginTop: 8 }}>
          Esta sección está lista para conectar con Supabase y dejarla PRO.
        </p>
      </div>
    </div>
  );
}
