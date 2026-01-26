import React, { useEffect, useMemo, useRef, useState } from "react";

export default function SignaturePad({
  value,                 // dataURL (png) o null
  onChange,              // (dataURL|null) => void
  height = 260,
  lineWidth = 2.6,
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDown, setIsDown] = useState(false);
  const pointsRef = useRef([]);      // puntos actuales
  const strokesRef = useRef([]);     // historial de strokes para undo

  const dpr = useMemo(() => window.devicePixelRatio || 1, []);

  const setup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111827"; // gris oscuro pro

    ctxRef.current = ctx;

    // pinta value si existe
    redrawAll();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  };

  const redrawAll = () => {
    clearCanvas();
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Si hay imagen value, dibujarla
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, (canvasRef.current.width / dpr), height);
        // encima redibujar strokes (si había)
        drawStrokes();
      };
      img.src = value;
    } else {
      drawStrokes();
    }
  };

  const drawStrokes = () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // redibujar strokes
    const strokes = strokesRef.current;
    for (const stroke of strokes) {
      drawSmoothLine(ctx, stroke);
    }
  };

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // suavizado: quadratic
  const drawSmoothLine = (ctx, pts) => {
    if (!pts || pts.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);

    for (let i = 1; i < pts.length - 1; i++) {
      const midX = (pts[i].x + pts[i + 1].x) / 2;
      const midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }

    // último segmento
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  };

  const exportPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Exporta sin el escalado (igual sirve)
    return canvas.toDataURL("image/png");
  };

  const onPointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.setPointerCapture(e.pointerId); // ✅ clave: no se “va” el lápiz
    setIsDown(true);

    pointsRef.current = [];
    const p = getPos(e);
    pointsRef.current.push(p);

    // comenzar stroke
    strokesRef.current.push([p]);

    // dibuja un puntito inicial
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#111827";
      ctx.fill();
    }
  };

  const onPointerMove = (e) => {
    if (!isDown) return;

    const ctx = ctxRef.current;
    if (!ctx) return;

    const p = getPos(e);

    // agrega punto al stroke actual
    const strokes = strokesRef.current;
    const current = strokes[strokes.length - 1];
    current.push(p);

    // redibuja SOLO el stroke actual suavizado encima
    // (para no re-renderizar todo)
    clearCanvas();
    // si hay imagen previa, la repintamos
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, (canvasRef.current.width / dpr), height);
        drawStrokes();
      };
      img.src = value;
    } else {
      drawStrokes();
    }
  };

  const endStroke = () => {
    if (!isDown) return;
    setIsDown(false);

    // guardar firma al finalizar
    const png = exportPng();
    onChange?.(png);
  };

  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    // al hacer undo, el value anterior puede estar “mezclado”
    // así que reseteamos value visualmente redibujando strokes desde 0
    clearCanvas();
    drawStrokes();
    onChange?.(exportPng());
  };

  const handleClear = () => {
    strokesRef.current = [];
    clearCanvas();
    onChange?.(null);
  };

  useEffect(() => {
    // cuando cambia value desde afuera, repintar
    const t = setTimeout(() => {
      setup();
    }, 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  useEffect(() => {
    // repinta si value cambia
    redrawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sig-wrap">
      <div className="sig-toolbar">
        <button className="btn-ghost" type="button" onClick={handleUndo}>
          Deshacer
        </button>
        <button className="btn-danger" type="button" onClick={handleClear}>
          Limpiar
        </button>
      </div>

      <div className="sig-canvas-box">
        <canvas
          ref={canvasRef}
          className="sig-canvas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          onPointerLeave={() => {
            // no corta el stroke (pointer capture lo mantiene)
          }}
        />
        <div className="sig-hint">
          Dibuja con mouse o dedo (si te sales un poco, la firma sigue).
        </div>
      </div>
    </div>
  );
}
