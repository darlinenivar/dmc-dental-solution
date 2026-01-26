import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function pad(n, len = 4) {
  const s = String(n);
  return "0".repeat(Math.max(0, len - s.length)) + s;
}

export default function Facturacion() {
  const nav = useNavigate();

  const [clinic, setClinic] = useState(null);
  const [patients, setPatients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: c } = await supabase.from("clinics").select("*").limit(1).single();
      setClinic(c || null);

      if (c?.id) {
        const { data: p } = await supabase
          .from("patients")
          .select("id, full_name")
          .eq("clinic_id", c.id)
          .order("full_name", { ascending: true });
        setPatients(p || []);

        const { data: inv } = await supabase
          .from("invoices")
          .select("*")
          .eq("clinic_id", c.id)
          .order("created_at", { ascending: false })
          .limit(200);
        setInvoices(inv || []);
      }

      setLoading(false);
    })();
  }, []);

  const nextNumber = useMemo(() => {
    // genera FAC-0001 basado en el mayor existente
    let max = 0;
    for (const i of invoices) {
      const m = String(i.number || "").match(/(\d+)$/);
      if (m) max = Math.max(max, Number(m[1]));
    }
    return `FAC-${pad(max + 1)}`;
  }, [invoices]);

  const createInvoice = async () => {
    if (!clinic?.id) return alert("No hay clínica creada");
    if (!patientId) return alert("Selecciona un paciente");

    const payload = {
      clinic_id: clinic.id,
      patient_id: patientId,
      number: nextNumber,
      status: "open",
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
      notes: notes?.trim() || null,
    };

    const { data, error } = await supabase.from("invoices").insert(payload).select("*").single();
    if (error) return alert(error.message);

    nav(`/billing/${data.id}`);
  };

  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <h2>🧾 Facturación (PRO)</h2>
        <button onClick={() => nav("/billing")}>Actualizar</button>
      </div>

      <div style={{ border: "1px solid #eee", padding: 14, borderRadius: 10, marginTop: 12 }}>
        <h3>Crear nueva factura</h3>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div><b>Número:</b> {nextNumber}</div>

          <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">Seleccionar paciente…</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.full_name}</option>
            ))}
          </select>

          <input
            placeholder="Nota (opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ minWidth: 280 }}
          />

          <button onClick={createInvoice}>Crear</button>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <h3>Facturas recientes</h3>

        {invoices.length === 0 ? (
          <p>No hay facturas.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">#</th>
                <th align="left">Estado</th>
                <th align="right">Total</th>
                <th align="left">Fecha</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>{i.number}</td>
                  <td>{i.status}</td>
                  <td align="right">{Number(i.total || 0).toFixed(2)}</td>
                  <td>{new Date(i.created_at).toLocaleString()}</td>
                  <td align="right">
                    <button onClick={() => nav(`/billing/${i.id}`)}>Abrir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
