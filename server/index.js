import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5174;
const JWT_SECRET = process.env.JWT_SECRET || "change-me";
const OWNER_EMAIL = process.env.OWNER_EMAIL || "";
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "";

function safeAuthConfigured() {
  return OWNER_EMAIL.length > 3 && OWNER_PASSWORD.length > 3;
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!safeAuthConfigured()) {
    return res.status(500).json({
      message: "Server no configurado. Falta OWNER_EMAIL / OWNER_PASSWORD en server/.env"
    });
  }

  const ok = String(email || "").trim().toLowerCase() === OWNER_EMAIL.trim().toLowerCase()
    && String(password || "") === OWNER_PASSWORD;

  if (!ok) return res.status(401).json({ message: "Credenciales incorrectas." });

  const token = jwt.sign({ email: OWNER_EMAIL }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token });
});

app.get("/api/auth/me", (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!token) return res.status(401).json({ message: "No token" });

    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ email: payload.email });
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
