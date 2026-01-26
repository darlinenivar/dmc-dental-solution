import React from "react";
import "../styles/privacy.css";

export default function PoliticasDePrivacidad() {
  const lastUpdated = "15/01/2026"; // ✅ cámbialo cuando quieras

  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <div>
          <h1 className="privacy-title">Políticas de privacidad</h1>
          <p className="privacy-subtitle">
            DMC Dental Solution • Última actualización: <b>{lastUpdated}</b>
          </p>
        </div>

        <div className="privacy-badges">
          <span className="privacy-badge">SaaS</span>
          <span className="privacy-badge">Web + App</span>
          <span className="privacy-badge">Seguridad</span>
        </div>
      </div>

      <div className="privacy-card">
        <p className="privacy-lead">
          En <b>DMC Dental Solution</b> En DMC, respetamos
          y protegemos la privacidad de nuestros usuarios. Esta Política de
          Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos
          la información cuando utilizas nuestra plataforma para la gestión de
          clínicas dentales.
        </p>

        <div className="privacy-toc">
          <div className="privacy-toc-title">Contenido</div>
          <div className="privacy-toc-grid">
            <a href="#info">1. Información que recopilamos</a>
            <a href="#use">2. Cómo usamos la información</a>
            <a href="#security">3. Almacenamiento y seguridad</a>
            <a href="#share">4. Compartición de información</a>
            <a href="#patients">5. Datos de pacientes</a>
            <a href="#cookies">6. Cookies</a>
            <a href="#rights">7. Derechos del usuario</a>
            <a href="#closing">8. Cierre de cuenta</a>
            <a href="#minors">9. Privacidad de menores</a>
            <a href="#changes">10. Cambios a esta política</a>
            <a href="#contact">11. Contacto</a>
          </div>
        </div>

        <section className="privacy-section" id="info">
          <h2>1. Información que recopilamos</h2>

          <h3>a) Información de la cuenta</h3>
          <ul>
            <li>Nombre</li>
            <li>Correo electrónico</li>
            <li>Credenciales de autenticación (gestionadas de forma segura)</li>
            <li>Rol del usuario (doctor/a, administrador/a, asistente, etc.)</li>
          </ul>

          <h3>b) Información clínica (ingresada por el usuario)</h3>
          <ul>
            <li>Datos de pacientes (contacto, historial clínico, odontograma)</li>
            <li>Citas y procedimientos</li>
            <li>Facturación y métodos de pago (sin almacenar datos sensibles de tarjetas)</li>
          </ul>

          <div className="privacy-note">
            <b>Importante:</b> DMC Dental Solution <b>NO</b> vende ni comparte datos
            clínicos.
          </div>

          <h3>c) Información técnica</h3>
          <ul>
            <li>Dirección IP</li>
            <li>Tipo de dispositivo y navegador</li>
            <li>Fecha y hora de acceso</li>
            <li>Registros de actividad (seguridad y soporte)</li>
          </ul>
        </section>

        <section className="privacy-section" id="use">
          <h2>2. Cómo usamos la información</h2>
          <ul>
            <li>Proveer y mantener el servicio</li>
            <li>Gestionar cuentas de usuario</li>
            <li>Almacenar información clínica ingresada por el usuario</li>
            <li>Mejorar la experiencia y funcionalidad del sistema</li>
            <li>Cumplir con obligaciones legales</li>
            <li>Seguridad, auditoría y prevención de fraudes</li>
          </ul>
        </section>

        <section className="privacy-section" id="security">
          <h2>3. Almacenamiento y seguridad de los datos</h2>
          <ul>
            <li>Los datos se almacenan utilizando infraestructura segura (ej. Supabase)</li>
            <li>Aplicamos control de acceso, autenticación y buenas prácticas de seguridad</li>
            <li>Solo usuarios autorizados pueden acceder a la información</li>
          </ul>

          <div className="privacy-note">
            Aunque aplicamos altos estándares de seguridad, ningún sistema es 100% infalible.
          </div>
        </section>

        <section className="privacy-section" id="share">
          <h2>4. Compartición de información</h2>
          <p>
            <b>No vendemos ni alquilamos</b> información personal. Solo compartimos
            información cuando:
          </p>
          <ul>
            <li>Es requerido por ley</li>
            <li>El usuario lo autoriza explícitamente</li>
            <li>Es necesario para proveer el servicio (infraestructura técnica)</li>
          </ul>
        </section>

        <section className="privacy-section" id="patients">
          <h2>5. Datos de pacientes</h2>
          <ul>
            <li>Los datos de pacientes son propiedad de la clínica</li>
            <li>La clínica decide qué se guarda y quién tiene acceso</li>
            <li>DMC actúa como proveedor tecnológico para almacenar/gestionar la información</li>
          </ul>
        </section>

        <section className="privacy-section" id="cookies">
          <h2>6. Cookies y tecnologías similares</h2>
          <p>
            Podemos usar cookies o almacenamiento local para mantener la sesión activa,
            recordar preferencias y mejorar el rendimiento.
          </p>
          <p className="privacy-muted">
            Puedes desactivar cookies desde tu navegador.
          </p>
        </section>

        <section className="privacy-section" id="rights">
          <h2>7. Derechos del usuario</h2>
          <ul>
            <li>Acceder a tu información</li>
            <li>Solicitar corrección o eliminación</li>
            <li>Cerrar tu cuenta</li>
            <li>Solicitar exportación de datos (según configuración y permisos)</li>
          </ul>
        </section>

        <section className="privacy-section" id="closing">
          <h2>8. Cierre de cuenta</h2>
          <p>
            Al cerrar sesión o eliminar una cuenta, se revoca el acceso. Algunos datos
            podrían mantenerse por requisitos legales o configuración interna de la clínica.
          </p>
        </section>

        <section className="privacy-section" id="minors">
          <h2>9. Privacidad de menores</h2>
          <p>
            DMC Dental Solution no está dirigida a menores de 18 años. Los datos de pacientes
            menores que se gestionen dentro de una clínica son responsabilidad de la clínica
            y sus representantes legales.
          </p>
        </section>

        <section className="privacy-section" id="changes">
          <h2>10. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad ocasionalmente. Los cambios serán
            publicados dentro de la plataforma.
          </p>
        </section>

        <section className="privacy-section" id="contact">
          <h2>11. Contacto</h2>
          <p>Si tienes preguntas sobre esta Política de Privacidad, contáctanos:</p>

          <div className="privacy-contact">
            <div>
              <div className="privacy-contact-label">Email</div>
              <div className="privacy-contact-value">soporte@dmcdentalsolution.com</div>
            </div>
            <div>
              <div className="privacy-contact-label">Ubicación</div>
              <div className="privacy-contact-value">Estados Unidos</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
