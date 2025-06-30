// frontend/src/components/ScatterPlotComponent.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ScatterPlotComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/scatter/precio_vs_cantidad')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data.length) return <div>Cargando gráfico...</div>;

  return (
    <div style={{padding:16, background:'#fff', borderRadius:10}}>
      <h3>Precio Unitario vs Cantidad (Scatter)</h3>
      <ScatterChart width={400} height={250}>
        <CartesianGrid />
        <XAxis dataKey="precio" name="Precio Unitario" />
        <YAxis dataKey="cantidad" name="Cantidad" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={data} fill="#6A5ACD" />
      </ScatterChart>
    </div>
  );
}
