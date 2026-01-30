import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages (ejemplo)
import DashboardHome from "./pages/DashboardHome";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* agrega más cuando quieras */}
      </Route>

      {/* login/register etc */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  );
}
