import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const MENU = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/patients", label: "Pacientes", icon: "🧑‍⚕️" },
  { to: "/citas", label: "Citas", icon: "📅" },
  { to: "/doctores", label: "Doctores", icon: "🦷" },
  { to: "/billing", label: "Facturación", icon: "🧾" },
  { to: "/settings", label: "Configuración", icon: "⚙️" },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`side ${collapsed ? "collapsed" : ""}`}>
      <div className="side-top">
        <div className="brand">
          <div className="brand-badge">DMC</div>
          {!collapsed && (
            <div className="brand-text">
              <div className="brand-title">DMC Dental</div>
              <div className="brand-sub">Solution</div>
            </div>
          )}
        </div>

        <button className="side-btn" onClick={onToggle}>
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>

      <nav className="side-nav">
        {MENU.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
          >
            <span className="i">{m.icon}</span>
            {!collapsed && <span>{m.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="side-bottom">
        <button className="logout" onClick={handleLogout}>
          <span className="i">🚪</span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
