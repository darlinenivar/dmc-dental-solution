import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Finanzas() {
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("income"); // income/expense
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: c } = await supabase.from("clinics").select("*").limit(1).single();
      setClinic(c || null);

      if (c?.id) {
        const { data } = await supabase
          .from("transactions")
          .select("*")
          .eq("clinic_id", c.id)
          .order("created_at", { ascending: false })
          .limit(200);
        setItems(data || []);
      }
      setLoading(false);
    })();
  }, []);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const it of items) {
      const v = Number(it.amount || 0);
      if (it.type === "expense") expense += v;
      else income += v;
    }
    return { income, expense, net: income - expense };
  }, [items]);

  const addTx = async () => {
    if (!clinic?.id) return alert("No hay clínica creada");
    const v = Number(amount);
    if (!v || v <= 0) return alert("Monto inválido");

    const payload = {
      clinic_id: clinic.id,
      type,
      category: category?.trim() || null,
      amount: v,
      note: note?.trim() || null,
    };

    const { data, error } = await supabase.from("transactions").insert(payload).select("*").single();
    if (error) return alert(error.message);

    setItems((prev) => [data, ...prev]);
    setCategory("");
    setAmount("");
    setNote("");
  };

  const delTx = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) return alert(error.message);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>📈 Finanzas</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "12px 0" }}>
        <div><b>Ingresos:</b> {totals.income.toFixed(2)}</div>
        <div><b>Gastos:</b> {totals.expense.toFixed(2)}</div>
        <div><b>Neto:</b> {totals.net.toFixed(2)}</div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>

        <input
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Nota (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ minWidth: 260 }}
        />

        <button onClick={addTx}>Agregar</button>
      </div>

      <div style={{ marginTop: 18 }}>
        {items.length === 0 ? (
          <p>No hay movimientos.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">Tipo</th>
                <th align="left">Categoría</th>
                <th align="right">Monto</th>
                <th align="left">Nota</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} style={{ borderTop: "1px solid #eee" }}>
                  <td>{it.type}</td>
                  <td>{it.category || "-"}</td>
                  <td align="right">{Number(it.amount || 0).toFixed(2)}</td>
                  <td>{it.note || "-"}</td>
                  <td align="right">
                    <button onClick={() => delTx(it.id)}>Borrar</button>
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
