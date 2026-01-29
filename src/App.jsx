import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas (según tu carpeta src/pages)
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Pacientes from "./pages/Pacientes";
import PacientePerfil from "./pages/PacientePerfil";
import PacienteDetalle from "./pages/PacienteDetalle";
import PacienteCitas from "./pages/PacienteCitas";
import PacienteHistoria from "./pages/PacienteHistoria";
import PatientTimeline from "./pages/PatientTimeline";
import NewPatient from "./pages/NewPatient";
import ImportarPaciente from "./pages/ImportarPaciente";

import Odontograma from "./pages/Odontograma";

import Doctores from "./pages/Doctores";
import HistoriaClinica from "./pages/HistoriaClinica";
import Procedimientos from "./pages/Procedimientos";

import Facturacion from "./pages/Facturacion";
import FacturaDetalle from "./pages/FacturaDetalle";
import Finanzas from "./pages/Finanzas";
import MetodoPago from "./pages/MetodoPago";

import MyClinic from "./pages/MyClinic";
import ConectarEquipos from "./pages/ConectarEquipos";
import Configuracion from "./pages/Configuracion";
import SettingsApp from "./pages/SettingsApp";
import Suscripcion from "./pages/Suscripcion";
import SeguroMedico from "./pages/SeguroMedico";
import PoliticasDePrivacidad from "./pages/PoliticasDePrivacidad";

import NotFound from "./pages/NotFound";

// Helper: crea rutas duplicadas para soportar:
//  - /dashboard  y /app/dashboard
//  - /patients   y /app/patients
//  - /pacientes  y /app/pacientes
function DualRoute({ path, element }) {
  return (
    <>
      <Route path={path} element={element} />
      <Route path={`/app${path}`} element={element} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Home */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

        {/* ✅ Auth */}
        <DualRoute path="/register" element={<Register />} />
        <DualRoute path="/forgot-password" element={<ForgotPassword />} />

        {/* ✅ Dashboard */}
        <DualRoute path="/dashboard" element={<Dashboard />} />

        {/* ✅ Alias que te estaban dando 404 */}
        <DualRoute path="/appointments" element={<MyClinic />} />
        <DualRoute path="/my-clinic-patients" element={<MyClinic />} />

        {/* ✅ Clínica */}
        <DualRoute path="/my-clinic" element={<MyClinic />} />

        {/* ✅ Pacientes (soporta /patients y /pacientes) */}
        <DualRoute path="/patients" element={<Pacientes />} />
        <DualRoute path="/pacientes" element={<Pacientes />} />

        {/* ✅ Acciones pacientes */}
        <DualRoute path="/patients/new" element={<NewPatient />} />
        <DualRoute path="/pacientes/nuevo" element={<NewPatient />} />

        <DualRoute path="/patients/import" element={<ImportarPaciente />} />
        <DualRoute path="/pacientes/importar" element={<ImportarPaciente />} />

        {/* ✅ Perfil / detalle (soporta ambos idiomas y /app/...) */}
        <DualRoute path="/patients/:id" element={<PacientePerfil />} />
        <DualRoute path="/pacientes/:id" element={<PacientePerfil />} />

        <DualRoute path="/patients/:id/detail" element={<PacienteDetalle />} />
        <DualRoute path="/pacientes/:id/detalle" element={<PacienteDetalle />} />

        <DualRoute path="/patients/:id/citas" element={<PacienteCitas />} />
        <DualRoute path="/pacientes/:id/citas" element={<PacienteCitas />} />

        <DualRoute path="/patients/:id/historia" element={<PacienteHistoria />} />
        <DualRoute path="/pacientes/:id/historia" element={<PacienteHistoria />} />

        <DualRoute path="/patients/:id/timeline" element={<PatientTimeline />} />
        <DualRoute path="/pacientes/:id/timeline" element={<PatientTimeline />} />

        <DualRoute path="/patients/:id/odontograma" element={<Odontograma />} />
        <DualRoute path="/pacientes/:id/odontograma" element={<Odontograma />} />

        {/* ✅ Doctores */}
        <DualRoute path="/doctores" element={<Doctores />} />

        {/* ✅ Historia clínica general */}
        <DualRoute path="/historia-clinica" element={<HistoriaClinica />} />

        {/* ✅ Procedimientos */}
        <DualRoute path="/procedimientos" element={<Procedimientos />} />

        {/* ✅ Facturación / Finanzas */}
        <DualRoute path="/facturacion" element={<Facturacion />} />
        <DualRoute path="/facturacion/:id" element={<FacturaDetalle />} />

        <DualRoute path="/finanzas" element={<Finanzas />} />
        <DualRoute path="/metodo-pago" element={<MetodoPago />} />

        {/* ✅ Config / Settings */}
        <DualRoute path="/configuracion" element={<Configuracion />} />
        <DualRoute path="/settings/app" element={<SettingsApp />} />
        <DualRoute path="/suscripcion" element={<Suscripcion />} />
        <DualRoute path="/seguro-medico" element={<SeguroMedico />} />

        {/* ✅ Extras */}
        <DualRoute path="/conectar-equipos" element={<ConectarEquipos />} />
        <DualRoute path="/privacy" element={<PoliticasDePrivacidad />} />
        <DualRoute path="/politicas-de-privacidad" element={<PoliticasDePrivacidad />} />

        {/* ✅ 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
