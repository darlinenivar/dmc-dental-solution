// src/pages/Odontograma.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createOdontogramForPatient,
  deleteOdontogram,
  loadOdontogramsByPatient,
  loadPatients,
  updateOdontogram,
} from "../lib/storage";

// ===================
// Config de estados
// ===================
const ESTADOS = [
  { key: "Sano", color: "#22c55e" },
  { key: "Caries", color: "#ef4444" },
  { key: "Restauración", color: "#3b82f6" },
  { key: "Endodoncia", color: "#f59e0b" },
  { key: "Corona", color: "#a855f7" },
  { key: "Extracción", color: "#111827" },
  { key: "Implante", color: "#06b6d4" },
  { key: "Observación", color: "#64748b" },
  { key: "Sellante", color: "#14b8a6" },
];

const SURFACES = [
  { key: "O", label: "Oclusal" },
  { key: "M", label: "Mesial" },
  { key: "D", label: "Distal" },
  { key: "B", label: "Bucal" },
  { key: "L", label: "Lingual/Palatino" },
];

const UPPER_LEFT = ["18","17","16","15","14","13","12","11"];
const UPPER_RIGHT = ["21","22","23","24","25","26","27","28"];
const LOWER_LEFT = ["48","47","46","45","44","43","42","41"];
const LOWER_RIGHT = ["31","32","33","34","35","36","37","38"];

const DEFAULT_TOOTH = "11";

function s(v) {
  return (v || "").toString().toLowerCase();
}

function labelPatient(p) {
  const dob = p?.fechaNacimiento?.trim();
  return dob ? `${p.nombre} — ${dob}` : `${p.nombre}`;
}

function matchPatient(p, q) {
  const query = s(q).trim();
  if (!query) return false;
  return (
    s(p.nombre).includes(query) ||
    s(p.telefono).includes(query) ||
    s(p.email).includes(query) ||
    s(p.fechaNacimiento).includes(query)
  );
}

function estadoColor(estado) {
  return ESTADOS.find((e) => e.key === estado)?.color || "#94a3b8";
}

function ensureToothShape(toothObj) {
  // Compatibilidad: si venía sin surfaces, las creamos
  const base = toothObj || { estado: "Sano", nota: "" };
  const surfaces = { ...(base.surfaces || {}) };
  for (const k of SURFACES.map((x) => x.key)) {
    if (!surfaces[k]) surfaces[k] = "Sano";
  }
  return { ...base, surfaces };
}

