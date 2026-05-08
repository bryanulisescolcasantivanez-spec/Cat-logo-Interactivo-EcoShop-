import { useState, useEffect, useMemo } from 'react';
import { Producto } from './types';
import { PRODUCTOS_INICIALES } from './data/inventario';

function App() {
  // 1. ESTADO e INVENTARIO (Tu lógica de persistencia es perfecta)
  const [inventario, setInventario] = useState<Producto[]>(() => {
    const saved = localStorage.getItem('ecoshop_storage');
    return saved ? JSON.parse(saved) : PRODUCTOS_INICIALES;
  });

  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('todos');

  useEffect(() => {
    localStorage.setItem('ecoshop_storage', JSON.stringify(inventario));
  }, [inventario]);

  // 2. FILTRADO (Se mantiene igual, es muy eficiente)
  const productosFiltrados = useMemo(() => {
    return inventario.filter(p => {
      const matchNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = categoriaSel === 'todos' || p.categoria === categoriaSel;
      return matchNombre && matchCat;
    });
  }, [busqueda, categoriaSel, inventario]);

  // 3. COMPRA
  const handleCompra = (id: number) => {
    setInventario(prev => prev.map(p => 
      (p.id === id && p.stock > 0) ? { ...p, stock: p.stock - 1 } : p
    ));
  };

  // 4. ESTADÍSTICAS
  const totalCat = productosFiltrados.length;
  const valorTotal = inventario.reduce((acc, p) => acc + (p.precio * p.stock), 0);

  return (
    <main className="container">
      <header>
        <h1>EcoShop 🌿</h1>
        <p>Dashboard de Gestión de Productos</p>
      </header>

      <section className="controles">
        <div className="buscador-container">
          <label htmlFor="buscador">Buscar artículo:</label>
          <input 
            type="text" 
            id="buscador" 
            placeholder="Ej: Lámpara solar..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtros-container">
          <p>Filtrar por categoría:</p>
          <div id="filtros-botones">
            {['todos', 'hogar', 'tecnología', 'deportes'].map(cat => (
              <button 
                key={cat}
                className={`btn-filtro ${categoriaSel === cat ? 'active' : ''}`}
                onClick={() => setCategoriaSel(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PANEL DE ESTADÍSTICAS (Con los IDs del equipo) */}
      <section id="panel-stats" className="stats-grid">
        <div className="stat-card">
          <h3>Total Productos</h3>
          <p id="total-productos">{totalCat}</p>
        </div>
        <div className="stat-card">
          <h3>Valor del Inventario</h3>
          <p id="valor-inventario">${valorTotal.toLocaleString()}</p>
        </div>
      </section>

      <hr />

      {/* GRILLA DE PRODUCTOS */}
      <section id="grilla-productos" className="productos-grid">
        {productosFiltrados.map(prod => (
          <div key={prod.id} className={`producto-card ${prod.stock === 0 ? 'agotado' : ''}`}>
            <img src={prod.imagen} alt={prod.nombre} />
            <h3>{prod.nombre}</h3>
            <p className="categoria-tag">{prod.categoria}</p>
            <p>Precio: ${prod.precio}</p>
            <p>Stock: <strong className={prod.stock < 3 ? 'low-stock' : ''}>{prod.stock}</strong></p>
            <button 
              className="btn-comprar"
              disabled={prod.stock === 0}
              onClick={() => handleCompra(prod.id)}
            >
              {prod.stock === 0 ? 'Agotado' : 'Comprar'}
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;