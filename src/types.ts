
export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria: 'hogar' | 'tecnología' | 'deportes';
    stock: number;
    imagen: string;
    descripcion: string;
}