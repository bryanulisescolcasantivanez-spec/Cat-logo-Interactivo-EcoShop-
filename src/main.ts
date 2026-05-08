import { inventario, Producto } from './model';

// Elementos del DOM
const grilla = document.querySelector<HTMLDivElement>('#grilla-productos')!;
const buscador = document.querySelector<HTMLInputElement>('#buscador')!;
const botonesFiltro = document.querySelectorAll<HTMLButtonElement>('.btn-filtro');
const panelStats = document.querySelector<HTMLDivElement>('#panel-stats')!;

/**
 * Renderiza las tarjetas de productos en la grilla
 */
const renderizarProductos = (productos: Producto[]) => {
    grilla.innerHTML = ''; // Limpiar grilla

    productos.forEach(p => {
        const tarjeta = document.createElement('div');
        const estaAgotado = p.stock === 0;

        tarjeta.className = `card ${estaAgotado ? 'agotado' : ''}`;
        tarjeta.innerHTML = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
            <p>Categoría: ${p.categoria}</p>
            <p>Precio: $${p.precio}</p>
            <p>Stock: <strong>${p.stock}</strong></p>
            <button ${estaAgotado ? 'disabled' : ''} class="btn-comprar">
                ${estaAgotado ? 'Agotado' : 'Comprar'}
            </button>
        `;
        grilla.appendChild(tarjeta);
    });
};

/**
 * Calcula y muestra las estadísticas del catálogo
 */
const actualizarEstadisticas = (productos: Producto[]) => {
    const total = productos.length;
    const valorTotal = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);

    panelStats.innerHTML = `
        <p>Total Productos: <strong>${total}</strong></p>
        <p>Valor Inventario: <strong>$${valorTotal.toFixed(2)}</strong></p>
    `;
};

/**
 * Lógica de Filtrado Combinado
 */
const filtrar = () => {
    const texto = buscador.value.toLowerCase();
    const categoriaActiva = document.querySelector('.btn-filtro.active')?.getAttribute('data-cat') || 'todos';

    const filtrados = inventario.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(texto);
        const coincideCat = categoriaActiva === 'todos' || p.categoria === categoriaActiva;
        return coincideNombre && coincideCat;
    });

    renderizarProductos(filtrados);
    actualizarEstadisticas(filtrados);
};

// Eventos
buscador.addEventListener('input', filtrar);

botonesFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.btn-filtro.active')?.classList.remove('active');
        btn.classList.add('active');
        filtrar();
    });
});

// Inicialización
renderizarProductos(inventario);
actualizarEstadisticas(inventario);