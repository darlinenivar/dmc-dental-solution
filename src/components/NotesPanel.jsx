// src/components/NotesPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { lsGet, lsSet } from "../lib/dashboardStorage";

const LS_NOTES = "dmc.dashboard.notes.v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function NotesPanel() {
  const [notes, setNotes] = useState(() =>
    lsGet(LS_NOTES, [{ id: uid(), text: "Recordatorios internos…", createdAt: Date.now() }])
  );

  const cleaned = useMemo(
    () => notes.filter((n) => typeof n?.text === "string"),
    [notes]
  );

  useEffect(() => {
    lsSet(LS_NOTES, cleaned);
  }, [cleaned]);

  const updateText = (id, text) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const addNote = () => {
    setNotes((prev) => [{ id: uid(), text: "", createdAt: Date.now() }, ...prev]);
  };

  const removeNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const move = (id, dir) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[newIdx];
      next[newIdx] = tmp;
      return next;
    });
  };

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <div className="card-title">Notas</div>
          <div className="card-sub">Auto-guardado</div>
        </div>

        <button className="btn-primary" onClick={addNote} type="button">
          + Nueva
        </button>
      </div>

      <div className="notes-list">
        {cleaned.length === 0 ? (
          <div className="muted">No hay notas.</div>
        ) : (
          cleaned.map((n) => (
            <div key={n.id} className="note-item">
              <div className="note-actions">
                <button className="btn-ghost" title="Subir" onClick={() => move(n.id, -1)} type="button">
                  ▲
                </button>
                <button className="btn-ghost" title="Bajar" onClick={() => move(n.id, 1)} type="button">
                  ▼
                </button>
                <button className="btn-danger" title="Eliminar" onClick={() => removeNote(n.id)} type="button">
                  ✕
                </button>
              </div>

              <textarea
                className="note-textarea"
                value={n.text}
                onChange={(e) => updateText(n.id, e.target.value)}
                placeholder="Escribe una nota…"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
