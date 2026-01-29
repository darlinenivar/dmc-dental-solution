import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClinicProvider } from "./context/ClinicContext";

import RequireAuth from "./components/RequireAuth";

// Pages (públicas)
import Login from "./pages/Login";
import Register from "./pages/Register";
import PoliticasDePrivacidad from "./pages/PoliticasDePrivacidad";

// Layout
import DashboardLayout from "./layout/DashboardLayout";

// Pages (privadas)
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Pacientes from "./pages/Pacientes";
import NewPatient from "./pages/NewPatient";
import PacienteDetalle from "./pages/PacienteDetalle";
import PacientePerfil from "./pages/PacientePerfil";
import PacienteHistoria from "./pages/PacienteHistoria";
import PacienteCitas from "./pages/PacienteCitas";
import PatientTimeline from "./pages/PatientTimeline";

import Procedimientos from "./pages/Procedimientos";
import SeguroMedico from "./pages/SeguroMedico";
import Odontograma from "./pages/Odontograma";

import SettingsApp from "./pages/SettingsApp";
import Suscripcion from "./pages/Suscripcion";
import MyClinic from "./pages/MyClinic";

// Not found
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <ClinicProvider>
        <Routes>
          {/* ========================= */}
          {/*          PUBLIC           */}
          {/* ========================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<PoliticasDePrivacidad />} />

          {/* ========================= */}
          {/*         PRIVATE           */}
          {/* ========================= */}
          <Route
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/appointments" element={<Appointments />} />

            <Route path="/patients" element={<Pacientes />} />
            <Route path="/patients/new" element={<NewPatient />} />

            {/* Perfil del paciente */}
            <Route path="/patients/:id" element={<PacienteDetalle />} />
            <Route path="/patients/:id/profile" element={<PacientePerfil />} />
            <Route path="/patients/:id/history" element={<PacienteHistoria />} />
            <Route path="/patients/:id/appointments" element={<PacienteCitas />} />
            <Route path="/patients/:id/timeline" element={<PatientTimeline />} />

            <Route path="/procedures" element={<Procedimientos />} />
            <Route path="/insurance" element={<SeguroMedico />} />
            <Route path="/odontogram" element={<Odontograma />} />

            {/* Config / Clinic */}
            <Route path="/settings/app" element={<SettingsApp />} />
            <Route path="/subscription" element={<Suscripcion />} />
            <Route path="/my-clinic" element={<MyClinic />} />
          </Route>

          {/* ========================= */}
          {/*         NOT FOUND         */}
          {/* ========================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ClinicProvider>
    </BrowserRouter>
  );
}
