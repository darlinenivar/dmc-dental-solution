import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    color: "#111",
    background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
    fontWeight: isActive ? 700 : 500,
    marginBottom: 6,
  });

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__title">DMC Dental Solution</div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/dashboard/configuracion" style={linkStyle}>Configuración</NavLink>
        <NavLink to="/dashboard/privacidad" style={linkStyle}>Privacidad</NavLink>
      </nav>

      {/* Nota: quitamos "Cambiar contraseña" del menú. Eso vive SOLO dentro de Configuración. */}
    </aside>
  );
}