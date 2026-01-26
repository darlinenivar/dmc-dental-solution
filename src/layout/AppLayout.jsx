import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

import "../styles/sidebar.css";
import "../styles/dashboard.css";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
