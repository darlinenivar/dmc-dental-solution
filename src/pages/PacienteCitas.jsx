import React from "react";
import { useParams } from "react-router-dom";

export default function PacienteCitas() {
  const { id } = useParams();

  const citas = JSON.parse(localStorage.getItem("citas")) || [];

  const citasPaciente = citas.filter((c) => c.patientId === id);

  return (
    <div>
      <h2>Citas del paciente</h2>

      {citasPaciente.length === 0 ? (
        <p>No hay citas registradas.</p>
      ) : (
        <ul>
          {citasPaciente.map((cita) => (
            <li key={cita.id}>
              {cita.fecha} — {cita.motivo}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
