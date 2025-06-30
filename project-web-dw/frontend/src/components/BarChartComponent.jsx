// frontend/src/components/BarChartComponent.jsx
import React from 'react';
import {
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip, Legend
} from 'recharts';

/**
 * Props:
 *  - data:     array de objetos { categoria, total }
 *  - dataKey:  nombre de la propiedad numérica ('total')
 *  - nameKey:  nombre de la propiedad de etiqueta ('categoria')
 */
export default function BarChartComponent({ data, dataKey, nameKey }) {
  return (
    <BarChart width={700} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={nameKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={dataKey} />
    </BarChart>
  );
}
