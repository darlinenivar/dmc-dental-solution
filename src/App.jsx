import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./auth/AuthProvider";
import RequireAuth from "./auth/RequireAuth";

// Layout fijo
import DashboardLayout from "./layout/DashboardLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";

// Públicas (fuera del dashboard)
import PoliticasDePrivacidad from "./pages/PoliticasDePrivacidad";
import Terminos from "./pages/Terminos";

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

          {/* Public legal pages */}
          <Route path="/politicas-de-privacidad" element={<PoliticasDePrivacidad />} />
          <Route path="/terminos" element={<Terminos />} />

          {/* Private (Dashboard) */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="configuracion" element={<Configuracion />} />

            {/* placeholders (para que no se rompa cuando aún no las tengas) */}
            <Route path="pacientes" element={<Placeholder titulo="Pacientes" />} />
            <Route path="citas" element={<Placeholder titulo="Citas" />} />
            <Route path="doctores" element={<Placeholder titulo="Doctores" />} />
            <Route path="facturacion" element={<Placeholder titulo="Facturación" />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function Placeholder({ titulo }) {
  return (
    <div className="card">
      <div className="h1">{titulo}</div>
      <p className="p">Sección en construcción.</p>
    </div>
  );
}
