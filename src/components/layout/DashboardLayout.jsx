import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useProfile } from "../../hooks/useProfile";
import { useUIState } from "../../hooks/useUIState";

export default function DashboardLayout({ children }) {
  const { loading } = useProfile();
  const { sidebarOpen } = useUIState();

  if (loading) {
    return (
      <div style={{ padding: 40, fontSize: 18 }}>
        Cargando sistema...
      </div>
    );
  }

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
