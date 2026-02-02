import React from "react";
import { Link } from "react-router-dom";

export default function PoliticasDePrivacidad() {
  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <h1 style={styles.h1}>Políticas de Privacidad</h1>
        <p style={styles.p}>
          Estas Políticas de Privacidad describen cómo <b>DMC Dental Solution</b>{" "}
          recopila, usa y protege la información dentro de la aplicación.
        </p>

        <Section title="1. Información que recopilamos">
          <ul style={styles.ul}>
            <li style={styles.li}>
              <b>Cuenta:</b> correo electrónico, identificador de usuario, y datos
              básicos necesarios para autenticación.
            </li>
            <li style={styles.li}>
              <b>Datos de clínica:</b> nombre, teléfono, dirección, ciudad, estado,
              zip y color de tema (si se configura).
            </li>
            <li style={styles.li}>
              <b>Datos clínicos:</b> información de pacientes, citas, notas y otros
              registros que el usuario autorizado registre dentro del sistema.
            </li>
          </ul>
        </Section>

        <Section title="2. Cómo usamos la información">
          <ul style={styles.ul}>
            <li style={styles.li}>Operar y mejorar la aplicación.</li>
            <li style={styles.li}>Permitir el acceso seguro según roles/permisos.</li>
            <li style={styles.li}>
              Guardar información en la base de datos para continuidad del servicio.
            </li>
          </ul>
        </Section>

        <Section title="3. Seguridad y acceso">
          <p style={styles.p}>
            Usamos controles de acceso y políticas de seguridad (por ejemplo, RLS en
            Supabase) para proteger la información. Solo usuarios autorizados deben
            acceder a datos de la clínica.
          </p>
        </Section>

        <Section title="4. Compartir información">
          <p style={styles.p}>
            No vendemos información. Solo se comparte cuando es necesario para operar
            el servicio (por ejemplo, infraestructura y base de datos) o por
            requerimientos legales.
          </p>
        </Section>

        <Section title="5. Retención de datos">
          <p style={styles.p}>
            Los datos permanecen almacenados mientras la cuenta y la clínica estén
            activas o según las obligaciones legales aplicables.
          </p>
        </Section>

        <Section title="6. Contacto">
          <p style={styles.p}>
            Si tienes preguntas sobre estas Políticas de Privacidad, contáctanos.
          </p>
        </Section>

        <div style={styles.footer}>
          <Link to="/dashboard" style={styles.link}>
            ← Volver al dashboard
          </Link>
          <span style={styles.sep}>•</span>
          <Link to="/login" style={styles.link}>
            Ir a login
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginTop: 16 }}>
      <h2 style={styles.h2}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    padding: 24,
    background: "#f5f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  card: {
    width: "100%",
    maxWidth: 920,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,.06)",
  },
  h1: { margin: 0, fontSize: 28 },
  h2: { margin: "0 0 8px", fontSize: 16 },
  p: { margin: "8px 0 0", color: "#374151", lineHeight: 1.6 },
  ul: { margin: "8px 0 0", paddingLeft: 18, color: "#374151", lineHeight: 1.6 },
  li: { margin: "6px 0" },
  footer: { marginTop: 18, display: "flex", gap: 10, alignItems: "center" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: 600 },
  sep: { color: "#9ca3af" },
};
