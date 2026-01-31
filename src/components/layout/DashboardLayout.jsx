import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/dashboard.css";

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dash">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div className="dash-main">
        <Topbar onToggleSidebar={() => setCollapsed((v) => !v)} />
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
