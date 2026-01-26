import React, { useMemo, useState } from "react";
import "../styles/settings.css";

export default function Compartir() {
  const [copied, setCopied] = useState(false);

  const referralLink = useMemo(() => {
    const base = window.location.origin;
    return `${base}/share?ref=DMC`;
  }, []);

  const message = useMemo(() => {
    return `Te comparto DMC Dental Solution 🦷✨
Sistema para clínica dental: pacientes, citas, facturas, finanzas y backup.
Entra aquí: ${referralLink}`;
  }, [referralLink]);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      alert("No se pudo copiar. Copia manualmente el texto.");
    }
  };

  const openWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  const openEmail = () => {
    const subject = "DMC Dental Solution";
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <div>
          <h1 className="settings-title">Compartir con amigos</h1>
          <p className="settings-subtitle">Copia el enlace o comparte directo por WhatsApp / Email.</p>
        </div>
        <div className="badge">🤝 Share</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Tu enlace</h3>
          <div className="notice" style={{ wordBreak: "break-all" }}>{referralLink}</div>

          <div className="flex" style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => copy(referralLink)} type="button">
              {copied ? "✅ Copiado" : "Copiar enlace"}
            </button>
            <button className="btn btn-ghost" onClick={openWhatsApp} type="button">WhatsApp</button>
            <button className="btn btn-ghost" onClick={openEmail} type="button">Email</button>
          </div>

          <div className="notice" style={{ marginTop: 12 }}>
            Próximo upgrade: QR + tracking real de referidos.
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Mensaje listo</h3>
          <textarea className="textarea" value={message} readOnly />
          <div className="flex" style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => copy(message)} type="button">
              {copied ? "✅ Copiado" : "Copiar mensaje"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
