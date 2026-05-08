import { useState, useEffect, useMemo } from 'react';
import { Producto } from './types';
import { PRODUCTOS_INICIALES } from './data/inventario';

function App() {
  // 1. ESTADO: Inventario (Cargar de localStorage si existe)
  const [inventario, setInventario] = useState<Producto[]>(() => {
    const saved = localStorage.getItem('ecoshop_storage');
    return saved ? JSON.parse(saved) : PRODUCTOS_INICIALES;
  });

  // 2. ESTADO: Filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('todos');

  // 3. PERSISTENCIA: Guardar cada vez que el inventario cambie
  useEffect(() => {
    localStorage.setItem('ecoshop_storage', JSON.stringify(inventario));
  }, [inventario]);

  // 4. LÓGICA: Filtrado combinado (se recalcula eficientemente)
  const productosFiltrados = useMemo(() => {
    return inventario.filter(p => {
      const matchNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchCat = categoriaSel === 'todos' || p.categoria === categoriaSel;
      return matchNombre && matchCat;
    });
  }, [busqueda, categoriaSel, inventario]);

  // 5. LÓGICA: Compra
  const handleCompra = (id: number) => {
    setInventario(prev => prev.map(p => 
      (p.id === id && p.stock > 0) ? { ...p, stock: p.stock - 1 } : p
    ));
  };

  // 6. LÓGICA: Estadísticas
  const totalCat = productosFiltrados.length;
  const valorTotal = inventario.reduce((acc, p) => acc + (p.precio * p.stock), 0);

  return (
    <div className="app-container">
      <header>
        <h1>EcoShop React 🌿</h1>
        <div className="stats-panel">
          <p>Productos en catálogo: {totalCat}</p>
          <p>Valor Inventario Total: ${valorTotal.toLocaleString()}</p>
        </div>
      </header>

      <section className="controles">
        <input 
          type="text" 
          placeholder="Buscar..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select onChange={(e) => setCategoriaSel(e.target.value)}>
          <option value="todos">Todas las categorías</option>
          <option value="hogar">Hogar</option>
          <option value="tecnología">Tecnología</option>
          <option value="deportes">Deportes</option>
        </select>
      </section>

      <main className="grilla-productos">
        {productosFiltrados.map(prod => (
          <div key={prod.id} className={`card ${prod.stock === 0 ? 'agotado' : ''}`}>
            <img src={prod.imagen} alt={prod.nombre} />
            <h3>{prod.nombre}</h3>
            <p>Stock: {prod.stock}</p>
            <p>Precio: ${prod.precio}</p>
            <button 
              disabled={prod.stock === 0}
              onClick={() => handleCompra(prod.id)}
            >
              {prod.stock === 0 ? 'Agotado' : 'Comprar'}
            </button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;