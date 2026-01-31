import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import RequireAuth from "./auth/RequireAuth";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import AuthCallback from "./pages/AuthCallback";

// Layout
import DashboardLayout from "./layout/DashboardLayout";

// Private pages
import DashboardHome from "./pages/DashboardHome";
import Pacientes from "./pages/Pacientes";
import PacienteDetalle from "./pages/PacienteDetalle";
import Citas from "./pages/Citas";
import Doctores from "./pages/Doctores";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* PRIVATE */}
<Route
  element={
    <RequireAuth>
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    </RequireAuth>
  }
/>

<Route
  path="/dashboard"
  element={
    <RequireAuth>
      <DashboardLayout>
        <DashboardHome />
      </DashboardLayout>
    </RequireAuth>
  }
/>


        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
{/* PRIVATE */}
