import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ OJO: layout (singular)
import DashboardLayout from "./layout/DashboardLayout";

// Auth
import RequireAuth from "./auth/RequireAuth";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import AuthCallback from "./pages/AuthCallback";

// Dashboard
import DashboardHome from "./pages/DashboardHome";

// Pacientes
import Pacientes from "./pages/Pacientes";
import PacienteDetalle from "./pages/PacienteDetalle";

// Clínica
import Citas from "./pages/Citas";
import Doctores from "./pages/Doctores";

// Fallback
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
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
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/pacientes/:id" element={<PacienteDetalle />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/doctores" element={<Doctores />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
