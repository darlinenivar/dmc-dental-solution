return (
  <div className="auth-container">
    <div className="auth-card">
      <h1>Crear cuenta</h1>
      <p>Completa tus datos y la información de tu clínica.</p>

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Repetir contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Nombre de la clínica"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">¿Ya tienes cuenta? Login ahora</Link>
      </div>
    </div>
  </div>
);
