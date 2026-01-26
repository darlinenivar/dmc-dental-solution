import { useMemo, useState } from "react";

const STATUS = [
  "Sano",
  "Caries",
  "Restauración",
  "Endodoncia",
  "Corona",
  "Extracción",
  "Implante",
  "Puente",
  "Observación",
];

const TREATMENTS = [
  "Evaluación",
  "Limpieza",
  "Resina",
  "Corona",
  "Endodoncia",
  "Extracción",
  "Implante",
  "Puente",
  "Sellante",
  "Blanqueamiento",
  "Otro",
];

export default function ToothEditor({
  open,
  tooth,
  value, // {estado, nota}
  treatments = [],
  onClose,
  onSaveTooth,
  onAddTreatment,          // (t) => void
  onDeleteTreatment,       // (id) => void
  onUpdateTreatment,       // (id, patch) => void   <-- NUEVO
  onResetTooth,
}) {
  const current = value || { estado: "Sano", nota: "" };

  const [t, setT] = useState({
    fecha: "",
    tipo: "Limpieza",
    nota: "",
    costo: "", // string para input
  });

  const canAdd = useMemo(() => {
    return !!t.fecha && !!t.tipo;
  }, [t]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="card-title">Diente #{tooth}</div>
            <div className="card-text">Estado + nota + tratamientos (con precio).</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div style={{ height: 14 }} />

        {/* Estado / Nota */}
        <div className="form-grid">
          <div className="field field-full">
            <div className="label-row">
              <label className="label">Estado</label>
            </div>
            <select
              className="input"
              value={current.estado}
              onChange={(e) => onSaveTooth({ ...current, estado: e.target.value })}
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field field-full">
            <div className="label-row">
              <label className="label">Nota del diente</label>
            </div>
            <textarea
              className="input"
              rows={3}
              value={current.nota}
              onChange={(e) => onSaveTooth({ ...current, nota: e.target.value })}
              placeholder="Ej: caries distal, sensibilidad..."
            />
          </div>
        </div>

        <div style={{ height: 10 }} />

        {/* Tratamientos */}
        <div className="card" style={{ background: "rgba(255,255,255,.03)" }}>
          <div className="card-title">Tratamientos</div>
          <div className="card-text">Agrega múltiples tratamientos con costo.</div>

          <div style={{ height: 12 }} />

          <div className="form-grid">
            <div className="field">
              <div className="label-row">
                <label className="label">Fecha</label>
              </div>
              <input
                type="date"
                className="input"
                value={t.fecha}
                onChange={(e) => setT((p) => ({ ...p, fecha: e.target.value }))}
              />
            </div>

            <div className="field">
              <div className="label-row">
                <label className="label">Tipo</label>
              </div>
              <select
                className="input"
                value={t.tipo}
                onChange={(e) => setT((p) => ({ ...p, tipo: e.target.value }))}
              >
                {TREATMENTS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <div className="label-row">
                <label className="label">Costo (opcional)</label>
              </div>
              <input
                className="input"
                inputMode="decimal"
                value={t.costo}
                onChange={(e) => setT((p) => ({ ...p, costo: e.target.value }))}
                placeholder="Ej: 1500"
              />
            </div>

            <div className="field field-full">
              <div className="label-row">
                <label className="label">Nota (opcional)</label>
              </div>
              <input
                className="input"
                value={t.nota}
                onChange={(e) => setT((p) => ({ ...p, nota: e.target.value }))}
                placeholder="Ej: resina MO, anestesia..."
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              className="btn btn-sm"
              disabled={!canAdd}
              style={{ opacity: canAdd ? 1 : 0.55 }}
              onClick={() => {
                if (!canAdd) return;
                const costoNum = t.costo.trim() === "" ? 0 : Number(t.costo);
                onAddTreatment({
                  fecha: t.fecha,
                  tipo: t.tipo,
                  nota: t.nota,
                  costo: Number.isFinite(costoNum) ? costoNum : 0,
                });
                setT({ fecha: "", tipo: "Limpieza", nota: "", costo: "" });
              }}
              type="button"
            >
              + Agregar tratamiento
            </button>
          </div>

          <div style={{ height: 10 }} />

          {treatments.length === 0 ? (
            <div className="muted">— Sin tratamientos —</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Nota</th>
                    <th>Costo</th>
                    <th style={{ width: 220 }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments
                    .slice()
                    .sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""))
                    .map((x) => (
                      <tr key={x.id}>
                        <td>{x.fecha || "-"}</td>
                        <td>{x.tipo}</td>
                        <td>{x.nota || "-"}</td>
                        <td>${Number(x.costo || 0).toFixed(2)}</td>
                        <td>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              type="button"
                              onClick={() => {
                                const newCost = prompt("Costo:", String(x.costo ?? 0));
                                if (newCost === null) return;
                                const n = Number(newCost);
                                onUpdateTreatment(x.id, { costo: Number.isFinite(n) ? n : 0 });
                              }}
                            >
                              Editar costo
                            </button>

                            <button
                              className="btn btn-secondary btn-sm"
                              type="button"
                              onClick={() => {
                                const newNote = prompt("Nota:", String(x.nota ?? ""));
                                if (newNote === null) return;
                                onUpdateTreatment(x.id, { nota: newNote });
                              }}
                            >
                              Editar nota
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              type="button"
                              onClick={() => onDeleteTreatment(x.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 12 }}>
          <button className="btn btn-danger btn-sm" type="button" onClick={onResetTooth}>
            Reset diente a Sano
          </button>
          <button className="btn btn-sm" type="button" onClick={onClose}>
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
