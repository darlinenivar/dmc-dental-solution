import { NavLink } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import { useUIState } from "../../hooks/useUIState";

export default function Sidebar() {
  const { profile, clinic } = useProfile();
  const { sidebarOpen } = useUIState();

  const isSuperAdmin = profile?.role === "super_admin";

  return (
    <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
      <div className="sidebarHeader">
        <div className="logo">DMC</div>
        {sidebarOpen && (
          <div>
            <div className="clinicName">
              {isSuperAdmin ? "Super Admin" : clinic?.name}
            </div>
            <small>{profile?.role}</small>
          </div>
        )}
      </div>

      <nav className="menu">
        <NavLink to="/dashboard">🏠 Dashboard</NavLink>
        <NavLink to="/patients">🦷 Pacientes</NavLink>
        <NavLink to="/appointments">📅 Citas</NavLink>
        <NavLink to="/billing">💳 Facturación</NavLink>

        {isSuperAdmin && (
          <>
            <div className="menuTitle">ADMIN</div>
            <NavLink to="/admin/clinics">🏥 Clínicas</NavLink>
            <NavLink to="/admin/users">👥 Usuarios</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}
