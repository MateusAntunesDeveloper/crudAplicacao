const orderHistoryContainer = document.querySelector('.order-history');

orderHistoryContainer.innerHTML = '';

pedidos.forEach(pedido => {
    const card = document.createElement('div');
    card.classList.add('order-card');

    card.innerHTML = `
        <h3>Pedido: #${pedido.id}</h3>
        <p>Data: ${pedido.data}</p>
        <p>Status: ${pedido.status}</p>
        <p>Total: R$ ${pedido.total.toFixed(2)}</p>
    `;

    orderHistoryContainer.appendChild(card);
});
