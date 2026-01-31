// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import RequireAuth from "./auth/RequireAuth";
import DashboardLayout from "./layout/DashboardLayout";

import DashboardHome from "./pages/DashboardHome";
import Patients from "./pages/Patients";
import PacienteDetalle from "./pages/PacienteDetalle";
import Citas from "./pages/Citas";
import Doctores from "./pages/Doctores";

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

        {/* PRIVATE (anidado) */}
        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PacienteDetalle />} />
          <Route path="/citas" element={<Citas />} />
          <Route path="/doctores" element={<Doctores />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
