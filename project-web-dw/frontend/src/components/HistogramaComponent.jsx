// frontend/src/components/HistogramaComponent.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function HistogramaComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/histogram/precio_unitario')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data.length) return <div>Cargando histograma...</div>;

  return (
    <div style={{padding:16, background:'#fff', borderRadius:10}}>
      <h3>Histograma de Precios Unitarios</h3>
      <BarChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" />
      </BarChart>
    </div>
  );
}
