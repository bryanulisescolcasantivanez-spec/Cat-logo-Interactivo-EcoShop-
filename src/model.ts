export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria: 'hogar' | 'tecnología' | 'deportes';
    stock: number;
    imagen: string;
}

export const inventario: Producto[] = [
    { id: 1, nombre: "Lámpara Solar", precio: 25.99, categoria: "hogar", stock: 10, imagen: "https://picsum.photos/200?random=1" },
    { id: 2, nombre: "Teclado de Bambú", precio: 45.00, categoria: "tecnología", stock: 5, imagen: "https://picsum.photos/200?random=2" },
    { id: 3, nombre: "Mesa de Yoga", precio: 30.50, categoria: "deportes", stock: 12, imagen: "https://picsum.photos/200?random=3" },
    { id: 4, nombre: "Cargador Solar", precio: 15.75, categoria: "tecnología", stock: 8, imagen: "https://picsum.photos/200?random=4" },
    { id: 5, nombre: "Set Macetas Eco", precio: 12.00, categoria: "hogar", stock: 15, imagen: "https://picsum.photos/200?random=5" },
    { id: 6, nombre: "Pesas Ecológicas", precio: 55.00, categoria: "deportes", stock: 4, imagen: "https://picsum.photos/200?random=6" },
    { id: 7, nombre: "Reloj Inteligente Eco", precio: 89.99, categoria: "tecnología", stock: 3, imagen: "https://picsum.photos/200?random=7" },
    { id: 8, nombre: "Purificador Aire", precio: 120.00, categoria: "hogar", stock: 6, imagen: "https://picsum.photos/200?random=8" },
    { id: 9, nombre: "Botella Térmica", precio: 18.50, categoria: "deportes", stock: 20, imagen: "https://picsum.photos/200?random=9" },
    { id: 10, nombre: "Audífonos Reciclados", precio: 35.00, categoria: "tecnología", stock: 0, imagen: "https://picsum.photos/200?random=10" },
    { id: 11, nombre: "Huerto Vertical", precio: 40.00, categoria: "hogar", stock: 7, imagen: "https://picsum.photos/200?random=11" },
    { id: 12, nombre: "Cuerda de Salto", precio: 10.00, categoria: "deportes", stock: 15, imagen: "https://picsum.photos/200?random=12" }
];