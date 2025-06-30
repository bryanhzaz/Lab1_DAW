// frontend/src/components/ChartComponent.jsx
import React, { useEffect, useState } from 'react';
import { fetchVentas } from '../services/api';
import {
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function ChartComponent() {
  const [data, setData] = useState([]);
  const [categoria, setCategoria] = useState('');        // filtro categoría
  const [from, setFrom]         = useState('2025-01-01'); // filtro fecha desde
  const [to, setTo]             = useState('2025-12-31'); // filtro fecha hasta

  const loadData = () => {
    fetchVentas({ categoria, from, to })
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(loadData, []); // carga inicial sin filtros

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label>
          Categoría:{' '}
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Muebles">Muebles</option>
          </select>
        </label>{' '}
        <label>
          Desde:{' '}
          <input
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
        </label>{' '}
        <label>
          Hasta:{' '}
          <input
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
        </label>{' '}
        <button onClick={loadData}>Aplicar filtros</button>
      </div>

      <LineChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis dataKey="monto" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="monto" />
      </LineChart>
    </div>
  );
}
