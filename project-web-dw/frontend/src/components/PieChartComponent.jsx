// frontend/src/components/PieChartComponent.jsx
import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const purplePalette = [
  "#E6E6FA", "#D8BFD8", "#9370DB", "#8A2BE2",
  "#6A5ACD", "#4B0082", "#483D8B"
];

export default function PieChartComponent() {
  const [data, setData] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000000);

  const loadData = () => {
    fetchMetrics()
      .then(res => {
        // filtro local por rango de total
        const filtered = res.data.filter(d => d.total >= min && d.total <= max);
        setData(filtered);
      })
      .catch(console.error);
  };

  useEffect(loadData, []);

  return (
    <div style={{ padding:20, background:'#fff', borderRadius:8 }}>
      <h3 style={{ color: purplePalette[6] }}>Ventas Totales por Categoría</h3>
      <div style={{ marginBottom: 16 }}>
        <label>
          Mínimo:{' '}
          <input type="number" value={min}
            onChange={e => setMin(Number(e.target.value))} />
        </label>{' '}
        <label>
          Máximo:{' '}
          <input type="number" value={max}
            onChange={e => setMax(Number(e.target.value))} />
        </label>{' '}
        <button
          onClick={loadData}
          style={{
            padding: '6px 12px',
            background: purplePalette[4],
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Aplicar
        </button>
      </div>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="total"
          nameKey="categoria"
          outerRadius={100}
          label
        >
          {data.map((_, idx) => (
            <Cell key={idx} fill={purplePalette[idx % purplePalette.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </div>
  );
}
