// Admin password (in a real application, this should be handled securely on the server)
const ADMIN_PASSWORD = "admin123";
const sampleMenuItems = [
    {
        id: 1,
        name: "Classic Espresso",
        category: "Coffee",
        price: 3.50,
        description: "Rich and bold single shot espresso",
        path: "D:\\JAVSCRIPT\\img\\coffee.jpg"
    },
    {
        id: 2,
        name: "Cappuccino",
        category: "Coffee",
        price: 4.50,
        description: "Espresso topped with foamy milk and cocoa powder",
        path: "D:\\JAVSCRIPT\\img\\Cappuccino.jpg"
    },
    {
        id: 3,
        name: "Chocolate Cake",
        category: "Dessert",
        price: 5.99,
        description: "Rich chocolate cake with ganache frosting",
        path: "D:\\JAVSCRIPT\\img\\choc.jpg"
    },
    {
        id: 4,
        name: "Cheesecake",
        category: "Dessert",
        price: 6.99,
        description: "New York style cheesecake with berry compote",
        path: "D:\\JAVSCRIPT\\img\\cheesecake.jpg"
    },
    {
        id: 5,
        name: "Chicken Burger",
        category: "Fast Food",
        price: 8.99,
        description: "Grilled chicken patty with lettuce, tomato, and special sauce",
        path: "D:\\JAVSCRIPT\\img\\burger.jpg"
    },
    {
        id: 6,
        name: "French Fries",
        category: "Fast Food",
        price: 3.99,
        description: "Crispy golden fries with sea salt",
        path: "D:\\JAVSCRIPT\\img\\french.jpg"
    },
    {
        id: 7,
        name: "Green Tea",
        category: "Drinks",
        price: 2.99,
        description: "Premium Japanese green tea",
        path: "D:\\JAVSCRIPT\\img\\greentea.jpg"
    },
    {
        id: 8,
        name: "Smoothie",
        category: "Drinks",
        price: 5.99,
        description: "Mixed berry smoothie with yogurt",
        path: "D:\\JAVSCRIPT\\img\\smoothie.jpg"
    }
];


// Store menu items in localStorage
let menuItems = JSON.parse(localStorage.getItem('menuItems')) || sampleMenuItems;
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// Admin Panel Functions
if (document.getElementById('admin-login-form')) {
    document.getElementById('admin-login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('admin-password').value;
        if (password === ADMIN_PASSWORD) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            displayMenuItems();
        } else {
            alert('Invalid password!');
        }
    });
}
function showAddItemForm() {
    document.getElementById('add-item-form').style.display = 'block';
    document.getElementById('orders-section').style.display = 'none';
}

function showOrders() {
    document.getElementById('add-item-form').style.display = 'none';
    document.getElementById('orders-section').style.display = 'block';
    displayOrders();
}

