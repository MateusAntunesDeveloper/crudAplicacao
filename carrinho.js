document.addEventListener("DOMContentLoaded", () => {
    let cart = [];

    const cartCount = document.querySelector(".cart-count");
    const cartIcon = document.querySelector(".btn-icon[title='Carrinho']");

    // Criar container do carrinho com estilo melhorado
    let cartContainer = document.createElement("div");
    cartContainer.classList.add("cart-container");
    cartContainer.innerHTML = `
        <div class="cart-header">
            <h3><i class="fas fa-shopping-cart"></i> Meu Carrinho</h3>
            <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items-container"></div>
        <div class="cart-summary">
            <div class="cart-total">
                <span>Total:</span>
                <span class="total-price">R$ 0,00</span>
            </div>
            <div class="cart-actions">
                <button class="btn-clear">Limpar</button>
                <button class="btn-pay">Finalizar Compra</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(cartContainer);

    // Adicionar estilos CSS inline melhorados
    const style = document.createElement('style');
    style.textContent = `
        .cart-container {
            position: fixed;
            top: 70px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            width: 380px;
            max-height: 500px;
            display: flex;
            flex-direction: column;
            z-index: 1000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid #eaeaea;
            overflow: hidden;
            display: none;
        }
        
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .cart-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .close-cart {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s;
        }
        
        .close-cart:hover {
            background: rgba(255,255,255,0.2);
        }
        
        .cart-items-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            max-height: 300px;
        }
        
        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #f0f0f0;
            animation: slideIn 0.3s ease;
        }
        
        .cart-item:last-child {
            border-bottom: none;
        }
        
        .item-info {
            flex: 1;
        }
        
        .item-name {
            font-weight: 500;
            color: #333;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .item-price {
            color: #667eea;
            font-weight: 600;
            font-size: 14px;
        }
        
        .item-controls {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .quantity-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            transition: all 0.3s;
        }
        
        .quantity-btn:hover {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
        
        .item-quantity {
            font-weight: 500;
            min-width: 20px;
            text-align: center;
        }
        
        .item-total {
            font-weight: 600;
            color: #333;
            font-size: 15px;
            margin: 0 15px;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: #ff4757;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            transition: background 0.3s;
            font-size: 16px;
        }
        
        .remove-item:hover {
            background: #ff475722;
        }
        
        .cart-summary {
            padding: 20px;
            border-top: 1px solid #f0f0f0;
            background: #f9f9f9;
        }
        
        .cart-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .cart-total span:first-child {
            color: #666;
        }
        
        .total-price {
            color: #667eea;
            font-weight: 700;
            font-size: 22px;
        }
        
        .cart-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn-clear, .btn-pay {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
        }
        
        .btn-clear {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #ddd;
        }
        
        .btn-clear:hover {
            background: #e9ecef;
        }
        
        .btn-pay {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-pay:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .cart-empty {
            text-align: center;
            padding: 40px 20px;
            color: #888;
        }
        
        .cart-empty i {
            font-size: 48px;
            margin-bottom: 15px;
            color: #ddd;
        }
        
        .cart-empty p {
            margin: 0;
            font-size: 16px;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(10px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .cart-count {
            transition: all 0.3s;
        }
        
        .cart-count.pulse {
            animation: pulse 0.3s ease;
        }
    `;
    
    document.head.appendChild(style);

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.classList.add('pulse');
        setTimeout(() => cartCount.classList.remove('pulse'), 300);
    }

    function calculateTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function formatPrice(price) {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function renderCart() {
        const itemsContainer = cartContainer.querySelector('.cart-items-container');
        const totalPriceElement = cartContainer.querySelector('.total-price');
        
        itemsContainer.innerHTML = '';

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Seu carrinho está vazio</p>
                    <p style="font-size: 14px; margin-top: 10px;">Adicione produtos para continuar</p>
                </div>
            `;
            totalPriceElement.textContent = formatPrice(0);
            return;
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="item-controls">
                    <button class="quantity-btn decrease" data-index="${index}">−</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                    <span class="item-total">${formatPrice(item.price * item.quantity)}</span>
                    <button class="remove-item" data-index="${index}" title="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            itemsContainer.appendChild(itemElement);
        });

        // Atualizar total
        totalPriceElement.textContent = formatPrice(calculateTotal());

        // Adicionar event listeners aos botões
        itemsContainer.querySelectorAll(".increase").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart[idx].quantity++;
                updateCartCount();
                renderCart();
            });
        });

        itemsContainer.querySelectorAll(".decrease").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity--;
                } else {
                    cart.splice(idx, 1);
                }
                updateCartCount();
                renderCart();
            });
        });

        itemsContainer.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-index"));
                cart.splice(idx, 1);
                updateCartCount();
                renderCart();
            });
        });
    }

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        renderCart();
        
        // Mostrar o carrinho automaticamente ao adicionar item
        if (cartContainer.style.display === 'none') {
            cartContainer.style.display = 'flex';
        }
    }

    // Adicionar evento aos botões "Adicionar ao carrinho"
    const addButtons = document.querySelectorAll(".add-to-cart");
    addButtons.forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const productCard = btn.closest(".product-card");
            const name = productCard.querySelector(".product-title").textContent;
            const priceText = productCard.querySelector(".current-price").textContent;
            const price = parseFloat(priceText.replace(/[^\d,]/g, "").replace(",", "."));
            
            // Adicionar animação de feedback
            btn.innerHTML = '<i class="fas fa-check"></i> Adicionado';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.innerHTML = 'Adicionar ao Carrinho';
                btn.style.background = '';
            }, 1000);
            
            addToCart({ id: index, name, price });
        });
    });

    // Event listeners para o carrinho
    cartIcon.addEventListener("click", () => {
        cartContainer.style.display = cartContainer.style.display === 'none' ? 'flex' : 'none';
    });

    cartContainer.querySelector('.close-cart').addEventListener('click', () => {
        cartContainer.style.display = 'none';
    });

    cartContainer.querySelector('.btn-clear').addEventListener('click', () => {
        if (cart.length === 0) return;
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            cart = [];
            updateCartCount();
            renderCart();
        }
    });

    cartContainer.querySelector('.btn-pay').addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }
        
        const total = calculateTotal();
        if (confirm(`Finalizar compra no valor de ${formatPrice(total)}?`)) {
            alert(`✅ Pagamento realizado com sucesso!\nTotal: ${formatPrice(total)}\nObrigado pela compra!`);
            cart = [];
            updateCartCount();
            renderCart();
            cartContainer.style.display = 'none';
        }
    });

    // Fechar carrinho ao clicar fora
    document.addEventListener('click', (e) => {
        if (!cartContainer.contains(e.target) && 
            e.target !== cartIcon && 
            !cartIcon.contains(e.target) &&
            cartContainer.style.display === 'flex') {
            cartContainer.style.display = 'none';
        }
    });

    // Inicializar
    updateCartCount();
    renderCart();
});
function enviarNewsletter() {
    const form = document.querySelector('.newsletter-form');
    const input = form.querySelector('input');
    const button = form.querySelector('button');
    
    button.addEventListener('click', function() {
        const email = input.value;
        
        if (email.includes('@') && email.includes('.')) {
            alert(`Inscrito com sucesso!\nE-mail: ${email}`);
            input.value = '';
        } else {
            alert('Digite um e-mail válido!');
        }
    });
    
    // Para funcionar com Enter também
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') button.click();
    });
}

// Para usar, basta chamar:
document.addEventListener('DOMContentLoaded', enviarNewsletter);