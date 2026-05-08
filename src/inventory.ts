// 1. Definición del modelo de datos
export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
    stock: number;
    imagen: string;
}

// 2. Datos iniciales (mínimo 12 productos)
const PRODUCTOS_INICIALES: Producto[] = [
    { id: 1, nombre: "Panel Solar Portátil", precio: 45.50, categoria: "tecnología", stock: 8, imagen: "/img/solar.jpg" },
    { id: 2, nombre: "Maceta Autorregable", precio: 12.99, categoria: "hogar", stock: 15, imagen: "/img/maceta.jpg" },
    { id: 3, nombre: "Balón de Yoga Eco", precio: 25.00, categoria: "deportes", stock: 5, imagen: "/img/yoga.jpg" },
    { id: 4, nombre: "Cargador Cinético", precio: 30.00, categoria: "tecnología", stock: 0, imagen: "/img/cargador.jpg" },
    // Agrega aquí los 8 productos restantes...
];

// 3. Cargar inventario desde LocalStorage o usar el inicial
export const obtenerInventario = (): Producto[] => {
    const data = localStorage.getItem('ecoshop_data');
    return data ? JSON.parse(data) : PRODUCTOS_INICIALES;
};

// 4. Guardar cambios
const guardarInventario = (inventario: Producto[]): void => {
    localStorage.setItem('ecoshop_data', JSON.stringify(inventario));
};

/**
 * Lógica de Compra
 * Disminuye el stock de un producto por su ID.
 */
export const comprarProducto = (id: number, inventario: Producto[]): Producto[] => {
    const nuevoInventario = inventario.map(p => {
        if (p.id === id && p.stock > 0) {
            return { ...p, stock: p.stock - 1 };
        }
        return p;
    });
    
    guardarInventario(nuevoInventario);
    return nuevoInventario;
};

/**
 * Lógica de Filtrado Combinado
 * Filtra por nombre y categoría simultáneamente.
 */
export const filtrarInventario = (
    inventario: Producto[], 
    busqueda: string, 
    categoria: string
): Producto[] => {
    return inventario.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoria === "todas" || p.categoria === categoria;
        return coincideNombre && coincideCategoria;
    });
};

/**
 * Lógica de Estadísticas
 */
export const obtenerMetricas = (inventario: Producto[]) => {
    const totalProductos = inventario.length;
    const valorTotal = inventario.reduce((acc, p) => acc + (p.precio * p.stock), 0);
    
    return {
        totalProductos,
        valorTotal: valorTotal.toFixed(2)
    };
};