if (document.getElementById('menu-item-form')) {
    document.getElementById('menu-item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            name: document.getElementById('item-name').value,
            category: document.getElementById('item-category').value,
            price: parseFloat(document.getElementById('item-price').value),
            description: document.getElementById('item-description').value,
            image: document.getElementById('item-image').value // Added image path
        };
        menuItems.push(newItem);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        displayMenuItems();
        this.reset();
        document.getElementById('add-item-form').style.display = 'none';
    });
}
function displayMenuItems() {
    const container = document.getElementById('menu-items-container');
    if (container) {
        container.innerHTML = '';
        menuItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <h4>${item.name}</h4>
                <p>Category: ${item.category}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>${item.description}</p>
                <button onclick="deleteMenuItem(${item.id})" class="btn">Delete</button>
            `;
            container.appendChild(itemElement);
        });
    }
}

function deleteMenuItem(id) {
    menuItems = menuItems.filter(item => item.id !== id);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    displayMenuItems();
}

function displayOrders(status = 'all') {
    const container = document.getElementById('orders-container');
    if (container) {
        container.innerHTML = '';
        const filteredOrders = status === 'all' ? orders : orders.filter(order => order.status === status);
        
        filteredOrders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = `order-history-item status-${order.status || 'pending'}`;
            orderElement.innerHTML = `
                <h4>Table ${order.tableNumber}</h4>
                <p>Items:</p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
                </ul>
                <p class="order-total">Total: $${order.total.toFixed(2)}</p>
                <p class="order-time">Ordered on: ${new Date(order.timestamp).toLocaleString()}</p>
                <div class="order-controls">
                    ${order.status !== 'ready' ? `<button onclick="updateOrderStatus(${order.id}, 'ready')" class="btn btn-ready">Mark as Ready</button>` : ''}
                    ${order.status !== 'completed' ? `<button onclick="updateOrderStatus(${order.id}, 'completed')" class="btn">Mark as Completed</button>` : ''}
                    <button onclick="deleteOrder(${order.id})" class="btn btn-delete">Delete</button>
                </div>
            `;
            container.appendChild(orderElement);
        });
    }
}

// Customer Menu Functions
let selectedTable = null;
let cart = [];

if (document.querySelector('.tables-grid')) {
    document.querySelectorAll('.table-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.table-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedTable = this.dataset.table;
        });
    });
}

if (document.querySelector('.category-filters')) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            displayMenuItems(category);
        });
    });
}
function displayMenuItems(category = 'all') {
    const container = document.getElementById('menu-container');
    if (container) {
        container.innerHTML = '';
        const filteredItems = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);
        
        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'menu-item';
            itemElement.innerHTML = `
                <img src="${item.path}" alt="${item.name}" class="menu-image" />
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <button onclick="addToCart(${item.id})" class="btn">Add to Cart</button>
            `;
            container.appendChild(itemElement);
        });
    }
}

function addToCart(itemId) {
    if (!selectedTable) {
        alert('Please select a table first!');
        return;
    }
    
    const item = menuItems.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

function updateCartDisplay() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total-amount');
    if (container && totalElement) {
        container.innerHTML = '';
        
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <p>${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}</p>
                <div class="cart-item-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="btn">-</button>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="btn">+</button>
                    <button onclick="removeFromCart(${item.id})" class="btn">Remove</button>
                </div>
            `;
            container.appendChild(itemElement);
        });
        
        totalElement.textContent = total.toFixed(2);
    }
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
    } else {
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

if (document.getElementById('place-order-btn')) {
    document.getElementById('place-order-btn').addEventListener('click', function() {
        if (!selectedTable) {
            alert('Please select a table first!');
            return;
        }
        
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const order = {
            id: Date.now(),
            tableNumber: selectedTable,
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: Date.now(),
            status: 'pending'
        };
        
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        alert('Order placed successfully!');
        cart = [];
        updateCartDisplay();
    });
}

// Initialize menu display on customer page
if (document.getElementById('menu-container')) {
    displayMenuItems();
}

// Order History Modal Functions
function showOrderHistory(status = 'all') {
    const modal = document.getElementById('order-history-modal');
    const container = document.getElementById('order-history-container');
    
    // Sort orders by timestamp (newest first)
    const sortedOrders = [...orders].sort((a, b) => b.timestamp - a.timestamp);
    const filteredOrders = status === 'all' ? sortedOrders : sortedOrders.filter(order => order.status === status);
    
    container.innerHTML = '';
    
    if (filteredOrders.length === 0) {
        container.innerHTML = '<p>No orders found.</p>';
    } else {
        filteredOrders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = `order-history-item status-${order.status || 'pending'}`;
            orderElement.innerHTML = `
                <h4>Table ${order.tableNumber}</h4>
                <ul>
                    ${order.items.map(item => `
                        <li>${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
                    `).join('')}
                </ul>
                <p class="order-total">Total: $${order.total.toFixed(2)}</p>
                <p class="order-time">Ordered on: ${new Date(order.timestamp).toLocaleString()}</p>
                <span class="order-status status-${order.status || 'pending'}">${order.status || 'Pending'}</span>
            `;
            container.appendChild(orderElement);
        });
    }
    
    modal.style.display = 'block';
}

// Close modal when clicking the X button
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('order-history-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add filter button listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const status = this.dataset.status;
            if (document.getElementById('orders-container')) {
                displayOrders(status);
            }
            if (document.getElementById('order-history-container')) {
                showOrderHistory(status);
            }
        });
    });
});

// Order Status Management
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        if (document.getElementById('order-history-container')) {
            showOrderHistory();
        }
    }
}

function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        if (document.getElementById('order-history-container')) {
            showOrderHistory();
        }
    }
} 