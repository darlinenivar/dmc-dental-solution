import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/settings.css";

const LS_DEVICES = "dmc.devices.v1";

function loadDevices() {
  try {
    return JSON.parse(localStorage.getItem(LS_DEVICES) || "[]");
  } catch {
    return [];
  }
}
function saveDevices(devs) {
  localStorage.setItem(LS_DEVICES, JSON.stringify(devs));
}

function genPairCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s.slice(0, 4) + "-" + s.slice(4);
}

export default function ConectarEquipos() {
  const [devices, setDevices] = useState(loadDevices);
  const [pairCode, setPairCode] = useState(genPairCode());
  const [name, setName] = useState("");
  const [type, setType] = useState("PC");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => saveDevices(devices), [devices]);

  const pairedCount = useMemo(() => devices.filter((d) => d.status === "paired").length, [devices]);

  const tryInsertSupabase = async (device) => {
    const { data: u } = await supabase.auth.getUser();
    const userId = u?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from("devices").insert({
      user_id: userId,
      name: device.name,
      type: device.type,
      pair_code: device.pair_code,
      status: device.status,
      created_at: device.created_at,
    });
    if (error) throw error;
  };

  const onCreateDevice = async () => {
    if (!name.trim()) {
      setMsg("❌ Escribe un nombre para el equipo (ej: Recepción, Consultorio 1).");
      return;
    }

    const device = {
      id: crypto.randomUUID?.() || String(Date.now()) + Math.random(),
      name: name.trim(),
      type,
      pair_code: pairCode,
      status: "paired",
      created_at: new Date().toISOString(),
    };

    try {
      setBusy(true);
      setMsg("");

      setDevices((prev) => [device, ...prev]);
      setName("");
      setPairCode(genPairCode());

      try {
        await tryInsertSupabase(device);
        setMsg("✅ Equipo conectado (Supabase + local).");
      } catch (e) {
        console.warn("devices table not ready:", e);
        setMsg("✅ Equipo conectado localmente. (Supabase no listo todavía)");
      }
    } finally {
      setBusy(false);
    }
  };

  const onRemove = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Conectar equipos</h1>
          <p className="settings-subtitle">
            Conecta dispositivos (PC/Tablet/Móvil) para uso multi-estación. Genera un código y registra el equipo.
          </p>
        </div>
        <div className="badge">🔌 Devices</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="flex" style={{ marginBottom: 10 }}>
            <div className="badge">✅ Conectados: {pairedCount}</div>
            <div style={{ opacity: 0.75, fontSize: 13 }}>
              (Modo simple: registro directo. Luego añadimos pairing real por QR.)
            </div>
          </div>

          <div className="row">
            <div className="label">Nombre del equipo</div>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Recepción / Consultorio 1 / Tablet Dra." />

            <div className="label">Tipo</div>
            <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="PC">PC</option>
              <option value="Tablet">Tablet</option>
              <option value="Mobile">Móvil</option>
              <option value="Kiosk">Kiosco</option>
            </select>

            <div className="label">Código de conexión</div>
            <div className="notice flex">
              <span className="kbd" style={{ fontSize: 16, fontWeight: 900 }}>{pairCode}</span>
              <button className="btn btn-ghost right" onClick={() => setPairCode(genPairCode())} type="button">
                Regenerar
              </button>
            </div>

            <button className="btn btn-primary" onClick={onCreateDevice} disabled={busy} type="button">
              {busy ? "Conectando..." : "Conectar equipo"}
            </button>

            {msg ? <div className="notice">{msg}</div> : null}
          </div>
        </div>

        <div className="card">
          <div className="flex" style={{ marginBottom: 10 }}>
            <div className="badge">📋 Equipos</div>
            <div style={{ opacity: 0.75, fontSize: 13 }}>Eliminar aquí solo borra local (por ahora).</div>
          </div>

          {devices.length ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Código</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {devices.map((d) => (
                  <tr key={d.id}>
                    <td><b>{d.name}</b></td>
                    <td>{d.type}</td>
                    <td><span className="kbd">{d.pair_code}</span></td>
                    <td>
                      <button className="btn btn-danger" onClick={() => onRemove(d.id)} type="button">
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="notice">Aún no hay equipos conectados.</div>
          )}
        </div>
      </div>
    </div>
  );
}
