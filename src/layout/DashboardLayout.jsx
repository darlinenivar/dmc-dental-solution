import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="dash">
      {/* Sidebar */}
      <aside className="side">
        <div className="side-brand">
          <div className="side-badge">DMC</div>
          <div className="side-title">
            <b>DMC Dental</b>
            <span>Dashboard</span>
          </div>
        </div>

        <nav className="side-nav">
          <NavLink to="/dashboard" className="side-link">
            🏠 Inicio
          </NavLink>
          {/* agrega tus links reales aquí */}
        </nav>

        <button className="side-logout" onClick={onLogout}>
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* Content */}
      <main className="main">
        <div className="topbar">
          <div className="topbar-left">
            <b>Panel</b>
            <span>• DMC Dental Solution</span>
          </div>

          <div className="topbar-right">
            <button className="topbar-btn" onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
