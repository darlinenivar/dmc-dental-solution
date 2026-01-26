import React, { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/settings.css";

const LS_IMPORTED = "dmc.importedPatients.v1";
const LS_ACTIVE_CLINIC = "dmc.activeClinicId.v1";

function getActiveClinicId() {
  return localStorage.getItem(LS_ACTIVE_CLINIC) || "";
}

function parseCSV(text) {
  // CSV simple: separa por líneas y comas. (sirve para 90% de casos)
  // Soporta comillas básicas.
  const rows = [];
  const lines = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length);

  if (!lines.length) return { headers: [], rows: [] };

  const splitLine = (line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        out.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur.trim());
    return out;
  };

  const headers = splitLine(lines[0]).map((h) =>
    h
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w]/g, "")
  );

  for (let i = 1; i < lines.length; i++) {
    const cols = splitLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] ?? "").trim();
    });
    rows.push(obj);
  }

  return { headers, rows };
}

function normalizePatient(row) {
  // Acepta headers comunes
  const first_name = row.first_name || row.nombre || row.name || "";
  const last_name = row.last_name || row.apellido || row.lastname || "";
  const phone = row.phone || row.telefono || row.celular || "";
  const email = row.email || row.correo || "";
  const dob = row.dob || row.fecha_nacimiento || row.birthdate || "";
  const notes = row.notes || row.notas || "";
  return { first_name, last_name, phone, email, dob, notes };
}

export default function ImportarPaciente() {
  const [mode, setMode] = useState("file"); // file | paste
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const clinicId = getActiveClinicId();

  const parsed = useMemo(() => {
    if (!csvText.trim()) return { headers: [], rows: [] };
    return parseCSV(csvText);
  }, [csvText]);

  const preview = useMemo(() => {
    return parsed.rows.slice(0, 5).map(normalizePatient);
  }, [parsed.rows]);

  const onPickFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setCsvText(text);
  };

  const saveFallbackLocal = (patients) => {
    const prev = JSON.parse(localStorage.getItem(LS_IMPORTED) || "[]");
    const next = [
      ...patients.map((p) => ({
        id: crypto.randomUUID?.() || String(Date.now()) + Math.random(),
        ...p,
        created_at: new Date().toISOString(),
        clinic_id: clinicId || null,
        source: "import",
      })),
      ...prev,
    ];
    localStorage.setItem(LS_IMPORTED, JSON.stringify(next));
  };

  const tryInsertSupabase = async (patients) => {
    // Intenta insertar en tabla "patients" si existe.
    // Si tu tabla se llama diferente, luego lo ajustamos.
    const payload = patients.map((p) => ({
      clinic_id: clinicId || null,
      first_name: p.first_name,
      last_name: p.last_name,
      phone: p.phone,
      email: p.email,
      dob: p.dob || null,
      notes: p.notes || null,
      source: "import",
    }));

    const { error } = await supabase.from("patients").insert(payload);
    if (error) throw error;
  };

  const onImport = async () => {
    try {
      setBusy(true);
      setResult(null);

      const normalized = parsed.rows.map(normalizePatient).filter((p) => {
        const full = `${p.first_name} ${p.last_name}`.trim();
        return full.length || p.phone || p.email;
      });

      if (!normalized.length) {
        setResult({ ok: false, msg: "No se detectaron filas válidas en el CSV." });
        return;
      }

      // Guardar local siempre (para no perder nada)
      saveFallbackLocal(normalized);

      // Intentar Supabase
      try {
        await tryInsertSupabase(normalized);
        setResult({
          ok: true,
          msg: `Importación completa: ${normalized.length} pacientes guardados (Supabase + respaldo local).`,
        });
      } catch (e) {
        console.warn("Supabase insert failed, usando solo respaldo local:", e);
        setResult({
          ok: true,
          msg: `Importación completa: ${normalized.length} pacientes guardados en respaldo local. (Supabase no listo todavía)`,
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Importar pacientes</h1>
          <p className="settings-subtitle">
            Importa desde CSV (Excel/Google Sheets). Funciona con Supabase si la tabla <span className="kbd">patients</span> existe;
            si no, guarda respaldo local para no perder nada.
          </p>
        </div>
        <div className="badge">⬇️ Import</div>
      </div>

      {!clinicId && (
        <div className="notice card" style={{ marginBottom: 14 }}>
          ⚠️ <b>No hay clínica activa.</b> Igual puedes importar; quedará en respaldo local.
          <div style={{ marginTop: 8, opacity: 0.8 }}>
            (Luego enlazamos pacientes a la clínica cuando tengas <span className="kbd">clinic_id</span> listo.)
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="flex">
          <button className={`btn ${mode === "file" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("file")} type="button">
            Subir archivo CSV
          </button>
          <button className={`btn ${mode === "paste" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("paste")} type="button">
            Pegar CSV
          </button>
          <div className="right" style={{ opacity: 0.8, fontSize: 13 }}>
            Tip: en Google Sheets → Archivo → Descargar → <b>CSV</b>
          </div>
        </div>

        <div style={{ marginTop: 12 }} />

        {mode === "file" ? (
          <div className="grid-2">
            <div className="row">
              <div className="label">Archivo</div>
              <input
                className="input"
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => onPickFile(e.target.files?.[0])}
              />
              {fileName ? <div style={{ fontSize: 13, opacity: 0.8 }}>📄 {fileName}</div> : null}
            </div>

            <div className="row">
              <div className="label">Formato recomendado (headers)</div>
              <div className="notice">
                <div style={{ fontSize: 13 }}>
                  <span className="kbd">first_name</span>, <span className="kbd">last_name</span>, <span className="kbd">phone</span>,{" "}
                  <span className="kbd">email</span>, <span className="kbd">dob</span>, <span className="kbd">notes</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
                  También acepta: <span className="kbd">nombre</span>, <span className="kbd">apellido</span>, <span className="kbd">telefono</span>,{" "}
                  <span className="kbd">correo</span>, <span className="kbd">fecha_nacimiento</span>, <span className="kbd">notas</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="label">Pega el CSV aquí</div>
            <textarea className="textarea" value={csvText} onChange={(e) => setCsvText(e.target.value)} placeholder="first_name,last_name,phone,email,dob,notes&#10;Ana,Rivera,8095550000,ana@email.com,1990-01-01,Paciente nuevo" />
          </div>
        )}
      </div>

      <div className="card">
        <div className="flex" style={{ marginBottom: 10 }}>
          <div className="badge">👀 Preview</div>
          <div style={{ opacity: 0.75, fontSize: 13 }}>
            Filas detectadas: <b>{parsed.rows.length}</b>
          </div>
          <button className="btn btn-primary right" onClick={onImport} disabled={busy || !csvText.trim()} type="button">
            {busy ? "Importando..." : "Importar pacientes"}
          </button>
        </div>

        {preview.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Fecha nac.</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((p, idx) => (
                <tr key={idx}>
                  <td>{`${p.first_name} ${p.last_name}`.trim() || "-"}</td>
                  <td>{p.phone || "-"}</td>
                  <td>{p.email || "-"}</td>
                  <td>{p.dob || "-"}</td>
                  <td>{p.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="notice">Carga o pega un CSV para ver la previsualización.</div>
        )}

        {result ? (
          <div className="notice" style={{ marginTop: 12, borderColor: result.ok ? "rgba(31,111,235,.35)" : "rgba(209,36,47,.35)" }}>
            {result.ok ? "✅ " : "❌ "}
            {result.msg}
          </div>
        ) : null}
      </div>
    </div>
  );
}
