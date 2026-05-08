import { useState, useEffect } from 'react';
import { Producto } from '../types'; 
import { PRODUCTOS_INICIALES } from '../data/inventario'; 

export const useInventario = () => {
  // Estado inicial con persistencia
  const [productos, setProductos] = useState<Producto[]>(() => {
    const salvo = localStorage.getItem('ecoShop_inventario');
    return salvo ? JSON.parse(salvo) : PRODUCTOS_INICIALES;
  });

  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Persistencia: Guardar en localStorage automáticamente
  useEffect(() => {
    localStorage.setItem('ecoShop_inventario', JSON.stringify(productos));
  }, [productos]);

  // Lógica de Compra
  const comprarProducto = (id: number) => {
    setProductos(prev => prev.map(p => 
      p.id === id && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p
    ));
  };

  // Filtrado Combinado (Categoría + Buscador)
  const productosFiltrados = productos.filter(p => {
    const coincideCat = filtroCategoria === 'todos' || p.categoria === filtroCategoria;
    const coincideBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideBusq;
  });

  // Estadísticas calculadas
  const stats = {
    total: productos.length,
    valorTotal: productos.reduce((acc, p) => acc + (p.precio * p.stock), 0)
  };

  return { 
    productosFiltrados, 
    comprarProducto, 
    setFiltroCategoria, 
    filtroCategoria,
    setBusqueda, 
    busqueda,
    stats 
  };
};