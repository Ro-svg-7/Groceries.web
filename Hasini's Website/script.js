const products = [
    {id: 1, name: 'Fresh Apples', category: 'Fruits', price: 120, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400'},
    {id: 2, name: 'Bananas', category: 'Fruits', price: 50, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'},
    {id: 3, name: 'Oranges', category: 'Fruits', price: 80, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400'},
    {id: 4, name: 'Carrots', category: 'Vegetables', price: 40, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'},
    {id: 5, name: 'Tomatoes', category: 'Vegetables', price: 35, image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'},
    {id: 6, name: 'Broccoli', category: 'Vegetables', price: 60, image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400'},
    {id: 7, name: 'Fresh Milk', category: 'Dairy', price: 55, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'},
    {id: 8, name: 'Cheese', category: 'Dairy', price: 200, image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400'},
    {id: 9, name: 'Yogurt', category: 'Dairy', price: 45, image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400'}
];

let cart = {};

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₹${product.price}</div>
                <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (cart[productId]) {
        cart[productId].quantity++;
    } else {
        cart[productId] = {...product, quantity: 1};
    }
    updateCartCount();
}

function updateCartCount() {
    const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function changeQuantity(productId, change) {
    if (cart[productId]) {
        cart[productId].quantity += change;
        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }
        updateCartCount();
        displayCart();
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const categorySummary = document.getElementById('categorySummary');
    
    if (Object.keys(cart).length === 0) {
        cartItems.innerHTML = '<div class="empty-message">Your cart is empty</div>';
        categorySummary.innerHTML = '';
        document.getElementById('totalAmount').textContent = '₹0';
        return;
    }

    cartItems.innerHTML = Object.values(cart).map(item => `
        <div class="cart-item">
            <div>
                <div class="item-name">${item.name}</div>
                <div class="item-category">${item.category}</div>
            </div>
            <div class="quantity-control">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
                <span style="font-weight: 600;">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <span style="font-weight: 700; color: #ff6b6b; margin-left: 10px;">₹${item.price * item.quantity}</span>
            </div>
        </div>
    `).join('');

    const categoryTotals = {};
    Object.values(cart).forEach(item => {
        if (!categoryTotals[item.category]) {
            categoryTotals[item.category] = 0;
        }
        categoryTotals[item.category] += item.price * item.quantity;
    });

    categorySummary.innerHTML = `
        <div class="category-summary">
            <div class="category-title">Category-wise Summary</div>
            ${Object.entries(categoryTotals).map(([category, total]) => `
                <div class="category-item">
                    <span>${category}</span>
                    <span>₹${total}</span>
                </div>
            `).join('')}
        </div>
    `;

    const total = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalAmount').textContent = `₹${total}`;
}

function openCart() {
    displayCart();
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function generateBill() {
    if (Object.keys(cart).length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const categoryGroups = {};
    Object.values(cart).forEach(item => {
        if (!categoryGroups[item.category]) {
            categoryGroups[item.category] = [];
        }
        categoryGroups[item.category].push(item);
    });

    const now = new Date();
    const billDate = now.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let billHTML = `
        <div class="bill-header">
            <h2>🛒 FreshCart</h2>
            <div class="bill-date">${billDate}</div>
            <div class="bill-date">Thank you for shopping with us!</div>
        </div>
    `;

    Object.entries(categoryGroups).forEach(([category, items]) => {
        const categoryTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        billHTML += `
            <div class="bill-section">
                <div class="bill-section-title">${category}</div>
                ${items.map(item => `
                    <div class="bill-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
                <div class="bill-item" style="font-weight: 700; border-top: 2px solid #cbd5e1; margin-top: 10px; padding-top: 10px;">
                    <span>${category} Total</span>
                    <span>₹${categoryTotal}</span>
                </div>
            </div>
        `;
    });

    const grandTotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    billHTML += `
        <div class="bill-total">
            <span>GRAND TOTAL</span>
            <span>₹${grandTotal}</span>
        </div>
    `;

    document.getElementById('billContent').innerHTML = billHTML;
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('billModal').style.display = 'block';
}

function closeBill() {
    document.getElementById('billModal').style.display = 'none';
}

displayProducts();