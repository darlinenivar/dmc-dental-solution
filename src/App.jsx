import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages reales (EXISTENTES)
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import PacientePerfil from "./pages/PacientePerfil";
import PacienteCitas from "./pages/PacienteCitas";
import PacienteHistoria from "./pages/PacienteHistoria";
import Odontograma from "./pages/Odontograma";
import SettingsApp from "./pages/SettingsApp";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Pacientes */}
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<PacientePerfil />} />
        <Route path="/pacientes/:id/citas" element={<PacienteCitas />} />
        <Route path="/pacientes/:id/historia" element={<PacienteHistoria />} />
        <Route path="/pacientes/:id/odontograma" element={<Odontograma />} />

        {/* Configuración */}
        <Route path="/settings/app" element={<SettingsApp />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
