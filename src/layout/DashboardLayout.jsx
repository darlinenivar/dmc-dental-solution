import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    if (window.innerWidth < 900) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth < 900) setMobileOpen(false);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      // 1) Cierra sesión en Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 2) Cierra sidebar móvil (por si estaba abierto)
      closeMobileSidebar();

      // 3) Redirige a login
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout error:", err?.message || err);
      // Si falla, igual intenta mandar al login (no te dejes trancada)
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside
        className={`sidebar ${collapsed ? "collapsed" : ""} ${
          mobileOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">DMC</div>
          <span>DMC Dental</span>
        </div>

        <nav className="sidebar-nav" onClick={closeMobileSidebar}>
          <NavLink to="/dashboard">🏠 <span>Dashboard</span></NavLink>
          <NavLink to="/pacientes">🦷 <span>Pacientes</span></NavLink>
          <NavLink to="/citas">📅 <span>Citas</span></NavLink>
          <NavLink to="/doctores">👨‍⚕️ <span>Doctores</span></NavLink>
          <NavLink to="/facturacion">💳 <span>Facturación</span></NavLink>
          <NavLink to="/configuracion">⚙️ <span>Configuración</span></NavLink>

          {/* Logout */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLogout();
            }}
            disabled={loggingOut}
            style={{
              marginTop: 10,
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: "none",
              color: "inherit",
              padding: "12px 14px",
              borderRadius: 12,
              cursor: loggingOut ? "not-allowed" : "pointer",
              opacity: loggingOut ? 0.7 : 1,
            }}
          >
            🚪 <span>{loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="toggle-btn" onClick={toggleSidebar}>
              ☰
            </button>
            <strong>DMC Dental Solution</strong>
          </div>

          <div className="topbar-right">
            <span>Cuenta activa</span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
