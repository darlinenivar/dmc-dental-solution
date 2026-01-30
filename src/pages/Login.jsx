<form onSubmit={handleLogin}>
  <div>
    <label>Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>

  <div>
    <label>Contraseña</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <button
    type="submit"
    disabled={loading}
  >
    {loading ? "Ingresando..." : "Iniciar sesión"}
  </button>
</form>
