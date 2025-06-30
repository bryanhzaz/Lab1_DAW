import React, { useState } from 'react';
import api, { setToken } from '../services/api';

export default function LoginForm({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', { username: user, password: pass });
      setToken(res.data.access_token);
      onLogin();
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <main className="login-bg">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-title">NaoyBryBI</h1>
        <div className="login-subtitle">Data Warehouse Dashboard</div>
        <label>
          <span>Usuario</span>
          <input
            value={user}
            onChange={e => setUser(e.target.value)}
            placeholder="Usuario"
            autoFocus
            required
          />
        </label>
        <label>
          <span>Contraseña</span>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </label>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="btn-login">Ingresar</button>
      </form>
    </main>
  );
}
