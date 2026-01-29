import { useEffect, useRef, useState } from "react";

export default function DoctorSignature({ onSave }) {
  const sigRef = useRef(null);
  const [SignatureCanvas, setSignatureCanvas] = useState(null);

  useEffect(() => {
    // Carga dinámica SOLO en navegador
    import("react-signature-canvas").then((mod) => {
      setSignatureCanvas(() => mod.default);
    });
  }, []);

  if (!SignatureCanvas) {
    return <p>Cargando firma...</p>;
  }

  const clear = () => sigRef.current?.clear();

  const save = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    const dataUrl = sigRef.current.toDataURL();
    onSave?.(dataUrl);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{ width: 400, height: 200, className: "signature-canvas" }}
      />

      <div style={{ marginTop: 8 }}>
        <button onClick={clear}>Limpiar</button>
        <button onClick={save}>Guardar</button>
      </div>
    </div>
  );
}
