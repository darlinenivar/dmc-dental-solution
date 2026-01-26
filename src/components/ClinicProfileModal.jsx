import { useEffect, useState } from "react";
import { loadClinicProfile, saveClinicProfile } from "../lib/clinicStorage";

export default function ClinicProfileModal({ open, onClose }) {
  const [p, setP] = useState(loadClinicProfile());

  useEffect(() => {
    if (open) setP(loadClinicProfile());
  }, [open]);

  if (!open) return null;

  async function fileToDataUrl(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(String(reader.result || ""));
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  async function onPick(e, key) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setP((prev) => ({ ...prev, [key]: dataUrl }));
  }

  function clearImage(key) {
    setP((prev) => ({ ...prev, [key]: "" }));
  }

  function save() {
    saveClinicProfile(p);
    onClose();
    alert("Datos del centro guardados ✅");
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="card-title">Configuración del Centro</div>
            <div className="card-text">Nombre, logo, sello y firma para las facturas.</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div style={{ height: 14 }} />

        <div className="form-grid">
          <div className="field field-full">
            <label className="label">Nombre del centro</label>
            <input
              className="input"
              value={p.name}
              onChange={(e) => setP({ ...p, name: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="label">Teléfono</label>
            <input
              className="input"
              value={p.phone}
              onChange={(e) => setP({ ...p, phone: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              value={p.email}
              onChange={(e) => setP({ ...p, email: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label className="label">Dirección</label>
            <input
              className="input"
              value={p.address}
              onChange={(e) => setP({ ...p, address: e.target.value })}
            />
          </div>

          <div className="field">
            <label className="label">RNC / ID Fiscal</label>
            <input
              className="input"
              value={p.rnc}
              onChange={(e) => setP({ ...p, rnc: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label className="label">Nota al pie</label>
            <input
              className="input"
              value={p.footerNote}
              onChange={(e) => setP({ ...p, footerNote: e.target.value })}
            />
          </div>

          <div className="field field-full">
            <label className="label">Logo (imagen)</label>
            <input className="input" type="file" accept="image/*" onChange={(e) => onPick(e, "logoDataUrl")} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
              {p.logoDataUrl ? (
                <img src={p.logoDataUrl} alt="logo" style={{ maxHeight: 70, borderRadius: 12, border: "1px solid var(--border)" }} />
              ) : (
                <div className="muted">— Sin logo —</div>
              )}
              {p.logoDataUrl ? (
                <button className="btn btn-danger btn-sm" type="button" onClick={() => clearImage("logoDataUrl")}>
                  Quitar
                </button>
              ) : null}
            </div>
          </div>

          <div className="field field-full">
            <label className="label">Sello (imagen)</label>
            <input className="input" type="file" accept="image/*" onChange={(e) => onPick(e, "stampDataUrl")} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
              {p.stampDataUrl ? (
                <img src={p.stampDataUrl} alt="stamp" style={{ maxHeight: 90, borderRadius: 12, border: "1px solid var(--border)" }} />
              ) : (
                <div className="muted">— Sin sello —</div>
              )}
              {p.stampDataUrl ? (
                <button className="btn btn-danger btn-sm" type="button" onClick={() => clearImage("stampDataUrl")}>
                  Quitar
                </button>
              ) : null}
            </div>
          </div>

          <div className="field field-full">
            <label className="label">Firma digital (imagen)</label>
            <input className="input" type="file" accept="image/*" onChange={(e) => onPick(e, "signatureDataUrl")} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
              {p.signatureDataUrl ? (
                <img src={p.signatureDataUrl} alt="signature" style={{ maxHeight: 70, borderRadius: 12, border: "1px solid var(--border)" }} />
              ) : (
                <div className="muted">— Sin firma —</div>
              )}
              {p.signatureDataUrl ? (
                <button className="btn btn-danger btn-sm" type="button" onClick={() => clearImage("signatureDataUrl")}>
                  Quitar
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn btn-sm" onClick={save}>Guardar</button>
        </div>
      </div>
    </div>
  );
}
