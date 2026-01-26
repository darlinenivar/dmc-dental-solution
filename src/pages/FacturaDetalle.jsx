import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function FacturaDetalle() {
  const { id } = useParams();
  const nav = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [patient, setPatient] = useState(null);
  const [procedures, setProcedures] = useState([]);
  const [items, setItems] = useState([]);
  const [payments, setPayments] = useState([]);

  const [procId, setProcId] = useState("");
  const [qty, setQty] = useState("1");

  const [payMethod, setPayMethod] = useState("cash");
  const [payAmount, setPayAmount] = useState("");

  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const { data: inv, error: invErr } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();
    if (invErr) {
      alert(invErr.message);
      return;
    }

    setInvoice(inv);

    if (inv.patient_id) {
      const { data: p } = await supabase.from("patients").select("*").eq("id", inv.patient_id).single();
      setPatient(p || null);
    } else {
      setPatient(null);
    }

    const { data: procs } = await supabase
      .from("procedures")
      .select("*")
      .eq("clinic_id", inv.clinic_id)
      .order("category", { ascending: true })
      .order("name", { ascending: true });
    setProcedures(procs || []);

    const { data: its } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", inv.id)
      .order("created_at", { ascending: true });
    setItems(its || []);

    const { data: pays } = await supabase
      .from("payments")
      .select("*")
      .eq("invoice_id", inv.id)
      .order("paid_at", { ascending: false });
    setPayments(pays || []);

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((a, it) => a + Number(it.line_total || 0), 0);
    const discount = Number(invoice?.discount || 0);
    const tax = Number(invoice?.tax || 0);
    const total = Math.max(0, subtotal - discount + tax);

    const paid = payments.reduce((a, p) => a + Number(p.amount || 0), 0);
    const due = Math.max(0, total - paid);

    return { subtotal, discount, tax, total, paid, due };
  }, [items, payments, invoice]);

  const syncInvoiceTotals = async () => {
    if (!invoice?.id) return;
    const payload = {
      subtotal: totals.subtotal,
      total: totals.total,
      status: totals.due <= 0 ? "paid" : "open",
    };
    const { error } = await supabase.from("invoices").update(payload).eq("id", invoice.id);
    if (error) alert(error.message);
    await load();
  };

  const addItem = async () => {
    const proc = procedures.find((p) => p.id === procId);
    if (!proc) return alert("Selecciona un procedimiento");
    const q = Number(qty);
    if (!q || q <= 0) return alert("Cantidad inválida");

    const unit = Number(proc.price || 0);
    const payload = {
      invoice_id: invoice.id,
      procedure_name: proc.name,
      qty: q,
      unit_price: unit,
      line_total: q * unit,
    };

    const { error } = await supabase.from("invoice_items").insert(payload);
    if (error) return alert(error.message);

    setProcId("");
    setQty("1");
    await load();
    await syncInvoiceTotals();
  };

  const delItem = async (itemId) => {
    const { error } = await supabase.from("invoice_items").delete().eq("id", itemId);
    if (error) return alert(error.message);
    await load();
    await syncInvoiceTotals();
  };

  const addPayment = async () => {
    const v = Number(payAmount);
    if (!v || v <= 0) return alert("Monto inválido");

    const payload = { invoice_id: invoice.id, method: payMethod, amount: v };
    const { error } = await supabase.from("payments").insert(payload);
    if (error) return alert(error.message);

    setPayAmount("");
    await load();
    await syncInvoiceTotals();
  };

  const delPayment = async (payId) => {
    const { error } = await supabase.from("payments").delete().eq("id", payId);
    if (error) return alert(error.message);
    await load();
    await syncInvoiceTotals();
  };

  const printInvoice = () => window.print();

  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;
  if (!invoice) return <div style={{ padding: 24 }}>Factura no encontrada.</div>;

  return (
    <div style={{ padding: 24 }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
        .card { border:1px solid #eee; border-radius:12px; padding:14px; margin-top:12px; }
        table { width:100%; border-collapse: collapse; }
        th, td { padding:8px; border-top:1px solid #eee; }
      `}</style>

      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => nav("/billing")}>⬅️ Volver</button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={load}>Actualizar</button>
          <button onClick={printInvoice}>Imprimir</button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ margin: 0 }}>FACTURA {invoice.number}</h2>
        <div style={{ marginTop: 8, display: "flex", gap: 18, flexWrap: "wrap" }}>
          <div>
            <b>Paciente:</b> {patient?.full_name || "—"}
          </div>
          <div>
            <b>Estado:</b> {invoice.status}
          </div>
          <div>
            <b>Fecha:</b> {new Date(invoice.created_at).toLocaleString()}
          </div>
        </div>
        {invoice.notes ? <p style={{ marginTop: 8 }}><b>Notas:</b> {invoice.notes}</p> : null}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Procedimientos</h3>

        <div className="no-print" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select value={procId} onChange={(e) => setProcId(e.target.value)}>
            <option value="">Seleccionar procedimiento…</option>
            {procedures.map((p) => (
              <option key={p.id} value={p.id}>
                {p.category} — {p.name} (${Number(p.price || 0).toFixed(2)})
              </option>
            ))}
          </select>

          <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Cantidad" style={{ width: 90 }} />
          <button onClick={addItem}>Agregar</button>
        </div>

        {items.length === 0 ? (
          <p>No hay items.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th align="left">Descripción</th>
                <th align="right">Cant.</th>
                <th align="right">Precio</th>
                <th align="right">Total</th>
                <th className="no-print" />
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>{it.procedure_name}</td>
                  <td align="right">{Number(it.qty || 0)}</td>
                  <td align="right">{Number(it.unit_price || 0).toFixed(2)}</td>
                  <td align="right">{Number(it.line_total || 0).toFixed(2)}</td>
                  <td className="no-print" align="right">
                    <button onClick={() => delItem(it.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pagos</h3>

        <div className="no-print" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="insurance">Seguro</option>
            <option value="transfer">Transferencia</option>
          </select>

          <input value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="Monto" />
          <button onClick={addPayment}>Agregar pago</button>
        </div>

        {payments.length === 0 ? (
          <p>No hay pagos.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th align="left">Método</th>
                <th align="right">Monto</th>
                <th align="left">Fecha</th>
                <th className="no-print" />
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td>{p.method}</td>
                  <td align="right">{Number(p.amount || 0).toFixed(2)}</td>
                  <td>{new Date(p.paid_at).toLocaleString()}</td>
                  <td className="no-print" align="right">
                    <button onClick={() => delPayment(p.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Resumen</h3>
        <div style={{ display: "grid", gap: 6, maxWidth: 420 }}>
          <div><b>Subtotal:</b> {totals.subtotal.toFixed(2)}</div>
          <div><b>Descuento:</b> {totals.discount.toFixed(2)}</div>
          <div><b>Impuestos:</b> {totals.tax.toFixed(2)}</div>
          <div style={{ fontSize: 18 }}><b>Total:</b> {totals.total.toFixed(2)}</div>
          <div><b>Pagado:</b> {totals.paid.toFixed(2)}</div>
          <div style={{ fontSize: 18 }}><b>Pendiente:</b> {totals.due.toFixed(2)}</div>
        </div>

        <div className="no-print" style={{ marginTop: 10 }}>
          <button onClick={syncInvoiceTotals}>Recalcular / Guardar</button>
        </div>
      </div>
    </div>
  );
}
