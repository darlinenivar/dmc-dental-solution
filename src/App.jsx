import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";

import DashboardLayout from "./layout/DashboardLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

import "./styles/app.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private */}
          <Route element={<RequireAuth />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/pacientes" element={<Placeholder title="Pacientes" />} />
              <Route path="/citas" element={<Placeholder title="Citas" />} />
              <Route path="/doctores" element={<Placeholder title="Doctores" />} />
              <Route path="/facturacion" element={<Placeholder title="Facturación" />} />
              <Route path="/configuracion" element={<Placeholder title="Configuración" />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
