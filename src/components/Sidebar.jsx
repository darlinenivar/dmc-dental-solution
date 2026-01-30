import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../supabaseClient";

// Menú base (puedes cambiar nombres y rutas cuando quieras)
const MENU = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/patients", label: "Pacientes", icon: "🧑‍⚕️" },
  { to: "/appointments", label: "Citas", icon: "📅" },
  { to: "/odontogram", label: "Odontograma", icon: "🦷" },
  { to: "/billing", label: "Facturación", icon: "🧾" },
  { to: "/settings", label: "Configuración", icon: "⚙️" }
];

// Solo super admin (si luego quieres que también lo vea admin, se cambia)
const SUPER_ADMIN_MENU = [
  { to: "/admin", label: "Super Admin", icon: "🛡️" }
];

export default function Sidebar({ collapsed, onToggleCollapse, onCloseMobile }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role, clinic_id")
        .eq("id", user.id)
        .maybeSingle();

      if (!active) return;

      if (!error) setProfile(data || null);
    };

    loadProfile();
    return () => { active = false; };
  }, []);

  const isSuperAdmin = useMemo(() => profile?.role === "super_admin", [profile]);

  const items = useMemo(() => {
    return isSuperAdmin ? [...MENU, ...SUPER_ADMIN_MENU] : MENU;
  }, [isSuperAdmin]);

  const displayName = useMemo(() => {
    const fn = profile?.first_name?.trim();
    const ln = profile?.last_name?.trim();
    const name = [fn, ln].filter(Boolean).join(" ");
    return name || "Usuario";
  }, [profile]);

  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <div className="brand">
          <div className="brandLogo">DMC</div>
          {!collapsed && (
            <div className="brandText">
              <div className="brandTitle">DMC Dental</div>
              <div className="brandSubtitle">Multi-clínicas • Roles</div>
            </div>
          )}
        </div>

        <div className="sidebarActions">
          <button className="iconBtn" onClick={onToggleCollapse} title="Colapsar sidebar">
            {collapsed ? "➡️" : "⬅️"}
          </button>
          <button className="iconBtn mobileOnly" onClick={onCloseMobile} title="Cerrar">
            ✖️
          </button>
        </div>
      </div>

      <nav className="nav">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) => `navItem ${isActive ? "active" : ""}`}
            onClick={onCloseMobile}
          >
            <span className="navIcon">{it.icon}</span>
            {!collapsed && <span className="navLabel">{it.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebarFooter">
        <div className="userCard">
          <div className="userAvatar">{displayName.slice(0, 1).toUpperCase()}</div>
          {!collapsed && (
            <div className="userMeta">
              <div className="userName">{displayName}</div>
              <div className="userRole">
                {profile?.role ? profile.role.replace("_", " ") : "—"}
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="sidebarTip">
            Tip: Usa “Configuración” para personalizar clínica y usuarios.
          </div>
        )}
      </div>
    </div>
  );
}
