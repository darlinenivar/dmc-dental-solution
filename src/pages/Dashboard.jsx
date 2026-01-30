import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { user, profile, isSuperAdmin, signOut } = useAuth();

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2>Dashboard</h2>
      <p><b>User:</b> {user?.email}</p>
      <p><b>Role:</b> {profile?.role}</p>
      <p><b>Clinic ID:</b> {profile?.clinic_id ?? "N/A"}</p>
      <p><b>Super Admin:</b> {isSuperAdmin ? "YES" : "NO"}</p>
      <button onClick={signOut}>Cerrar sesión</button>
    </div>
  );
}
