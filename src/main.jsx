import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./auth/AuthProvider.jsx";

window.addEventListener("unhandledrejection", (event) => {
  const err = event?.reason;
  if (err?.name === "AbortError") {
    event.preventDefault();
  }
});
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
