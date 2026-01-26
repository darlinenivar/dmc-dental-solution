import { useEffect, useMemo, useState } from "react";
import ToothEditor from "./ToothEditor";
import { oid, todayISO } from "../lib/odontogramStorage";

const TEETH = Array.from({ length: 32 }, (_, i) => i + 1);

export default function OdontogramPanel({ patientId, store, setStore }) {
  const list = store[patientId] || [];

  useEffect(() => {
    if (!patientId) return;
    if (list.length > 0) return;

    const first = {
      id: oid(),
      name: "Odontograma inicial",
      createdAt: Date.now(),
      teeth: {},
      treatments: {},
    };

    setStore((prev) => ({ ...prev, [patientId]: [first] }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const safeList = store[patientId] || [];
  const [activeOdontogramId, setActiveOdontogramId] = useState(() => safeList[0]?.id || "");

  useEffect(() => {
    if (!patientId) return;
    if (!activeOdontogramId && safeList[0]?.id) setActiveOdontogramId(safeList[0].id);
  }, [patientId, safeList, activeOdontogramId]);

  const current = useMemo(() => {
    return (safeList || []).find((x) => x.id === activeOdontogramId) || null;
  }, [safeList, activeOdontogramId]);

  const [activeTooth, setActiveTooth] = useState(null);

  function updateCurrent(patch) {
    if (!current) return;
    setStore((prev) => ({
      ...prev,
      [patientId]: (prev[patientId] || []).map((x) => (x.id === current.id ? { ...x, ...patch } : x)),
    }));
  }

  function createNewOdontogram() {
    const newOne = { id: oid(), name: `Odontograma ${todayISO()}`, createdAt: Date.now(), teeth: {}, treatments: {} };
    setStore((prev) => ({ ...prev, [patientId]: [newOne, ...(prev[patientId] || [])] }));
    setActiveOdontogramId(newOne.id);
    setActiveTooth(null);
  }

  function deleteOdontogram() {
    if (!current) return;
    const ok = confirm(`¿Eliminar "${current.name}"?`);
    if (!ok) return;

    setStore((prev) => {
      const next = (prev[patientId] || []).filter((x) => x.id !== current.id);
      return { ...prev, [patientId]: next };
    });

    const remaining = safeList.filter((x) => x.id !== current.id);
    setActiveOdontogramId(remaining[0]?.id || "");
    setActiveTooth(null);
  }

  function renameOdontogram() {
    if (!current) return;
    const name = prompt("Nuevo nombre del odontograma:", current.name);
    if (!name || !name.trim()) return;
    updateCurrent({ name: name.trim() });
  }

  function setToothValue(tooth, value) {
    if (!current) return;
    updateCurrent({ teeth: { ...(current.teeth || {}), [String(tooth)]: value } });
  }

  function toothValue(tooth) {
    return current?.teeth?.[String(tooth)] || { estado: "Sano", nota: "" };
  }

  function statusOf(tooth) {
    return toothValue(tooth).estado || "Sano";
  }

  function noteOf(tooth) {
    return toothValue(tooth).nota || "";
  }

  function treatmentsOf(tooth) {
    return current?.treatments?.[String(tooth)] || [];
  }

  function addTreatment(tooth, t) {
    if (!current) return;
    const newItem = { id: oid(), ...t };
    updateCurrent({
      treatments: { ...(current.treatments || {}), [String(tooth)]: [newItem, ...(treatmentsOf(tooth) || [])] },
    });
  }

  function deleteTreatment(tooth, tid) {
    if (!current) return;
    updateCurrent({
      treatments: { ...(current.treatments || {}), [String(tooth)]: (treatmentsOf(tooth) || []).filter((x) => x.id !== tid) },
    });
  }

  function updateTreatment(tooth, tid, patch) {
    if (!current) return;
    updateCurrent({
      treatments: {
        ...(current.treatments || {}),
        [String(tooth)]: (treatmentsOf(tooth) || []).map((x) => (x.id === tid ? { ...x, ...patch } : x)),
      },
    });
  }

  function resetTooth(tooth) {
    setToothValue(tooth, { estado: "Sano", nota: "" });
  }

  function clearAllTeeth() {
    if (!current) return;
    const ok = confirm("¿Borrar todos los dientes (estado/notas) de este odontograma?");
    if (!ok) return;
    updateCurrent({ teeth: {}, treatments: {} });
    setActiveTooth(null);
  }

  if (!patientId) {
    return (
      <div className="card">
        <div className="card-title">Selecciona un paciente</div>
        <div className="card-text">No hay paciente seleccionado.</div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="card">
        <div className="card-title">Cargando odontograma…</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="odo-head">
        <div>
          <div className="card-title">Odontograma</div>
          <div className="card-text">Varios odontogramas por paciente + tratamientos por diente.</div>
        </div>

        <div className="odo-actions">
          <select
            className="input select-sm"
            value={activeOdontogramId}
            onChange={(e) => {
              setActiveOdontogramId(e.target.value);
              setActiveTooth(null);
            }}
            style={{ width: 260 }}
          >
            {safeList.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <button className="btn btn-secondary btn-sm" type="button" onClick={renameOdontogram}>
            Renombrar
          </button>
          <button className="btn btn-sm" type="button" onClick={createNewOdontogram}>
            + Nuevo
          </button>
          <button className="btn btn-danger btn-sm" type="button" onClick={deleteOdontogram}>
            Eliminar
          </button>
          <button className="btn btn-danger btn-sm" type="button" onClick={clearAllTeeth}>
            Limpiar todo
          </button>
        </div>
      </div>

      <div style={{ height: 14 }} />

      <div className="odontogram">
        <div className="arch">
          <div className="arch-title">Superior (1–16)</div>
          <div className="teeth-grid">
            {TEETH.slice(0, 16).map((t) => (
              <ToothTile
                key={t}
                tooth={t}
                estado={statusOf(t)}
                nota={noteOf(t)}
                treatmentsCount={treatmentsOf(t).length}
                onClick={() => setActiveTooth(t)}
                active={activeTooth === t}
              />
            ))}
          </div>
        </div>

        <div className="arch">
          <div className="arch-title">Inferior (17–32)</div>
          <div className="teeth-grid">
            {TEETH.slice(16).map((t) => (
              <ToothTile
                key={t}
                tooth={t}
                estado={statusOf(t)}
                nota={noteOf(t)}
                treatmentsCount={treatmentsOf(t).length}
                onClick={() => setActiveTooth(t)}
                active={activeTooth === t}
              />
            ))}
          </div>
        </div>
      </div>

      <ToothEditor
        open={activeTooth !== null}
        tooth={activeTooth}
        value={activeTooth ? toothValue(activeTooth) : null}
        treatments={activeTooth ? treatmentsOf(activeTooth) : []}
        onClose={() => setActiveTooth(null)}
        onSaveTooth={(val) => activeTooth && setToothValue(activeTooth, val)}
        onAddTreatment={(t) => activeTooth && addTreatment(activeTooth, t)}
        onDeleteTreatment={(tid) => activeTooth && deleteTreatment(activeTooth, tid)}
        onUpdateTreatment={(tid, patch) => activeTooth && updateTreatment(activeTooth, tid, patch)}
        onResetTooth={() => activeTooth && resetTooth(activeTooth)}
      />
    </div>
  );
}

function ToothTile({ tooth, estado, nota, treatmentsCount, onClick, active }) {
  const cls = `tooth tooth-${keyOf(estado)}${active ? " tooth-active" : ""}`;
  const hint = [estado, nota?.trim() ? `Nota: ${nota}` : null, treatmentsCount ? `Tratamientos: ${treatmentsCount}` : null]
    .filter(Boolean)
    .join(" • ");

  return (
    <button className={cls} onClick={onClick} type="button" title={hint}>
      <div className="tooth-num">{tooth}</div>
      <div className="tooth-status">{estado}</div>
      <div className="tooth-badges">
        {nota?.trim() ? <span className="mini">📝</span> : null}
        {treatmentsCount ? <span className="mini">🧾 {treatmentsCount}</span> : null}
      </div>
    </button>
  );
}

function keyOf(estado) {
  const s = (estado || "").toLowerCase();
  if (s.includes("caries")) return "caries";
  if (s.includes("restaur")) return "restauracion";
  if (s.includes("endodon")) return "endo";
  if (s.includes("corona")) return "corona";
  if (s.includes("extrac")) return "extraccion";
  if (s.includes("implan")) return "implante";
  if (s.includes("puente")) return "puente";
  if (s.includes("observ")) return "obs";
  return "sano";
}
