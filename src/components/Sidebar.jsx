// src/components/Sidebar.jsx
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const MENU = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/pacientes", label: "Pacientes", icon: "🧑‍⚕️" },
  { to: "/citas", label: "Citas", icon: "📅" },
  { to: "/facturacion", label: "Facturación", icon: "🧾" },
  { to: "/settings", label: "Configuración", icon: "⚙️" },
];

export default function Sidebar({ collapsed, onToggleCollapse, onCloseMobile }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      setEmail(data?.user?.email || "");
    });
    return () => {
      alive = false;
    };
  }, []);

  const shortEmail = useMemo(() => {
    if (!email) return "Cuenta";
    return email.length > 22 ? `${email.slice(0, 22)}…` : email;
  }, [email]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    nav("/login", { replace: true });
  };

  return (
    <aside className={`sb ${collapsed ? "sb--collapsed" : ""}`}>
      <div className="sb__top">
        <div className="sb__brand" onClick={() => nav("/dashboard")}>
          <div className="sb__logo">DMC</div>
          {!collapsed && <div className="sb__title">Dental Solution</div>}
        </div>

        <button className="sb__collapse" type="button" onClick={onToggleCollapse}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="sb__nav">
        {MENU.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sb__link ${isActive ? "is-active" : ""}`}
            onClick={onCloseMobile}
          >
            <span className="sb__icon">{item.icon}</span>
            {!collapsed && <span className="sb__label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sb__bottom">
        {!collapsed && <div className="sb__user">{shortEmail}</div>}
        <button className="sb__logout" type="button" onClick={handleLogout}>
          {!collapsed ? "Cerrar sesión" : "⎋"}
        </button>
      </div>
    </aside>
  );
}
