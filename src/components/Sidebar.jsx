// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // <-- SOLO ESTE IMPORT

const MENU = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/patients", label: "Pacientes", icon: "🧑‍🤝‍🧑" },
  { to: "/citas", label: "Citas", icon: "🗓️" },
  { to: "/billing", label: "Facturación", icon: "🧾" },
  { to: "/settings", label: "Configuración", icon: "⚙️" },
];

export default function Sidebar({ collapsed, onToggleCollapse, onCloseMobile }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setEmail(data?.user?.email || "");
    });
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <button className="sidebar-toggle" onClick={onToggleCollapse} type="button">
          {collapsed ? "➡️" : "⬅️"}
        </button>

        {!collapsed && (
          <div className="sidebar-user">
            <div className="sidebar-user-title">Cuenta</div>
            <div className="sidebar-user-email">{email || "—"}</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {MENU.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onCloseMobile}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="btn-logout" onClick={handleLogout} type="button">
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
