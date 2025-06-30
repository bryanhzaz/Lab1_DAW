// frontend/src/components/LineChartComponent.jsx
import React from 'react';
import {
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';

/**
 * Props:
 *  - data:     array de objetos con fecha y valor ({ fecha, monto })
 *  - dataKey:  nombre de la propiedad numérica ('monto')
 *  - nameKey:  nombre de la propiedad de eje X ('fecha')
 */
export default function LineChartComponent({ data, dataKey, nameKey }) {
  return (
    <LineChart width={700} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={nameKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={dataKey} />
    </LineChart>
  );
}
