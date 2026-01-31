// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const MENU = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/patients", label: "Pacientes", icon: "🧑‍🤝‍🧑" },
  { to: "/citas", label: "Citas", icon: "📅" },
  { to: "/doctores", label: "Doctores", icon: "🦷" },
  { to: "/billing", label: "Facturación", icon: "🧾" },
  { to: "/settings", label: "Configuración", icon: "⚙️" },
];

const SUPER_ADMIN_MENU = [{ to: "/admin", label: "Super Admin", icon: "🛡️" }];

export default function Sidebar({ collapsed, onToggleCollapse, onCloseMobile }) {
  const nav = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    let alive = true;

    const loadRole = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return;

      // opcional: si guardas role en profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!alive) return;
      if (!error) setRole(data?.role ?? null);
    };

    loadRole();
    return () => {
      alive = false;
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <button className="sidebar-toggle" onClick={onToggleCollapse}>
          {collapsed ? "➡️" : "⬅️"}
        </button>

        <button className="sidebar-close-mobile" onClick={onCloseMobile}>
          ✖
        </button>
      </div>

      <nav className="sidebar-nav">
        {MENU.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onCloseMobile}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {role === "super_admin" &&
          SUPER_ADMIN_MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={onCloseMobile}
            >
              <span className="icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="logout-btn" onClick={handleLogout}>
          {!collapsed ? "Cerrar sesión" : "🚪"}
        </button>
      </div>
    </aside>
  );
}
