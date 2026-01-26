import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/historiaClinica.css";

export default function HistoriaClinica() {
  const { id } = useParams();

  const [form, setForm] = useState({
    alergias: "",
    condiciones: "",
    medicamentos: "",
    observaciones: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    localStorage.setItem(`historia_${id}`, JSON.stringify(form));
    alert("Historia clínica guardada ✅");
  };

  return (
    <div className="historia-clinica">
      <h2>Historia Clínica</h2>

      <label>Alergias</label>
      <textarea name="alergias" onChange={handleChange} />

      <label>Condiciones médicas</label>
      <textarea name="condiciones" onChange={handleChange} />

      <label>Medicamentos actuales</label>
      <textarea name="medicamentos" onChange={handleChange} />

      <label>Observaciones</label>
      <textarea name="observaciones" onChange={handleChange} />

      <button onClick={handleSave}>Guardar historia clínica</button>
    </div>
  );
}