export default function Odontograma() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [odontograms, setOdontograms] = useState([]);
  const [selectedOdoId, setSelectedOdoId] = useState("");

  const [selectedTooth, setSelectedTooth] = useState(DEFAULT_TOOTH);
  const [selectedTool, setSelectedTool] = useState("Caries"); // estado a aplicar
  const [dirty, setDirty] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setPatients(loadPatients());
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return patients.filter((p) => matchPatient(p, q)).slice(0, 10);
  }, [query, patients]);

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  useEffect(() => {
    if (!selectedPatientId) {
      setOdontograms([]);
      setSelectedOdoId("");
      setSelectedTooth(DEFAULT_TOOTH);
      setDirty(false);
      return;
    }
    const list = loadOdontogramsByPatient(selectedPatientId)
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt);
    setOdontograms(list);
    setSelectedOdoId(list[0]?.id || "");
    setSelectedTooth(DEFAULT_TOOTH);
    setDirty(false);
  }, [selectedPatientId]);

  const selectedOdo = useMemo(() => {
    return odontograms.find((o) => o.id === selectedOdoId) || null;
  }, [odontograms, selectedOdoId]);

  const tooth = useMemo(() => {
    if (!selectedOdo) return ensureToothShape(null);
    const raw = selectedOdo.teeth?.[selectedTooth];
    return ensureToothShape(raw);
  }, [selectedOdo, selectedTooth]);

  function refreshOdontograms() {
    const list = loadOdontogramsByPatient(selectedPatientId)
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt);
    setOdontograms(list);
  }

  function pickPatient(p) {
    setSelectedPatientId(p.id);
    setQuery("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function createNewOdontogram() {
    if (!selectedPatientId) return;
    const created = createOdontogramForPatient(selectedPatientId);
    refreshOdontograms();
    setSelectedOdoId(created.id);
    setSelectedTooth(DEFAULT_TOOTH);
    setDirty(false);
  }

  function removeOdontogram(id) {
    if (!selectedPatientId) return;
    deleteOdontogram(selectedPatientId, id);
    refreshOdontograms();
    setSelectedOdoId((prev) => {
      const list = loadOdontogramsByPatient(selectedPatientId).sort((a, b) => b.createdAt - a.createdAt);
      return list[0]?.id || "";
    });
    setDirty(false);
  }

  // ✅ Aplicar estado a superficie
  function applyToSurface(surfaceKey) {
    if (!selectedPatientId || !selectedOdoId) return;

    const next = updateOdontogram(selectedPatientId, selectedOdoId, (prev) => {
      const teeth = { ...(prev.teeth || {}) };
      const current = ensureToothShape(teeth[selectedTooth]);
      const surfaces = { ...(current.surfaces || {}) };
      surfaces[surfaceKey] = selectedTool;

      // Estado general del diente: si alguna superficie no es Sano, lo marcamos como "Con hallazgos"
      const anyFinding = Object.values(surfaces).some((v) => v && v !== "Sano");
      const estadoGeneral = anyFinding ? "Observación" : "Sano";

      teeth[selectedTooth] = {
        ...current,
        estado: estadoGeneral,
        surfaces,
      };

      return { ...prev, teeth };
    });

    setOdontograms((arr) => arr.map((o) => (o.id === next.id ? next : o)));
    setDirty(true);
  }

  function setNota(nota) {
    if (!selectedPatientId || !selectedOdoId) return;

    const next = updateOdontogram(selectedPatientId, selectedOdoId, (prev) => {
      const teeth = { ...(prev.teeth || {}) };
      const current = ensureToothShape(teeth[selectedTooth]);
      teeth[selectedTooth] = { ...current, nota };
      return { ...prev, teeth };
    });

    setOdontograms((arr) => arr.map((o) => (o.id === next.id ? next : o)));
    setDirty(true);
  }

  function clearTooth() {
    if (!selectedPatientId || !selectedOdoId) return;

    const next = updateOdontogram(selectedPatientId, selectedOdoId, (prev) => {
      const teeth = { ...(prev.teeth || {}) };
      teeth[selectedTooth] = ensureToothShape({ estado: "Sano", nota: "", surfaces: {} });
      // deja todo sano
      const fixed = ensureToothShape(teeth[selectedTooth]);
      for (const k of SURFACES.map((x) => x.key)) fixed.surfaces[k] = "Sano";
      fixed.estado = "Sano";
      fixed.nota = "";
      teeth[selectedTooth] = fixed;
      return { ...prev, teeth };
    });

    setOdontograms((arr) => arr.map((o) => (o.id === next.id ? next : o)));
    setDirty(true);
  }

  function saveNow() {
    setDirty(false); // ya se guarda con cada cambio
  }

  // Estado visual del diente (badge)
  const badgeColor = estadoColor(selectedTool);

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="row" style={{ alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="h2">Odontograma • Premium</div>
            <div className="muted">Clic por superficies (O/M/D/B/L) • Historial por paciente</div>
          </div>

          <div className="row" style={{ gap: 10, alignItems: "center" }}>
            <span className={`pill ${dirty ? "pill-warn" : "pill-ok"}`}>
              {dirty ? "Cambios sin guardar" : "Guardado"}
            </span>
            <button className="btn btn-primary" onClick={saveNow} disabled={!dirty}>
              Guardar
            </button>
          </div>
        </div>
      </div>

      <div className="grid-odo">
        {/* LEFT */}
        <div className="card">
          <div className="h3" style={{ marginBottom: 8 }}>Buscar paciente</div>

          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              className="input"
              placeholder="Nombre, fecha nacimiento, teléfono o email…"
              defaultValue={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {results.length > 0 && (
              <div className="dropdown">
                {results.map((p) => (
                  <button key={p.id} className="dropdown-item" onClick={() => pickPatient(p)}>
                    <div style={{ fontWeight: 900 }}>{p.nombre}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {p.fechaNacimiento ? `📅 ${p.fechaNacimiento}` : "📅 (sin fecha)"}{" "}
                      {p.telefono ? ` • 📞 ${p.telefono}` : ""}{" "}
                      {p.email ? ` • ✉️ ${p.email}` : ""}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="h3">Paciente</div>
            <div className="muted" style={{ marginTop: 4 }}>
              {selectedPatient ? labelPatient(selectedPatient) : "Ninguno"}
            </div>
          </div>

          <div className="hr" />

          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div className="h3">Odontogramas</div>
            <button className="btn btn-primary" onClick={createNewOdontogram} disabled={!selectedPatientId}>
              + Nuevo
            </button>
          </div>

          {!selectedPatientId ? (
            <div className="muted" style={{ marginTop: 10 }}>
              Selecciona un paciente para ver/crear odontogramas.
            </div>
          ) : odontograms.length === 0 ? (
            <div className="muted" style={{ marginTop: 10 }}>
              No hay odontogramas. Crea uno nuevo.
            </div>
          ) : (
            <div className="list" style={{ marginTop: 10 }}>
              {odontograms.map((o) => (
                <div
                  key={o.id}
                  className={`list-item ${o.id === selectedOdoId ? "active" : ""}`}
                  onClick={() => {
                    setSelectedOdoId(o.id);
                    setSelectedTooth(DEFAULT_TOOTH);
                    setDirty(false);
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900 }}>{o.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <button
                    className="btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOdontogram(o.id);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CENTER */}
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="h3">Mapa dental por superficies</div>
              <div className="muted">Selecciona un diente y marca superficies (O/M/D/B/L)</div>
            </div>

            <span className="pill" style={{ borderColor: badgeColor }}>
              <span className="dot" style={{ background: badgeColor }} />
              Herramienta: {selectedTool}
            </span>
          </div>

          <div className="odo-board">
            <ToothRow
              title="Superior"
              left={UPPER_LEFT}
              right={UPPER_RIGHT}
              selected={selectedTooth}
              teeth={selectedOdo?.teeth || {}}
              onPick={setSelectedTooth}
            />
            <div className="odo-midline" />
            <ToothRow
              title="Inferior"
              left={LOWER_LEFT}
              right={LOWER_RIGHT}
              selected={selectedTooth}
              teeth={selectedOdo?.teeth || {}}
              onPick={setSelectedTooth}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="card">
          <div className="h3">Editor • Diente {selectedTooth}</div>

          {!selectedOdo ? (
            <div className="muted" style={{ marginTop: 10 }}>
              Selecciona un paciente y un odontograma.
            </div>
          ) : (
            <>
              <div style={{ marginTop: 12 }}>
                <div className="muted" style={{ marginBottom: 6 }}>Herramienta (qué vas a marcar)</div>
                <div className="chips">
                  {ESTADOS.map((e) => (
                    <button
                      key={e.key}
                      className={`chip ${selectedTool === e.key ? "active" : ""}`}
                      onClick={() => setSelectedTool(e.key)}
                    >
                      <span className="dot" style={{ background: e.color }} />
                      {e.key}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hr" />

              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="h3">Diente interactivo</div>
                  <div className="muted" style={{ fontSize: 12 }}>Clic en una superficie para aplicar la herramienta</div>
                </div>
                <button className="btn btn-danger" onClick={clearTooth}>
                  Limpiar diente
                </button>
              </div>

              <div style={{ marginTop: 10 }}>
                <ToothSVG
                  tooth={ensureToothShape(tooth)}
                  onSurfaceClick={(k) => applyToSurface(k)}
                />
              </div>

              <div className="hr" />

              <div className="h3">Superficies</div>
              <div className="surface-list" style={{ marginTop: 10 }}>
                {SURFACES.map((sf) => {
                  const val = tooth.surfaces?.[sf.key] || "Sano";
                  return (
                    <div key={sf.key} className="surface-item">
                      <div style={{ fontWeight: 900 }}>{sf.key}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{sf.label}</div>
                      <div className="pill" style={{ marginLeft: "auto", borderColor: estadoColor(val) }}>
                        <span className="dot" style={{ background: estadoColor(val) }} />
                        {val}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="muted" style={{ marginBottom: 6 }}>Nota clínica</div>
                <textarea
                  className="textarea"
                  value={tooth.nota || ""}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Ej: sensibilidad, dolor, plan, observación…"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* estilos de esta página */}
      <style>{`
        .grid-odo{
          display:grid;
          grid-template-columns: 340px 1fr 420px;
          gap:12px;
          align-items:start;
        }
        @media (max-width: 1100px){
          .grid-odo{ grid-template-columns: 1fr; }
        }
        .dropdown{
          position:absolute; left:0; right:0; top:42px;
          background: rgba(10,18,40,.98);
          border:1px solid var(--border);
          border-radius: 12px;
          overflow:hidden;
          z-index: 50;
          box-shadow: 0 18px 50px rgba(0,0,0,.35);
        }
        .dropdown-item{
          width:100%;
          text-align:left;
          padding:10px 12px;
          background:transparent;
          border:none;
          cursor:pointer;
          color: var(--text);
        }
        .dropdown-item:hover{ background: rgba(255,255,255,.06); }

        .list{ display:flex; flex-direction:column; gap:8px; }
        .list-item{
          display:flex; gap:10px; align-items:center;
          padding:10px;
          border:1px solid var(--border);
          border-radius: 14px;
          cursor:pointer;
          background: rgba(255,255,255,.03);
        }
        .list-item.active{ outline:2px solid rgba(59,130,246,.35); }

        .odo-board{ margin-top: 14px; }
        .odo-midline{
          height:1px; background: rgba(255,255,255,.08);
          margin: 14px 0;
        }
        .odo-row{
          display:grid;
          grid-template-columns: 1fr 18px 1fr;
          gap: 14px;
          align-items:center;
        }
        .tooth-grid{
          display:grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 10px;
        }
        .tooth{
          border:1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.04);
          border-radius: 14px;
          padding: 10px;
          min-height: 76px;
          cursor:pointer;
          transition: transform .08s ease, background .12s ease;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
        }
        .tooth:hover{ transform: translateY(-1px); background: rgba(255,255,255,.06); }
        .tooth.active{ outline:2px solid rgba(59,130,246,.40); }
        .tooth-num{ font-weight: 900; font-size: 12px; opacity:.9; }

        .mini-surfaces{
          display:grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          margin-top: 8px;
        }
        .mini-surface{
          height: 10px;
          border-radius: 8px;
          background: rgba(255,255,255,.08);
          overflow:hidden;
        }

        .chips{ display:flex; flex-wrap:wrap; gap:8px; }
        .chip{
          border:1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.04);
          color: var(--text);
          border-radius: 999px;
          padding: 8px 10px;
          cursor:pointer;
          display:flex; gap:8px; align-items:center;
          font-weight: 900;
          font-size: 13px;
        }
        .chip.active{ outline:2px solid rgba(59,130,246,.35); }
        .dot{ width:10px; height:10px; border-radius: 999px; display:inline-block; }

        .surface-list{
          display:flex;
          flex-direction:column;
          gap:8px;
        }
        .surface-item{
          display:flex;
          align-items:center;
          gap:10px;
          border:1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.03);
          border-radius: 14px;
          padding:10px;
        }

        .pill-ok{ border-color: rgba(34,197,94,.35) !important; }
        .pill-warn{ border-color: rgba(245,158,11,.35) !important; }

        .toothsvg-wrap{
          border: 1px solid rgba(255,255,255,.10);
          background: rgba(255,255,255,.03);
          border-radius: 18px;
          padding: 12px;
        }
        .toothsvg-hint{
          margin-top: 8px;
          font-size: 12px;
          color: var(--muted);
        }
        .svg-surface{
          cursor:pointer;
          transition: filter .12s ease, opacity .12s ease;
        }
        .svg-surface:hover{
          filter: brightness(1.15);
        }
      `}</style>
    </div>
  );
}

// ===================
// Componentes UI
// ===================
function ToothRow({ title, left, right, selected, teeth, onPick }) {
  return (
    <div>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
        <div className="h3">{title}</div>
        <div className="muted" style={{ fontSize: 12 }}>FDI</div>
      </div>

      <div className="odo-row">
        <div className="tooth-grid">
          {left.map((n) => (
            <ToothCard key={n} n={n} selected={selected} info={teeth?.[n]} onPick={onPick} />
          ))}
        </div>

        <div />

        <div className="tooth-grid">
          {right.map((n) => (
            <ToothCard key={n} n={n} selected={selected} info={teeth?.[n]} onPick={onPick} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ToothCard({ n, selected, info, onPick }) {
  const t = ensureToothShape(info);
  const srf = t.surfaces || {};
  const order = ["O", "M", "D", "B", "L"];

  return (
    <div className={`tooth ${selected === n ? "active" : ""}`} onClick={() => onPick(n)}>
      <div className="tooth-num">#{n}</div>

      <div className="mini-surfaces">
        {order.map((k) => {
          const val = srf[k] || "Sano";
          return (
            <div key={k} className="mini-surface" title={`${k}: ${val}`}>
              <div style={{ height: "100%", width: "100%", background: estadoColor(val) }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================
// Tooth SVG (clic por superficies)
// Layout simple, elegante y usable
// ===================
function ToothSVG({ tooth, onSurfaceClick }) {
  const surfaces = tooth.surfaces || {};

  // colores por superficie
  const cO = estadoColor(surfaces.O || "Sano");
  const cM = estadoColor(surfaces.M || "Sano");
  const cD = estadoColor(surfaces.D || "Sano");
  const cB = estadoColor(surfaces.B || "Sano");
  const cL = estadoColor(surfaces.L || "Sano");

  return (
    <div className="toothsvg-wrap">
      <svg viewBox="0 0 220 260" width="100%" height="260" role="img" aria-label="Diente por superficies">
        {/* contorno */}
        <path
          d="M110 12
             C70 12, 40 40, 40 78
             C40 116, 58 138, 70 165
             C82 192, 82 240, 110 248
             C138 240, 138 192, 150 165
             C162 138, 180 116, 180 78
             C180 40, 150 12, 110 12Z"
          fill="rgba(255,255,255,.06)"
          stroke="rgba(255,255,255,.18)"
          strokeWidth="2"
        />

        {/* Oclusal (centro) */}
        <path
          className="svg-surface"
          onClick={() => onSurfaceClick("O")}
          d="M110 54
             C92 54, 78 66, 78 82
             C78 98, 92 110, 110 110
             C128 110, 142 98, 142 82
             C142 66, 128 54, 110 54Z"
          fill={cO}
          opacity="0.95"
        />

        {/* Mesial (izquierda) */}
        <path
          className="svg-surface"
          onClick={() => onSurfaceClick("M")}
          d="M48 82
             C48 52, 70 28, 96 22
             L96 120
             C78 116, 60 104, 48 82Z"
          fill={cM}
          opacity="0.95"
        />

        {/* Distal (derecha) */}
        <path
          className="svg-surface"
          onClick={() => onSurfaceClick("D")}
          d="M172 82
             C172 52, 150 28, 124 22
             L124 120
             C142 116, 160 104, 172 82Z"
          fill={cD}
          opacity="0.95"
        />

        {/* Bucal (frontal) */}
        <path
          className="svg-surface"
          onClick={() => onSurfaceClick("B")}
          d="M70 165
             C86 140, 134 140, 150 165
             C142 200, 136 236, 110 244
             C84 236, 78 200, 70 165Z"
          fill={cB}
          opacity="0.95"
        />

        {/* Lingual/Palatino (posterior) */}
        <path
          className="svg-surface"
          onClick={() => onSurfaceClick("L")}
          d="M78 120
             C94 128, 126 128, 142 120
             C150 132, 158 146, 150 165
             C134 140, 86 140, 70 165
             C62 146, 70 132, 78 120Z"
          fill={cL}
          opacity="0.95"
        />

        {/* labels */}
        <text x="110" y="36" textAnchor="middle" fill="rgba(255,255,255,.70)" fontSize="12" fontWeight="700">
          O
        </text>
        <text x="62" y="70" textAnchor="middle" fill="rgba(255,255,255,.70)" fontSize="12" fontWeight="700">
          M
        </text>
        <text x="158" y="70" textAnchor="middle" fill="rgba(255,255,255,.70)" fontSize="12" fontWeight="700">
          D
        </text>
        <text x="110" y="198" textAnchor="middle" fill="rgba(255,255,255,.70)" fontSize="12" fontWeight="700">
          B
        </text>
        <text x="110" y="138" textAnchor="middle" fill="rgba(255,255,255,.70)" fontSize="12" fontWeight="700">
          L
        </text>
      </svg>

      <div className="toothsvg-hint">
        Tip: selecciona una “Herramienta” arriba (Caries, Restauración…) y luego haz clic en una superficie.
      </div>
    </div>
  );
}
