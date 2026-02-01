import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7fb" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 22 }}>
        <Outlet />
      </main>
    </div>
  );
}
