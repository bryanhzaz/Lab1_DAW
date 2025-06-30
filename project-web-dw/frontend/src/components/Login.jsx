// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { setToken }     from '../services/api';

export default function Login({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL||'http://localhost:5000'}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
      });
      const { access_token } = await res.json();
      setToken(access_token);
      onLogin();
    } catch (err) {
      console.error(err);
      alert('Credenciales inválidas');
    }
  };

  return (
    <main className="login-wrapper">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1 className="app-title">NaoyBryBI</h1>

        <label>
          Usuario
          <input
            value={u}
            onChange={e => setU(e.target.value)}
            placeholder="Usuario"
            autoFocus
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={p}
            onChange={e => setP(e.target.value)}
            placeholder="Password"
          />
        </label>

        <button type="submit" className="btn full">Entrar</button>
      </form>
    </main>
  );
}
