import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const LS_CLINIC = "dmc_active_clinic_id";

function moneyParse(val) {
  if (val === "" || val === null || val === undefined) return null;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export default function Procedimientos() {
  const [loading, setLoading] = useState(true);

  const [clinics, setClinics] = useState([]);
  const [activeClinicId, setActiveClinicId] = useState(localStorage.getItem(LS_CLINIC) || "");

  const [categories, setCategories] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [prices, setPrices] = useState([]);
  const [columns, setColumns] = useState([]); // procedure_columns

  const [newClinicName, setNewClinicName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const saveTimers = useRef(new Map());

  const categoriesSorted = useMemo(() => {
    return [...categories].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [categories]);

  const proceduresByCategory = useMemo(() => {
    const map = new Map();
    for (const c of categoriesSorted) map.set(c.id, []);
    for (const p of procedures) {
      if (!map.has(p.category_id)) map.set(p.category_id, []);
      map.get(p.category_id).push(p);
    }
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      map.set(k, arr);
    }
    return map;
  }, [categoriesSorted, procedures]);

  const columnsByCategory = useMemo(() => {
    const map = new Map();
    for (const c of categoriesSorted) map.set(c.id, []);
    const cols = columns
      .filter((x) => x.clinic_id === activeClinicId)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    for (const col of cols) {
      if (!map.has(col.category_id)) map.set(col.category_id, []);
      map.get(col.category_id).push(col);
    }
    return map;
  }, [columns, categoriesSorted, activeClinicId]);

  const priceIndex = useMemo(() => {
    const m = new Map();
    for (const r of prices) {
      m.set(`${r.procedure_id}|${r.column_key}`, r);
    }
    return m;
  }, [prices]);

  function scheduleSave(key, fn, delay = 500) {
    const timers = saveTimers.current;
    if (timers.has(key)) clearTimeout(timers.get(key));
    const t = setTimeout(fn, delay);
    timers.set(key, t);
  }

  async function loadAll() {
    setLoading(true);

    const { data: clinicsData, error: clinicsErr } = await supabase
      .from("clinics")
      .select("*")
      .order("created_at", { ascending: true });

    if (clinicsErr) {
      alert("Error cargando clínicas: " + clinicsErr.message);
      setLoading(false);
      return;
    }

    setClinics(clinicsData || []);

    let clinicId = activeClinicId;
    if (!clinicId && clinicsData?.length) clinicId = clinicsData[0].id;

    if (clinicId) {
      setActiveClinicId(clinicId);
      localStorage.setItem(LS_CLINIC, clinicId);
    }

    const { data: catData, error: catErr } = await supabase
      .from("procedure_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (catErr) {
      alert("Error cargando categorías: " + catErr.message);
      setLoading(false);
      return;
    }
    setCategories(catData || []);

    const { data: procData, error: procErr } = await supabase
      .from("procedures")
      .select("*")
      .eq("is_active", true);

    if (procErr) {
      alert("Error cargando procedimientos: " + procErr.message);
      setLoading(false);
      return;
    }
    setProcedures(procData || []);

    // columnas de todas las clínicas (o solo la activa; aquí traemos solo la activa para rendimiento)
    if (clinicId) {
      const { data: colData, error: colErr } = await supabase
        .from("procedure_columns")
        .select("*")
        .eq("clinic_id", clinicId);

      if (colErr) {
        alert("Error cargando columnas: " + colErr.message);
        setLoading(false);
        return;
      }
      setColumns(colData || []);

      const { data: priceData, error: priceErr } = await supabase
        .from("procedure_prices")
        .select("*")
        .eq("clinic_id", clinicId);

      if (priceErr) {
        alert("Error cargando precios: " + priceErr.message);
        setLoading(false);
        return;
      }
      setPrices(priceData || []);
    } else {
      setColumns([]);
      setPrices([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambio de clínica: recarga columnas y precios
  useEffect(() => {
    (async () => {
      if (!activeClinicId) return;
      localStorage.setItem(LS_CLINIC, activeClinicId);

      const { data: colData, error: colErr } = await supabase
        .from("procedure_columns")
        .select("*")
        .eq("clinic_id", activeClinicId);

      if (colErr) {
        alert("Error cargando columnas: " + colErr.message);
        return;
      }
      setColumns(colData || []);

      const { data: priceData, error: priceErr } = await supabase
        .from("procedure_prices")
        .select("*")
        .eq("clinic_id", activeClinicId);

      if (priceErr) {
        alert("Error cargando precios: " + priceErr.message);
        return;
      }
      setPrices(priceData || []);
    })();
  }, [activeClinicId]);

  async function reloadColsAndPrices() {
    if (!activeClinicId) return;

    const { data: colData, error: colErr } = await supabase
      .from("procedure_columns")
      .select("*")
      .eq("clinic_id", activeClinicId);

    if (colErr) return alert("Error recargando columnas: " + colErr.message);
    setColumns(colData || []);

    const { data: priceData, error: priceErr } = await supabase
      .from("procedure_prices")
      .select("*")
      .eq("clinic_id", activeClinicId);

    if (priceErr) return alert("Error recargando precios: " + priceErr.message);
    setPrices(priceData || []);
  }

  // ---------- Clinics ----------
  async function createClinic() {
    const name = newClinicName.trim();
    if (!name) return;

    const { data, error } = await supabase.from("clinics").insert({ name }).select("*").single();
    if (error) return alert("Error creando clínica: " + error.message);

    setNewClinicName("");
    setClinics((prev) => [...prev, data]);
    setActiveClinicId(data.id);

    // IMPORTANTE: al crear clínica, debes crear columnas por cada categoría (mínimo 2)
    for (const cat of categoriesSorted) {
      await supabase.from("procedure_columns").insert([
        { clinic_id: data.id, category_id: cat.id, key: "col1", label: "$", sort_order: 10 },
        { clinic_id: data.id, category_id: cat.id, key: "col2", label: "$", sort_order: 20 },
      ]);
    }
  }

  async function renameClinic(id, name) {
    const val = name.trim();
    if (!val) return;

    const { error } = await supabase.from("clinics").update({ name: val }).eq("id", id);
    if (error) return alert("Error renombrando clínica: " + error.message);

    setClinics((prev) => prev.map((c) => (c.id === id ? { ...c, name: val } : c)));
  }

  async function deleteClinic(id) {
    if (!confirm("¿Borrar esta clínica? Se borrarán también columnas y precios.")) return;
    const { error } = await supabase.from("clinics").delete().eq("id", id);
    if (error) return alert("Error borrando clínica: " + error.message);

    const next = clinics.filter((c) => c.id !== id);
    setClinics(next);
    setActiveClinicId(next[0]?.id || "");
  }

  // ---------- Categories ----------
  async function createCategory() {
    const name = newCategoryName.trim();
    if (!name) return;

    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order ?? 0), 0);
    const payload = { name: name.toUpperCase(), sort_order: maxOrder + 10 };

    const { data, error } = await supabase.from("procedure_categories").insert(payload).select("*").single();
    if (error) return alert("Error creando categoría: " + error.message);

    setCategories((prev) => [...prev, data]);
    setNewCategoryName("");

    // Para cada clínica existente, crea columnas default de esa nueva categoría
    for (const cl of clinics) {
      await supabase.from("procedure_columns").insert([
        { clinic_id: cl.id, category_id: data.id, key: "col1", label: "$", sort_order: 10 },
        { clinic_id: cl.id, category_id: data.id, key: "col2", label: "$", sort_order: 20 },
      ]);
    }
    await reloadColsAndPrices();
  }

  async function renameCategory(catId, name) {
    const val = name.trim();
    if (!val) return;

    const { error } = await supabase.from("procedure_categories").update({ name: val.toUpperCase() }).eq("id", catId);
    if (error) return alert("Error editando categoría: " + error.message);

    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, name: val.toUpperCase() } : c)));
  }

  async function deleteCategory(catId) {
    if (!confirm("¿Borrar categoría? También borrará procedimientos, columnas y precios.")) return;

    const { error } = await supabase.from("procedure_categories").delete().eq("id", catId);
    if (error) return alert("Error borrando categoría: " + error.message);

    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setProcedures((prev) => prev.filter((p) => p.category_id !== catId));
    await reloadColsAndPrices();
  }

  // ---------- Procedures ----------
  async function createProcedure(category_id, name) {
    const n = name.trim();
    if (!n) return;

    const existing = procedures.filter((p) => p.category_id === category_id);
    const maxOrder = existing.reduce((m, p) => Math.max(m, p.sort_order ?? 0), 0);

    const { data, error } = await supabase
      .from("procedures")
      .insert({ category_id, name: n, sort_order: maxOrder + 10 })
      .select("*")
      .single();

    if (error) return alert("Error creando procedimiento: " + error.message);

    setProcedures((prev) => [...prev, data]);
  }

  async function deleteProcedure(procId) {
    if (!confirm("¿Borrar este procedimiento? Se borrarán también sus precios.")) return;

    const { error } = await supabase.from("procedures").delete().eq("id", procId);
    if (error) return alert("Error borrando procedimiento: " + error.message);

    setProcedures((prev) => prev.filter((p) => p.id !== procId));
    await reloadColsAndPrices();
  }

  function updateProcedureNameLocal(procId, name) {
    setProcedures((prev) => prev.map((p) => (p.id === procId ? { ...p, name } : p)));
    scheduleSave(`procname:${procId}`, async () => {
      const { error } = await supabase.from("procedures").update({ name: name.trim() }).eq("id", procId);
      if (error) alert("Error guardando nombre: " + error.message);
    });
  }

  // ---------- Columns (per clinic + category) ----------
  async function addColumn(category_id) {
    if (!activeClinicId) return;
    const key = prompt("Key interno (sin espacios). Ej: vip, col3, etc:");
    if (!key) return;
    const label = prompt("Título visible de la columna. Ej: VIP:");
    if (!label) return;

    const existing = columns.filter((c) => c.clinic_id === activeClinicId && c.category_id === category_id);
    const maxOrder = existing.reduce((m, c) => Math.max(m, c.sort_order ?? 0), 0);

    const { error } = await supabase.from("procedure_columns").insert({
      clinic_id: activeClinicId,
      category_id,
      key,
      label,
      sort_order: maxOrder + 10,
    });

    if (error) return alert("Error creando columna: " + error.message);
    await reloadColsAndPrices();
  }

  async function renameColumn(colId, newLabel) {
    const label = newLabel?.trim();
    if (!label) return;

    const { error } = await supabase.from("procedure_columns").update({ label }).eq("id", colId);
    if (error) return alert("Error editando columna: " + error.message);

    await reloadColsAndPrices();
  }

  async function deleteColumn(col) {
    if (!confirm(`¿Borrar columna "${col.label}"? Se perderán los precios de esa columna.`)) return;

    // Borra precios asociados a esa columna para esa clínica
    await supabase
      .from("procedure_prices")
      .delete()
      .eq("clinic_id", activeClinicId)
      .eq("column_key", col.key);

    const { error } = await supabase.from("procedure_columns").delete().eq("id", col.id);
    if (error) return alert("Error borrando columna: " + error.message);

    await reloadColsAndPrices();
  }

  // ---------- Prices ----------
  function updatePriceLocal(procedure_id, column_key, valueStr) {
    const val = moneyParse(valueStr);

    setPrices((prev) => {
      const idx = prev.findIndex(
        (r) => r.procedure_id === procedure_id && r.column_key === column_key && r.clinic_id === activeClinicId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], price: val };
        return copy;
      }
      return [
        ...prev,
        {
          id: `temp-${procedure_id}-${column_key}`,
          clinic_id: activeClinicId,
          procedure_id,
          column_key,
          price: val,
          currency: "DOP",
        },
      ];
    });

    scheduleSave(`price:${activeClinicId}:${procedure_id}:${column_key}`, async () => {
      if (!activeClinicId) return;

      const payload = {
        clinic_id: activeClinicId,
        procedure_id,
        column_key,
        price: val,
        currency: "DOP",
      };

      const { error } = await supabase
        .from("procedure_prices")
        .upsert(payload, { onConflict: "clinic_id,procedure_id,column_key" });

      if (error) {
        alert("Error guardando precio: " + error.message);
        return;
      }
      await reloadColsAndPrices();
    }, 450);
  }

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <h2>Procedimientos</h2>
        <div>Cargando...</div>
      </div>
    );
  }

  const activeClinic = clinics.find((c) => c.id === activeClinicId);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Listado de precios</h2>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={activeClinicId}
            onChange={(e) => setActiveClinicId(e.target.value)}
            style={{ padding: "10px 12px", borderRadius: 10 }}
          >
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            value={newClinicName}
            onChange={(e) => setNewClinicName(e.target.value)}
            placeholder="Nueva clínica (nombre)"
            style={{ padding: "10px 12px", borderRadius: 10, width: 240 }}
          />
          <button onClick={createClinic} style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}>
            + Clínica
          </button>

          {activeClinic && (
            <>
              <button
                onClick={() => {
                  const name = prompt("Nuevo nombre de clínica:", activeClinic.name);
                  if (name) renameClinic(activeClinic.id, name);
                }}
                style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
              >
                Renombrar
              </button>
              <button
                onClick={() => deleteClinic(activeClinic.id)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: "#ff4f6d",
                  color: "white",
                  border: 0,
                }}
              >
                Borrar clínica
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ opacity: 0.85, marginTop: 6 }}>
        Clínica activa: <b>{activeClinic?.name || "—"}</b>
      </div>

      <hr style={{ margin: "16px 0", opacity: 0.2 }} />

      {/* Crear categoría */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nueva categoría (ej: PROTESIS)"
          style={{ padding: "10px 12px", borderRadius: 10, width: 280 }}
        />
        <button onClick={createCategory} style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}>
          + Categoría
        </button>
        <div style={{ opacity: 0.7 }}>
          Ahora cada clínica puede personalizar columnas por categoría 🔥
        </div>
      </div>

      {categoriesSorted.map((cat) => {
        const cols = columnsByCategory.get(cat.id) || [];
        const list = proceduresByCategory.get(cat.id) || [];

        return (
          <div key={cat.id} style={{ marginBottom: 18, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: "#d9b0c3", padding: "10px 12px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <b style={{ color: "#2b1b24" }}>{cat.name}</b>
                <button
                  onClick={() => {
                    const name = prompt("Editar nombre de categoría:", cat.name);
                    if (name) renameCategory(cat.id, name);
                  }}
                  style={{ padding: "6px 10px", borderRadius: 10, cursor: "pointer" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  style={{ padding: "6px 10px", borderRadius: 10, cursor: "pointer", background: "#ff4f6d", color: "white", border: 0 }}
                >
                  Borrar
                </button>

                <button
                  onClick={() => addColumn(cat.id)}
                  style={{ padding: "6px 10px", borderRadius: 10, cursor: "pointer" }}
                >
                  + Columna
                </button>
              </div>

              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                {cols.map((c) => (
                  <div key={c.id} style={{ minWidth: 160, textAlign: "right", color: "#2b1b24" }}>
                    <b>{c.label}</b>{" "}
                    <button
                      onClick={() => {
                        const label = prompt("Nuevo título de columna:", c.label);
                        if (label) renameColumn(c.id, label);
                      }}
                      style={{ marginLeft: 6, padding: "2px 8px", borderRadius: 10, cursor: "pointer" }}
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => deleteColumn(c)}
                      style={{ marginLeft: 6, padding: "2px 8px", borderRadius: 10, cursor: "pointer", background: "#ff4f6d", color: "white", border: 0 }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                      <td style={{ padding: "10px 8px" }}>
                        <input
                          value={p.name}
                          onChange={(e) => updateProcedureNameLocal(p.id, e.target.value)}
                          style={{ width: "100%", padding: "10px 10px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)" }}
                        />
                        <div style={{ marginTop: 6 }}>
                          <button
                            onClick={() => deleteProcedure(p.id)}
                            style={{ padding: "6px 10px", borderRadius: 10, cursor: "pointer", background: "#ff4f6d", color: "white", border: 0 }}
                          >
                            Borrar
                          </button>
                        </div>
                      </td>

                      {cols.map((c) => {
                        const row = priceIndex.get(`${p.id}|${c.key}`);
                        const val = row?.price ?? "";
                        return (
                          <td key={c.id} style={{ padding: "10px 8px", width: 170 }}>
                            <input
                              value={val === null ? "" : String(val)}
                              onChange={(e) => updatePriceLocal(p.id, c.key, e.target.value)}
                              placeholder="0.00"
                              style={{
                                width: "100%",
                                textAlign: "right",
                                padding: "10px 10px",
                                borderRadius: 10,
                                border: "1px solid rgba(0,0,0,0.12)",
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  <AddProcedureRow cols={cols} onAdd={(name) => createProcedure(cat.id, name)} />
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AddProcedureRow({ cols, onAdd }) {
  const [name, setName] = useState("");

  return (
    <tr>
      <td style={{ padding: "10px 8px" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nuevo procedimiento..."
            style={{ width: "min(520px, 100%)", padding: "10px 10px", borderRadius: 10, border: "1px dashed rgba(0,0,0,0.22)" }}
          />
          <button
            onClick={() => {
              const n = name.trim();
              if (!n) return;
              onAdd(n);
              setName("");
            }}
            style={{ padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
          >
            + Agregar
          </button>
        </div>
      </td>

      {cols.map((c) => (
        <td key={c.id} style={{ padding: "10px 8px" }}>
          <div style={{ opacity: 0.45, textAlign: "right" }}>—</div>
        </td>
      ))}
    </tr>
  );
}
