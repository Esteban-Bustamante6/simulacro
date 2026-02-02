
// categoria.js
import { 
    burguer1, burguer2, papas1, 
    burguerprice1, burguerprice2, papasprice1, 
    añadirburguer1, añadirburguer2, añadirpapas1 
} from './link.js';

let carrito = [];

function agregarAlCarrito(nombre, precio, imagen) {
    // PROTECCIÓN: Si precio es null o undefined, le asignamos "$0"
    const precioSeguro = precio ? precio.toString() : "$0";
    const precioNumerico = parseFloat(precioSeguro.replace('$', ''));

    const existe = carrito.find(item => item.nombre === nombre);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ nombre, precio: precioNumerico, imagen, cantidad: 1 });
    }
    actualizarInterfaz();
}

function actualizarInterfaz() {
    const contenedor = document.querySelector('.insertcarrito');
    const subtotalEl = document.querySelector('.subtotalElement');
    const ivaEl = document.querySelector('.ivaElement');
    const totalEl = document.querySelector('.totalElement');
    const badgeCant = document.querySelector('.cantOrder');

    if (!contenedor) return; 

    contenedor.innerHTML = ''; 
    let subtotal = 0;

    carrito.forEach((item, index) => {
        subtotal += item.precio * item.cantidad;
        
        // Carta predeterminada con tu diseño
        contenedor.innerHTML += `
            <div class="d-flex gap-3 mb-3">
                <img src="${item.imagen}" class="rounded" alt="item" style="width:50px; height:50px; object-fit:cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold">${item.nombre}</h6>
                    <small class="text-muted">No onions</small>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${index}, -1)">-</button>
                            <button class="btn btn-light disabled">${item.cantidad}</button>
                            <button class="btn btn-outline-secondary" onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                        <span class="fw-bold">$${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                </div>
            </div>`;
    });

    const iva = subtotal * 0.08;
    const total = subtotal + iva;

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (ivaEl) ivaEl.innerText = `$${iva.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
    if (badgeCant) badgeCant.innerText = carrito.reduce((sum, item) => sum + item.cantidad, 0);
}

// Eventos de botones
if (añadirburguer1 && añadirburguer1[0]) {
    añadirburguer1[0].addEventListener('click', () => agregarAlCarrito("Classic Beef", burguerprice1, burguer1));
}
if (añadirburguer2 && añadirburguer2[0]) {
    añadirburguer2[0].addEventListener('click', () => agregarAlCarrito("Double Bacon", burguerprice2, burguer2));
}
if (añadirpapas1 && añadirpapas1[0]) {
    añadirpapas1[0].addEventListener('click', () => agregarAlCarrito("Golden Fries", papasprice1, papas1));
}

// Funciones globales
window.toggleCarrito = () => {
    document.getElementById('carrito-container').classList.toggle('active');
};

window.cambiarCantidad = (index, valor) => {
    carrito[index].cantidad += valor;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    actualizarInterfaz();
};

// Al final de tu categoria.js o dentro de tu lógica de carrito
const btnConfirmar = document.querySelector('.confirOrder');

btnConfirmar.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // Obtener el usuario actual de la sesión
    const session = JSON.parse(sessionStorage.getItem("userSession"));
    
    // Crear el objeto del pedido
    const nuevoPedido = {
        idOrder: `#ORD-${Math.floor(Math.random() * 9000) + 1000}`,
        cliente: session ? session.name : "Invitado",
        fecha: new Date().toLocaleDateString(),
        items: carrito.length,
        total: document.querySelector('.totalElement').innerText,
        estado: "Delivered" // Por defecto para la simulación
    };

    // Guardar en el historial global de pedidos
    const historial = JSON.parse(localStorage.getItem("Historial_Pedidos")) || [];
    historial.unshift(nuevoPedido); // Añadir al inicio
    localStorage.setItem("Historial_Pedidos", JSON.stringify(historial));

    alert("Pedido confirmado con éxito");
    carrito = []; // Limpiar carrito
    actualizarInterfaz();
});


// Cargar historial previo de LocalStorage o iniciar vacío
const historialPedidos = JSON.parse(localStorage.getItem("Historial_Pedidos")) || [];

// 1. Declarar funciones de persistencia primero
function saveOrderLocal(pedido) {
    const historial = JSON.parse(localStorage.getItem("Historial_Pedidos")) || [];
    historial.unshift(pedido); // Añadir al inicio
    localStorage.setItem("Historial_Pedidos", JSON.stringify(historial));
}

function saveOrderAPI(pedido) {
    fetch('http://localhost:3000/Pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    })
    .then(res => {
        if (!res.ok) throw new Error('Error en el servidor');
        return res.json();
    })
    .then(data => console.log('Pedido guardado en JSON Server:', data))
    .catch(err => console.error('Error al guardar pedido:', err));
}



if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
        // Obtener la sesión activa
        const sesionActiva = JSON.parse(sessionStorage.getItem("userSession"));

        // Validaciones
        if (!sesionActiva) {
            alert("Debes iniciar sesión para realizar un pedido");
            return;
        }

        if (carrito.length === 0) {
            alert("El carrito está vacío");
            return;
        }

        // 3. Crear el objeto del pedido una sola vez
        const nuevoPedido = {
            idOrder: `#ORD-${Math.floor(Math.random() * 9000) + 1000}`,
            clienteId: sesionActiva.id,
            nombreCliente: sesionActiva.name,
            emailCliente: sesionActiva.email,
            fecha: new Date().toLocaleDateString(),
            items: carrito.map(item => ({
                nombre: item.nombre,
                cantidad: item.cantidad,
                precioUnitario: item.precio
            })),
            total: document.querySelector('.totalElement').innerText,
            estado: "Delivered"
        };

        // 4. Ejecutar guardados
        saveOrderLocal(nuevoPedido);
        saveOrderAPI(nuevoPedido);

        // 5. Feedback y limpieza de interfaz
        alert(`¡Gracias ${sesionActiva.name}! Tu pedido ha sido procesado.`);
        
        // Limpiar el arreglo y refrescar la vista
        carrito.splice(0, carrito.length); 
        actualizarInterfaz();
    });
}