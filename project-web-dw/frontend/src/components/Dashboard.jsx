// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { fetchVentas, fetchMetrics, setToken } from '../services/api';
import LineChartComponent from './LineChartComponent';
import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import TableComponent from './TableComponent';
import './Dashboard.css';

export default function Dashboard({ onLogout }) {
  const [ventas, setVentas] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [tab, setTab] = useState('line');

  // Estados para el filtro de fechas
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Fetch ventas cada vez que el filtro de fechas cambie
  useEffect(() => {
    fetchVentas({ from, to }).then(res => setVentas(res.data));
  }, [from, to]);

  // Fetch metrics solo 1 vez (al cargar)
  useEffect(() => {
    fetchMetrics().then(res => setMetrics(res.data));
  }, []);

  // Data para gráficas a partir de ventas
  const lineData = ventas.map(v => ({
    fecha: v.fecha,
    monto: v.precio_unitario * v.cantidad
  }));
  const barPieData = metrics;

  const columns = useMemo(() => [
    { Header: 'Cliente', accessor: 'cliente' },
    { Header: 'Producto', accessor: 'producto' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Cantidad', accessor: 'cantidad' },
    { Header: 'Precio', accessor: 'precio_unitario' }
  ], []);

  // Botón de cerrar sesión
  const handleLogout = () => {
    setToken(''); // Limpia el token de Axios y localStorage
    if (onLogout) onLogout();
  };

  return (
    <section className="dashboard">
      <header className="dash-header">
        <h2>
          NaoyBryBI&nbsp;
          <span className="subtitle">Dashboard de Data Warehouse</span>
        </h2>
        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto',
            padding: '7px 20px',
            background: '#e8eaf6',
            color: '#6A5ACD',
            border: '1.5px solid #bdb4da',
            borderRadius: 7,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <nav className="tabs card">
        {['line', 'bar', 'pie', 'table'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
          >
            {t === 'line'
              ? 'Líneas'
              : t === 'bar'
              ? 'Barras'
              : t === 'pie'
              ? 'Pastel'
              : 'Tabla'}
          </button>
        ))}
      </nav>

      {tab === 'line' && (
        <div
          className="filtros card"
          style={{
            display: 'flex',
            gap: '1em',
            marginBottom: '1em',
            alignItems: 'center'
          }}
        >
          <label>
            Desde: <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </label>
          <label>
            Hasta: <input type="date" value={to} onChange={e => setTo(e.target.value)} />
          </label>
          <button onClick={() => { setFrom(''); setTo(''); }}>Limpiar</button>
        </div>
      )}

      <div className="content card">
        {tab === 'line' && (
          <LineChartComponent data={lineData} dataKey="monto" nameKey="fecha" />
        )}
        {tab === 'bar' && (
          <BarChartComponent data={barPieData} dataKey="total" nameKey="categoria" />
        )}
        {tab === 'pie' && (
          <PieChartComponent data={barPieData} dataKey="total" nameKey="categoria" />
        )}
        {tab === 'table' && <TableComponent columns={columns} data={ventas} />}
      </div>
    </section>
  );
}
