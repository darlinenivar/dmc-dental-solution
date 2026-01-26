import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/patient_timeline.css";

export default function PatientTimeline() {
  const { id } = useParams(); // patient_id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [error, setError] = useState("");

  const [note, setNote] = useState("");
  const [billedAmount, setBilledAmount] = useState("");
  const [proceduresJson, setProceduresJson] = useState("[]"); // JSON string editable

  const canSave = useMemo(() => !!id, [id]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        // Patient
        const { data: p, error: pErr } = await supabase
          .from("patients")
          .select("*")
          .eq("id", id)
          .single();

        if (pErr) throw pErr;

        // Visits
        const { data: v, error: vErr } = await supabase
          .from("patient_visits")
          .select("*")
          .eq("patient_id", id)
          .order("visit_date", { ascending: false });

        if (vErr) throw vErr;

        if (!alive) return;
        setPatient(p);
        setVisits(v || []);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError(e?.message || "Error cargando visitas.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const createVisit = async () => {
    if (!canSave) return;

    setError("");
    try {
      let parsed = [];
      try {
        parsed = JSON.parse(proceduresJson || "[]");
      } catch {
        throw new Error("Procedimientos debe ser JSON válido (ej: []).");
      }

      const { data, error } = await supabase
        .from("patient_visits")
        .insert([
          {
            patient_id: id,
            visit_date: new Date().toISOString().slice(0, 10),
            note: note || "",
            procedures: parsed,
            billed_amount: billedAmount ? Number(billedAmount) : 0,
          },
        ])
        .select("*")
        .single();

      if (error) throw error;

      setVisits((prev) => [data, ...prev]);
      setNote("");
      setBilledAmount("");
      setProceduresJson("[]");
    } catch (e) {
      console.error(e);
      setError(e?.message || "No se pudo crear la visita.");
    }
  };

  const deleteVisit = async (visitId) => {
    setError("");
    try {
      const { error } = await supabase.from("patient_visits").delete().eq("id", visitId);
      if (error) throw error;
      setVisits((prev) => prev.filter((x) => x.id !== visitId));
    } catch (e) {
      console.error(e);
      setError(e?.message || "No se pudo eliminar.");
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Timeline / Visitas</h1>
          <p className="muted">
            {patient ? (
              <>
                {patient.first_name} {patient.last_name} • {patient.phone || "sin teléfono"}
              </>
            ) : (
              "Cargando paciente..."
            )}
          </p>
        </div>

        <div className="page-actions">
          <button className="btn ghost" onClick={() => navigate(`/my-clinic/patients/${id}`)}>
            Volver al paciente
          </button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="card">
        <h3>Nueva visita</h3>

        <div className="grid2">
          <div>
            <label>Nota</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Dolor en molar 26, sensibilidad al frío..."
              rows={4}
            />
          </div>

          <div>
            <label>Procedimientos (JSON)</label>
            <textarea
              value={proceduresJson}
              onChange={(e) => setProceduresJson(e.target.value)}
              placeholder='Ej: [{"name":"Limpieza","price":1200}]'
              rows={4}
            />

            <label style={{ marginTop: 12 }}>Monto facturado</label>
            <input
              value={billedAmount}
              onChange={(e) => setBilledAmount(e.target.value)}
              placeholder="0"
              inputMode="decimal"
            />

            <button className="btn primary" onClick={createVisit} disabled={!canSave}>
              Guardar visita
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Historial</h3>

        {loading ? (
          <div className="muted">Cargando...</div>
        ) : visits.length === 0 ? (
          <div className="muted">Aún no hay visitas.</div>
        ) : (
          <div className="timeline">
            {visits.map((v) => (
              <div key={v.id} className="timeline-item">
                <div className="timeline-date">{v.visit_date}</div>
                <div className="timeline-body">
                  <div className="timeline-row">
                    <div>
                      <div className="strong">Monto: RD$ {Number(v.billed_amount || 0).toFixed(2)}</div>
                      <div className="muted">{v.note || "Sin nota"}</div>
                    </div>

                    <button className="btn danger small" onClick={() => deleteVisit(v.id)}>
                      Eliminar
                    </button>
                  </div>

                  <pre className="jsonbox">{JSON.stringify(v.procedures || [], null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
