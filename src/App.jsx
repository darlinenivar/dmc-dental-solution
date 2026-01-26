import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

// Pages reales que ya tienes (ajusta imports si tus nombres cambian)
import Dashboard from "./pages/Dashboard";
import Doctores from "./pages/Doctores";
import Pacientes from "./pages/Pacientes";
import PacienteDetalle from "./pages/PacienteDetalle";
import Citas from "./pages/Citas";
import Procedimientos from "./pages/Procedimientos";
import Odontograma from "./pages/Odontograma";

// NUEVA
import PatientTimeline from "./pages/PatientTimeline";

// Auth / misc
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import PoliticasDePrivacidad from "./pages/PoliticasDePrivacidad";
import NotFound from "./pages/NotFound";

// Placeholders PRO (para que no de 404 mientras los hacemos full)
import Placeholder from "./pages/Placeholder";

// Si tienes RequireAuth úsalo; si no, deja simple
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/privacy" element={<PoliticasDePrivacidad />} />

      {/* App protegida */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        {/* My Clinic */}
        <Route path="my-clinic/doctor" element={<Doctores />} />
        <Route path="my-clinic/patients" element={<Pacientes />} />
        <Route path="my-clinic/patients/:id" element={<PacienteDetalle />} />
        <Route path="my-clinic/patients/:id/timeline" element={<PatientTimeline />} />

        <Route path="my-clinic/procedimientos" element={<Procedimientos />} />
        <Route path="my-clinic/odontograma" element={<Odontograma />} />

        {/* Para que no dé 404 ahora mismo */}
        <Route path="my-clinic/seguro" element={<Placeholder title="Seguro médico" />} />
        <Route path="my-clinic/metodos-pago" element={<Placeholder title="Método de pago" />} />

        {/* Citas/Finanzas/etc */}
        <Route path="appointments" element={<Citas />} />
        <Route path="finance" element={<Placeholder title="Finanzas" />} />
        <Route path="expenses" element={<Placeholder title="Gastos" />} />
        <Route path="backup" element={<Placeholder title="Backup" />} />

        {/* Settings */}
        <Route path="settings/import" element={<Placeholder title="Importar paciente" />} />
        <Route path="settings/password" element={<Placeholder title="Cambiar contraseña" />} />
        <Route path="settings/subscription" element={<Placeholder title="Suscripción" />} />
        <Route path="settings/app" element={<Placeholder title="App configuration" />} />
        <Route path="settings/devices" element={<Placeholder title="Conectar equipos" />} />

        <Route path="share" element={<Placeholder title="Compartir con amigos" />} />

        {/* 404 dentro de layout */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 404 fuera */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
