// src/hooks/useInventario.ts
import { useState, useEffect } from 'react';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string;
}

const INVENTARIO_INICIAL: Producto[] = [
  { id: 1, nombre: "Cactus Orgánico", precio: 15.50, categoria: "hogar", stock: 10, imagen: "url_o_ruta" },
  // ... agrega 11 productos más aquí hasta completar 12
];

export const useInventario = () => {
  // Intentar cargar desde localStorage o usar el inicial
  const [productos, setProductos] = useState<Producto[]>(() => {
    const salvo = localStorage.getItem('ecoShop_inventario');
    return salvo ? JSON.parse(salvo) : INVENTARIO_INICIAL;
  });

  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // Persistencia: Guardar cada vez que el stock cambie
  useEffect(() => {
    localStorage.setItem('ecoShop_inventario', JSON.stringify(productos));
  }, [productos]);

  // Lógica de Compra (QA: Evitar stock negativo)
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

  // Estadísticas para el Panel
  const stats = {
    total: productos.length,
    valorTotal: productos.reduce((acc, p) => acc + (p.precio * p.stock), 0)
  };

  return { productosFiltrados, comprarProducto, setFiltroCategoria, setBusqueda, stats, busqueda };
};