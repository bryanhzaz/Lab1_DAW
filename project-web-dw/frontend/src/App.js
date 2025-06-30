// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import DashboardBuilder from './components/DashboardBuilder';
import { setToken } from './services/api';

function App() {
  const [logged, setLogged] = useState(false);

  // Handler para cerrar sesión (lo puedes usar en cualquier componente)
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token'); // Borra el token persistente, si lo usas así
    setLogged(false);
  };

  if (!logged) return <LoginForm onLogin={() => setLogged(true)} />;

  return (
    <BrowserRouter>
      <nav style={{
        display: 'flex', gap: '1em', alignItems: 'center',
        background: '#ede7f6', padding: '10px 18px', borderRadius: 8, marginBottom: 20
      }}>
        <Link to="/" style={{ fontWeight: 700, color: '#4B0082', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/builder" style={{
          fontWeight: 700, color: '#6A5ACD', textDecoration: 'none',
          border: '1px solid #6A5ACD', borderRadius: 6, padding: '4px 10px'
        }}>
          Crear Dashboard
        </Link>
        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto',
            padding: '6px 18px',
            background: '#e8eaf6',
            color: '#6A5ACD',
            border: '1px solid #bdb4da',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="/builder" element={<DashboardBuilder onLogout={handleLogout} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
