import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const LS_COLLAPSED = "dmc.sidebar.collapsed.v1";
const LS_MOBILE_OPEN = "dmc.sidebar.mobileOpen.v1";
const LS_GROUPS = "dmc.sidebar.groups.v1";

const NAV = [
  { label: "Dashboard", to: "/dashboard", icon: "🏠" },

  {
    label: "Mi centro / My clinic",
    icon: "🏥",
    group: "clinic",
    children: [
      { label: "Doctor/a", to: "/my-clinic/doctor", icon: "🩺" },
      { label: "Pacientes", to: "/my-clinic/patients", icon: "👥" },
      { label: "Procedimientos", to: "/my-clinic/procedimientos", icon: "🧾" },
      { label: "Seguro médico", to: "/my-clinic/seguro", icon: "🛡️" },
      { label: "Método de pago", to: "/my-clinic/metodos-pago", icon: "💳" },
      { label: "Odontograma", to: "/my-clinic/odontograma", icon: "🦷" },
      { label: "Finanzas", to: "/my-clinic/finanzas", icon: "📈" },
      { label: "Backup", to: "/my-clinic/backup", icon: "☁️" },
      { label: "Facturación", to: "/my-clinic/facturacion", icon: "🧾" },
    ],
  },

  { label: "Citas", to: "/appointments", icon: "📅" },

  {
    label: "Configuración",
    icon: "⚙️",
    group: "settings",
    children: [
      { label: "Importar paciente", to: "/settings/import", icon: "⬇️" },
      { label: "Cambiar contraseña", to: "/settings/password", icon: "🔒" },
      { label: "Suscripción", to: "/settings/subscription", icon: "⭐" },
      { label: "App configuration", to: "/settings/app", icon: "🧩" },
      { label: "Conectar equipos", to: "/settings/devices", icon: "🔌" },
    ],
  },

  { label: "Políticas de privacidad", to: "/privacy", icon: "📄" },
  { label: "Compartir con amigos", to: "/share", icon: "🤝" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_COLLAPSED) || "false");
    } catch {
      return false;
    }
  });

  const [mobileOpen, setMobileOpen] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_MOBILE_OPEN) || "false");
    } catch {
      return false;
    }
  });

  const [groups, setGroups] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_GROUPS) || "{}");
    } catch {
      return {};
    }
  });

  useEffect(() => localStorage.setItem(LS_COLLAPSED, JSON.stringify(collapsed)), [collapsed]);
  useEffect(() => localStorage.setItem(LS_MOBILE_OPEN, JSON.stringify(mobileOpen)), [mobileOpen]);
  useEffect(() => localStorage.setItem(LS_GROUPS, JSON.stringify(groups)), [groups]);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const sidebarClass = useMemo(() => {
    const cls = ["sidebar"];
    if (collapsed) cls.push("collapsed");
    if (mobileOpen) cls.push("mobile-open");
    return cls.join(" ");
  }, [collapsed, mobileOpen]);

  const toggleGroup = (key) => setGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  // ✅ Logout robusto
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpieza fuerte
      localStorage.removeItem("dmc_user");
      localStorage.removeItem("dmc_token");
      localStorage.removeItem("dmc.activeClinicId.v1");
      localStorage.removeItem(LS_MOBILE_OPEN);

      setMobileOpen(false);
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Logout error:", e);
      alert("No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? "show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={sidebarClass}>
        <div className="sidebar-brand">
          <div className="brand-logo">DMC</div>
          {!collapsed && (
            <div className="brand-text">
              <div className="brand-title">Dental Solution</div>
            </div>
          )}
        </div>

        <div className="sidebar-actions">
          <button
            className="sbtn hide-mobile"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "Expandir" : "Colapsar"}
            type="button"
          >
            {collapsed ? "⟩" : "⟨"}
          </button>

          <button
            className="sbtn show-mobile"
            onClick={() => setMobileOpen(false)}
            title="Cerrar"
            type="button"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => {
            if (!item.children) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                >
                  <span className="nav-ico">{item.icon}</span>
                  {!collapsed && <span className="nav-label">{item.label}</span>}
                </NavLink>
              );
            }

            const isOpen = !!groups[item.group];

            return (
              <div key={item.group} className="nav-group">
                <button
                  className={`nav-item nav-group-btn ${isOpen ? "open" : ""}`}
                  onClick={() => toggleGroup(item.group)}
                  type="button"
                >
                  <span className="nav-ico">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-chevron">{isOpen ? "▾" : "▸"}</span>
                    </>
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div className="nav-children">
                    {item.children.map((ch) => (
                      <NavLink
                        key={ch.to}
                        to={ch.to}
                        className={({ isActive }) => `nav-child ${isActive ? "active" : ""}`}
                      >
                        <span className="nav-ico small">{ch.icon}</span>
                        <span className="nav-label">{ch.label}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <>
              <div className="footer-pill">
                <span className="dot" />
                Online
              </div>
              <div className="footer-small">v1.0 • DMC Extra Premium</div>
            </>
          )}

          <button
            className="nav-item logout-btn"
            onClick={handleLogout}
            type="button"
            style={{ marginTop: 10 }}
          >
            <span className="nav-ico">🚪</span>
            {!collapsed && <span className="nav-label">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      <button
        className="mobile-fab show-mobile"
        onClick={() => setMobileOpen(true)}
        type="button"
      >
        ☰
      </button>
    </>
  );
}
