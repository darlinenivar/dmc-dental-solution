// src/lib/pushClient.js

// ✅ Config por ENV (Vite). Si no existe, usa localhost.
export const PUSH_API_BASE = import.meta.env.VITE_PUSH_API_BASE || "http://localhost:5050";
export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Este navegador no soporta Service Worker.");
  }
  // Vite sirve /public como raíz, así que /sw.js existe
  const reg = await navigator.serviceWorker.register("/sw.js");
  return reg;
}

export async function subscribeToPush() {
  if (!("PushManager" in window)) {
    throw new Error("Este navegador no soporta Push (PushManager).");
  }
  if (!("Notification" in window)) {
    throw new Error("Este navegador no soporta Notificaciones.");
  }
  if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.includes("REEMPLAZA")) {
    throw new Error(
      "Falta VAPID_PUBLIC_KEY. Pon VITE_VAPID_PUBLIC_KEY en tu .env (frontend)."
    );
  }

  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Permiso de notificaciones denegado.");

  const reg = await navigator.serviceWorker.ready;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  return sub;
}

export async function activatePush() {
  await registerServiceWorker();
  const sub = await subscribeToPush();

  const res = await fetch(`${PUSH_API_BASE}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`No se pudo registrar en el servidor. ${txt}`);
  }
  return true;
}
