import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./auth/RequireAuth";
import DashboardLayout from "./layout/DashboardLayout";

import Login from "./pages/Login";
import DashboardHome from "./pages/DashboardHome";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";

import "./styles/app.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Private */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>

          {/* placeholders por si existen links del sidebar */}
          <Route path="/pacientes" element={<Navigate to="/dashboard" replace />} />
          <Route path="/citas" element={<Navigate to="/dashboard" replace />} />
          <Route path="/doctores" element={<Navigate to="/dashboard" replace />} />
          <Route path="/facturacion" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
