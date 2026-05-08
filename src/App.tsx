import React, { useState, useEffect, useMemo } from 'react';
import './style/style.css';
import type { Producto } from '../types'; // Agregamos 'type' aquí
import { PRODUCTOS_INICIALES } from './data/inventario';

export default function App() {
  const [inventario, setInventario] = useState<Producto[]>(() => {
    const saved = localStorage.getItem('ecoshop_v1');
    return saved ? JSON.parse(saved) : PRODUCTOS_INICIALES;
  });
  
  const [busqueda, setBusqueda] = useState('');
  const [catFiltro, setCatFiltro] = useState('todos');
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    localStorage.setItem('ecoshop_v1', JSON.stringify(inventario));
  }, [inventario]);

  const productosVisibles = useMemo(() => {
    return inventario.filter(p => {
      const matchTxt = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = catFiltro === 'todos' || p.categoria === catFiltro;
      return matchTxt && matchCat;
    });
  }, [busqueda, catFiltro, inventario]);

  const valorTotal = inventario.reduce<number>((acc, p) => acc + (p.precio * p.stock), 0);

  const handleCompra = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setInventario(prev => prev.map(p => 
      (p.id === id && p.stock > 0) ? { ...p, stock: p.stock - 1 } : p
    ));
  };

  return (
    <div className="ecoshop-container">
      <header>
        <h1>EcoShop 🌿</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <small>Productos</small>
            <p>{inventario.length}</p>
          </div>
          <div className="stat-card">
            <small>Valor Inventario</small>
            <p>${valorTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className="filter-group">
          {['todos', 'hogar', 'tecnología', 'deportes'].map(cat => (
            <button 
              key={cat}
              className={catFiltro === cat ? 'active' : ''}
              onClick={() => setCatFiltro(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="product-grid">
        {productosVisibles.map(p => (
          <div 
            key={p.id} 
            className={`product-card ${p.stock === 0 ? 'out-of-stock' : ''}`}
            onClick={() => setSeleccionado(p)}
          >
            <img src={p.imagen} alt={p.nombre} />
            <div className="card-info">
              <h3>{p.nombre}</h3>
              <p className="price">${p.precio.toFixed(2)}</p>
              <p className="stock">Stock: {p.stock}</p>
              <button disabled={p.stock === 0} onClick={(e) => handleCompra(p.id, e)}>
                {p.stock === 0 ? 'Agotado' : 'Comprar'}
              </button>
            </div>
          </div>
        ))}
      </main>

      {seleccionado && (
        <div className="modal-overlay" onClick={() => setSeleccionado(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSeleccionado(null)}>×</button>
            <div className="modal-body">
              <img src={seleccionado.imagen} alt={seleccionado.nombre} />
              <div>
                <h2>{seleccionado.nombre}</h2>
                <p className="desc">{seleccionado.descripcion}</p>
                <p><strong>Precio:</strong> ${seleccionado.precio}</p>
                <p><strong>Stock:</strong> {seleccionado.stock}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}