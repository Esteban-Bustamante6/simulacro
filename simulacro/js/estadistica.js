document.addEventListener('DOMContentLoaded', () => {
    const listaPedidos = document.getElementById('lista-pedidos');
    const historial = JSON.parse(localStorage.getItem("Historial_Pedidos")) || [];
    const session = JSON.parse(sessionStorage.getItem("userSession"));

    // Llenar datos del admin
    if (session) {
        document.getElementById('adminName').innerText = session.name;
        document.getElementById('adminEmail').innerText = session.email;
    }

    document.getElementById('totalCount').innerText = historial.length;

    // Renderizar pedidos
    if (historial.length === 0) {
        listaPedidos.innerHTML = `<div class="text-center p-5 text-muted">No hay pedidos registrados aún.</div>`;
    } else {
        listaPedidos.innerHTML = historial.map(pedido => `
            <div class="order-card d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <div class="bg-light p-3 rounded-circle me-3">🚚</div>
                    <div>
                        <h6 class="fw-bold mb-0">${pedido.idOrder} - ${pedido.cliente}</h6>
                        <small class="text-muted">${pedido.fecha} • ${pedido.items} Items</small>
                    </div>
                </div>
                <div class="text-end">
                    <h6 class="fw-bold mb-1">${pedido.total}</h6>
                    <span class="status-badge delivered">${pedido.estado}</span>
                </div>
            </div>
        `).join('');
    }
});


// Ejemplo de consulta para la página de estadísticas
function cargarPedidosRecientes() {
    // Opción A: Consultar JSON Server
    fetch('http://localhost:3000/Pedidos')
        .then(res => res.json())
        .then(pedidos => {
            renderizarListaPedidos(pedidos.reverse()); // Los más recientes primero
        })
        .catch(() => {
            // Opción B: Fallback a LocalStorage si el server está caído
            const localData = JSON.parse(localStorage.getItem("Historial_Pedidos")) || [];
            renderizarListaPedidos(localData);
        });
}

function renderizarListaPedidos(data) {
    const contenedor = document.getElementById('lista-pedidos');
    contenedor.innerHTML = data.map(p => `
        <div class="order-card d-flex align-items-center justify-content-between p-3 mb-2 bg-white rounded shadow-sm">
            <div class="d-flex align-items-center">
                <div class="p-2 bg-light rounded-circle me-3">📦</div>
                <div>
                    <h6 class="fw-bold mb-0">${p.idOrder} - ${p.nombreCliente}</h6>
                    <small class="text-muted">${p.fecha} • ${p.items.length} productos</small>
                </div>
            </div>
            <div class="text-end">
                <h6 class="fw-bold mb-0">${p.total}</h6>
                <span class="badge bg-success-subtle text-success">${p.estado}</span>
            </div>
        </div>
    `).join('');
}