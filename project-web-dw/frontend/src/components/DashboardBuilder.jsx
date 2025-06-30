import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import LineChartComponent from './LineChartComponent';
import BarChartComponent from './BarChartComponent';
import PieChartComponent from './PieChartComponent';
import TableComponent from './TableComponent';
import { fetchVentas, fetchMetrics } from '../services/api';
import StatsTableComponent from './StatsTableComponent';
import HistogramaComponent from './HistogramaComponent';
import ScatterPlotComponent from './ScatterPlotComponent';

const componentsList = [
  { type: 'line', label: 'Gráfico de Líneas' },
  { type: 'bar', label: 'Gráfico de Barras' },
  { type: 'pie', label: 'Gráfico de Pastel' },
  { type: 'table', label: 'Tabla' },
  { type: 'stats', label: 'Tabla Estadísticos' },
  { type: 'hist', label: 'Histograma Precio' },
  { type: 'scatter', label: 'Scatter Precio vs Cantidad' },
];


// — Drag source
function DraggableItem({ type, label }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        background: '#ede7f6',
        color: '#4B0082',
        margin: '6px 0',
        padding: '9px 15px',
        borderRadius: 7,
        border: '1.5px solid #bbb',
        cursor: 'grab',
        fontWeight: 500
      }}
    >
      {label}
    </div>
  );
}

// — Droppable Dashboard Area con grid responsivo
function Canvas({ items, moveItem, removeItem }) {
  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      moveItem(item.type);
    }
  }), [moveItem]);

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        minHeight: 480,
        background: '#f7f6fb',
        border: '2px dashed #bdb4da',
        borderRadius: 10,
        padding: 22,
        display: 'grid',
        gap: '18px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignContent: 'flex-start'
      }}
    >
      {items.length === 0 && (
        <div style={{ color: '#bbb', fontSize: 18, gridColumn: '1/-1' }}>
          Arrastra un componente aquí para comenzar a crear tu dashboard.
        </div>
      )}
      {items.map((item, idx) => (
        <DashboardChartCard
          key={item.id}
          type={item.type}
          id={item.id}
          onRemove={() => removeItem(item.id)}
        />
      ))}
    </div>
  );
}

// — Gráficos con botón de eliminar, para el dashboard dinámico
function DashboardChartCard({ type, id, onRemove }) {
  // Estados de ejemplo para que los gráficos tengan datos por defecto
  const [ventas, setVentas] = useState([]);
  const [metrics, setMetrics] = useState([]);
  React.useEffect(() => {
    fetchVentas({}).then(res => setVentas(res.data));
    fetchMetrics().then(res => setMetrics(res.data));
  }, []);

  let content = null;
  if (type === 'line')
    content = <LineChartComponent data={ventas.map(v => ({fecha: v.fecha, monto: v.precio_unitario * v.cantidad}))} dataKey="monto" nameKey="fecha" />;
  if (type === 'bar')
    content = <BarChartComponent data={metrics} dataKey="total" nameKey="categoria" />;
  if (type === 'pie')
    content = <PieChartComponent data={metrics} />;
  if (type === 'stats')
    content = <StatsTableComponent />;
  if (type === 'hist')
    content = <HistogramaComponent />;  
  if (type === 'scatter')
    content = <ScatterPlotComponent />; 
  if (type === 'table')
    content = (
      <TableComponent
        columns={[
          { Header: 'Cliente', accessor: 'cliente' },
          { Header: 'Producto', accessor: 'producto' },
          { Header: 'Fecha', accessor: 'fecha' },
          { Header: 'Cantidad', accessor: 'cantidad' },
          { Header: 'Precio', accessor: 'precio_unitario' }
        ]}
        data={ventas}
      />
    );

  return (
    <div
      style={{
        position: 'relative',
        background: '#fff',
        border: '1.5px solid #bdb4da',
        borderRadius: 12,
        minWidth: 0,
        maxWidth: '100%',
        padding: '20px 14px 14px 14px',
        boxShadow: '0 4px 16px #e3e0f5',
        marginBottom: 8,
        overflowX: 'auto'
      }}
    >
      <button
        onClick={onRemove}
        style={{
          position: 'absolute',
          top: 8, right: 10,
          border: 'none',
          background: '#e6e6fa',
          color: '#af1b50',
          fontWeight: 700,
          fontSize: 18,
          borderRadius: 6,
          cursor: 'pointer',
          width: 28, height: 28, lineHeight: '1'
        }}
        title="Eliminar"
      >&times;</button>
      {content}
    </div>
  );
}

// — Dashboard Builder principal
export default function DashboardBuilder() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Para crear ID únicos
  const nextId = React.useRef(0);
  const moveItem = type => setItems(prev => [...prev, { type, id: nextId.current++ }]);
  const removeItem = id => setItems(prev => prev.filter(it => it.id !== id));

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 24,
        minHeight: '100vh',
        background: 'var(--lavender)',
        padding: 30
      }}>
        {/* Panel izquierdo: Componentes */}
        <aside style={{
          width: 220,
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          boxShadow: '0 2px 8px #d6d0f1'
        }}>
          <h3 style={{ color: '#6A5ACD', marginBottom: 14, fontSize: 19 }}>Componentes</h3>
          {componentsList.map(c => (
            <DraggableItem key={c.type} type={c.type} label={c.label} />
          ))}
        </aside>

        {/* Panel derecho: Lienzo */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                marginRight: 16,
                padding: '7px 18px',
                borderRadius: 7,
                background: '#6A5ACD',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: '0 1px 8px #e3e0f5'
              }}
            >
              ← Volver al Dashboard
            </button>
            <h2 style={{ color: '#4B0082', margin: 0 }}>Crea tu Dashboard Personalizado</h2>
          </div>
          <Canvas items={items} moveItem={moveItem} removeItem={removeItem} />
        </main>
      </div>
    </DndProvider>
  );
}
