import React, { useState, useEffect, useMemo } from 'react';
import './style/style.css';

// 1. Definición del Contrato de Datos
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: 'hogar' | 'tecnología' | 'deportes';
  stock: number;
  imagen: string;
  descripcion: string;
}

// 2. Datos Maestros (Cumpliendo el requerimiento de 12 productos)
const DATA_INICIAL: Producto[] = [
  { id: 1, nombre: "Panel Solar Pro", precio: 120.50, categoria: "tecnología", stock: 10, imagen: "https://picsum.photos/200?random=1", descripcion: "Eficiencia energética para tu hogar." },
  { id: 2, nombre: "Maceta Bio", precio: 15.00, categoria: "hogar", stock: 15, imagen: "https://picsum.photos/200?random=2", descripcion: "Materiales 100% biodegradables." },
  { id: 3, nombre: "Pesas Eco-Friendly", precio: 45.99, categoria: "deportes", stock: 8, imagen: "https://picsum.photos/200?random=3", descripcion: "Caucho reciclado de alta durabilidad." },
  { id: 4, nombre: "Lámpara LED Bambú", precio: 25.00, categoria: "hogar", stock: 5, imagen: "https://picsum.photos/200?random=4", descripcion: "Iluminación cálida y sostenible." },
  { id: 5, nombre: "Teclado Madera", precio: 65.00, categoria: "tecnología", stock: 12, imagen: "https://picsum.photos/200?random=5", descripcion: "Diseño ergonómico en madera de nogal." },
  { id: 6, nombre: "Botella Acero", precio: 18.50, categoria: "deportes", stock: 3, imagen: "https://picsum.photos/200?random=6", descripcion: "Mantiene la temperatura por 24 horas." },
  { id: 7, nombre: "Cargador Solar", precio: 35.00, categoria: "tecnología", stock: 7, imagen: "https://picsum.photos/200?random=7", descripcion: "Carga tus dispositivos con energía limpia." },
  { id: 8, nombre: "Compostera Dom.", precio: 85.00, categoria: "hogar", stock: 4, imagen: "https://picsum.photos/200?random=8", descripcion: "Transforma tus residuos en abono." },
  { id: 9, nombre: "Yogamat Natural", precio: 30.00, categoria: "deportes", stock: 10, imagen: "https://picsum.photos/200?random=9", descripcion: "Caucho natural antideslizante." },
  { id: 10, nombre: "Mouse Reciclado", precio: 22.00, categoria: "tecnología", stock: 0, imagen: "https://picsum.photos/200?random=10", descripcion: "Plásticos rescatados del océano." },
  { id: 11, nombre: "Filtro de Agua", precio: 55.00, categoria: "hogar", stock: 6, imagen: "https://picsum.photos/200?random=11", descripcion: "Agua pura sin desperdicio." },
  { id: 12, nombre: "Cuerda de Salto", precio: 12.00, categoria: "deportes", stock: 20, imagen: "https://picsum.photos/200?random=12", descripcion: "Fibras de cáñamo natural." }
];

export default function App() {
  // --- ESTADOS ---
  const [inventario, setInventario] = useState<Producto[]>(() => {
    const persistencia = localStorage.getItem('ecoshop_v1');
    return persistencia ? JSON.parse(persistencia) : DATA_INICIAL;
  });
  
  const [busqueda, setBusqueda] = useState('');
  const [catFiltro, setCatFiltro] = useState('todos');
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);

  // --- PERSISTENCIA ---
  useEffect(() => {
    localStorage.setItem('ecoshop_v1', JSON.stringify(inventario));
  }, [inventario]);

  // --- LÓGICA DE FILTRADO ---
  const productosVisibles = useMemo(() => {
    return inventario.filter(p => {
      const matchTxt = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = catFiltro === 'todos' || p.categoria === catFiltro;
      return matchTxt && matchCat;
    });
  }, [busqueda, catFiltro, inventario]);

  // --- CÁLCULOS ---
  const valorTotal = inventario.reduce((acc, p) => acc + (p.precio * p.stock), 0);

  // --- ACCIONES ---
  const handleCompra = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que se abra el zoom al comprar
    setInventario(prev => prev.map(p => 
      (p.id === id && p.stock > 0) ? { ...p, stock: p.stock - 1 } : p
    ));
  };

  return (
    <div className="ecoshop-container">
      <header>
        <h1>EcoShop Dashboard 🌿</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <small>Productos</small>
            <p>{productosVisibles.length}</p>
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
          placeholder="Buscar producto..." 
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
              <button 
                disabled={p.stock === 0}
                onClick={(e) => handleCompra(p.id, e)}
              >
                {p.stock === 0 ? 'Agotado' : 'Comprar'}
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* EFECTO SELECCIÓN (MODAL/ZOOM) */}
      {seleccionado && (
        <div className="modal-overlay" onClick={() => setSeleccionado(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSeleccionado(null)}>×</button>
            <div className="modal-body">
              <img src={seleccionado.imagen} alt={seleccionado.nombre} />
              <div>
                <h2>{seleccionado.nombre}</h2>
                <p className="badge">{seleccionado.categoria}</p>
                <p className="desc">{seleccionado.descripcion}</p>
                <p className="modal-price">Precio: ${seleccionado.precio}</p>
                <p>Stock actual: {seleccionado.stock} unidades</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}