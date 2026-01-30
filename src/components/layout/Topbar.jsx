import { supabase } from "../../supabaseClient";
import { useProfile } from "../../hooks/useProfile";
import { useUIState } from "../../hooks/useUIState";

export default function Topbar() {
  const { profile } = useProfile();
  const { toggleSidebar } = useUIState();

  async function logout() {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <header className="topbar">
      <div className="left">
        <button className="iconBtn" onClick={toggleSidebar}>
          ☰
        </button>
        <span>Panel de Control</span>
      </div>

      <div className="right">
        <span>
          {profile?.first_name} {profile?.last_name}
        </span>
        <button className="logoutBtn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
