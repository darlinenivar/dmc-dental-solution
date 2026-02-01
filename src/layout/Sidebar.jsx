import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: isActive ? "#111827" : "#374151",
  background: isActive ? "#eef2ff" : "transparent",
  fontWeight: isActive ? 800 : 650,
  fontSize: 14,
});

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        padding: 14,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "#111827",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 14,
          }}
        >
          DMC
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 14, lineHeight: 1 }}>Dental Solution</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Panel</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <NavLink to="/dashboard" style={linkStyle}>🏠 Dashboard</NavLink>
        <NavLink to="/pacientes" style={linkStyle}>🧑‍🤝‍🧑 Pacientes</NavLink>
        <NavLink to="/citas" style={linkStyle}>📅 Citas</NavLink>
        <NavLink to="/doctores" style={linkStyle}>🩺 Doctores</NavLink>
        <NavLink to="/facturacion" style={linkStyle}>🧾 Facturación</NavLink>
        <NavLink to="/dashboard/configuracion" style={linkStyle}>⚙️ Configuración</NavLink>
      </nav>
    </aside>
  );
}
