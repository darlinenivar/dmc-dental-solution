// src/components/DoctorSignatureBlock.jsx
import React, { useEffect, useState } from "react";
import { loadDoctorSignature } from "../lib/doctorSignature";
import "../styles/signatureBlock.css";

export default function DoctorSignatureBlock({ title = "Firma del Doctor/a" }) {
  const [sig, setSig] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await loadDoctorSignature();
      setSig(s);
    })();
  }, []);

  return (
    <div className="sigBlock">
      <div className="sigTitle">{title}</div>

      <div className="sigBox">
        {sig ? (
          <img className="sigImg" src={sig} alt="Firma doctor" />
        ) : (
          <div className="sigEmpty">
            No hay firma guardada. Ve a <b>Doctor/a</b> y guárdala.
          </div>
        )}
      </div>

      <div className="sigLine" />
      <div className="sigHint">Nombre y firma autorizada</div>
    </div>
  );
}
