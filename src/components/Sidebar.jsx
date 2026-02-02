import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/pacientes", label: "Pacientes", icon: "🧑‍⚕️" },
  { to: "/citas", label: "Citas", icon: "📅" },
  { to: "/doctores", label: "Doctores", icon: "🩺" },
  { to: "/facturacion", label: "Facturación", icon: "🧾" },
  { to: "/configuracion", label: "Configuración", icon: "⚙️" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="logo">DMC</div>
            <div>
              <div className="name">Dental Solution</div>
              <div className="small">Panel</div>
            </div>
          </div>

          <button className="icon-btn close-only-mobile" onClick={onClose} aria-label="Cerrar menú">
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <NavLink className="footerLink" to="/politicas-de-privacidad">
  🔒 Privacidad
</NavLink>


      <div className={`backdrop ${open ? "show" : ""}`} onClick={onClose} />
    </>
  );
}
