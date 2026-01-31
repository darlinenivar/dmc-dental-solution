// src/layout/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dash-shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onCloseMobile={() => {}}
      />
      <div className="dash-main">
        <Topbar />
        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
