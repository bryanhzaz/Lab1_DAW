// frontend/src/components/StatsTableComponent.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function StatsTableComponent() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats/ventas')
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <div>Cargando estadísticas...</div>;

  return (
    <div style={{padding:16, background:'#fff', borderRadius:10}}>
      <h3>Estadísticos Descriptivos de Ventas</h3>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th></th>
            <th>Media</th>
            <th>Mediana</th>
            <th>Mínimo</th>
            <th>Máximo</th>
            <th>Std</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(stats).map(varname => (
            <tr key={varname}>
              <td><b>{varname}</b></td>
              <td>{stats[varname].mean.toFixed(2)}</td>
              <td>{stats[varname].median.toFixed(2)}</td>
              <td>{stats[varname].min.toFixed(2)}</td>
              <td>{stats[varname].max.toFixed(2)}</td>
              <td>{stats[varname].std.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
