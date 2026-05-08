
import { useState, useEffect } from 'react';

// 1. Inventario inicial de 12 productos obligatorio
const INVENTARIO_BASE = [
  { id: 1, nombre: "Lámpara Solar", precio: 25.99, categoria: "hogar", stock: 8, imagen: "https://via.placeholder.com/150" },
  { id: 2, nombre: "Mouse Inalámbrico", precio: 45.00, categoria: "tecnología", stock: 5, imagen: "https://via.placeholder.com/150" },
  { id: 3, nombre: "Mesa de Bambú", precio: 120.00, categoria: "hogar", stock: 3, imagen: "https://via.placeholder.com/150" },
  { id: 4, nombre: "Balón Pro", precio: 30.00, categoria: "deportes", stock: 12, imagen: "https://via.placeholder.com/150" },
  { id: 5, nombre: "Audífonos Eco", precio: 89.99, categoria: "tecnología", stock: 0, imagen: "https://via.placeholder.com/150" },
  { id: 6, nombre: "Set de Pesas", precio: 55.50, categoria: "deportes", stock: 7, imagen: "https://via.placeholder.com/150" },
  { id: 7, nombre: "Teclado Mecánico", precio: 75.00, categoria: "tecnología", stock: 4, imagen: "https://via.placeholder.com/150" },
  { id: 8, nombre: "Cojín Ergonómico", precio: 18.00, categoria: "hogar", stock: 15, imagen: "https://via.placeholder.com/150" },
  { id: 9, nombre: "Reloj Deportivo", precio: 110.00, categoria: "deportes", stock: 6, imagen: "https://via.placeholder.com/150" },
  { id: 10, nombre: "Cámara Web HD", precio: 65.00, categoria: "tecnología", stock: 2, imagen: "https://via.placeholder.com/150" },
  { id: 11, nombre: "Estantería Madera", precio: 85.00, categoria: "hogar", stock: 1, imagen: "https://via.placeholder.com/150" },
  { id: 12, nombre: "Botella Térmica", precio: 22.00, categoria: "deportes", stock: 10, imagen: "https://via.placeholder.com/150" }
];

export const useEcoShop = () => {
  // Cargar datos de localStorage o usar el inventario base
  const [productos, setProductos] = useState(() => {
    const datosGuardados = localStorage.getItem('inventario_ecoshop');
    return datosGuardados ? JSON.parse(datosGuardados) : INVENTARIO_BASE;
  });

  const [categoriaActual, setCategoriaActual] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Persistencia: Guardar cambios automáticamente
  useEffect(() => {
    localStorage.setItem('inventario_ecoshop', JSON.stringify(productos));
  }, [productos]);

  // Lógica de Compra (QA: Asegura que no baje de 0)
  const realizarCompra = (id) => {
    setProductos(prev => prev.map(prod => 
      prod.id === id && prod.stock > 0 
        ? { ...prod, stock: prod.stock - 1 } 
        : prod
    ));
  };

  // Filtrado Combinado (Categoría + Buscador)
  const productosVisibles = productos.filter(p => {
    const matchCategoria = categoriaActual === 'todos' || p.categoria === categoriaActual;
    const matchBusqueda = p.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  // Estadísticas para el Panel
  const estadisticas = {
    totalProductos: productos.length,
    valorTotal: productos.reduce((acc, p) => acc + (p.precio * p.stock), 0)
  };

  return {
    productosVisibles,
    realizarCompra,
    setCategoriaActual,
    setTerminoBusqueda,
    terminoBusqueda,
    estadisticas
  };
};