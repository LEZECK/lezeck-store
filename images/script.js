// ============================================
// LEZECK STORE - COMPLETE SCRIPT (Days 1-20)
// PRODUCTION READY
// ============================================

const DEFAULT_IMAGE = "https://placehold.co/400x500/f0ebe3/d4a373?text=Product+Image";
const CART_VERSION = "1.0";
const CART_EXPIRY_DAYS = 7;
const STORAGE_KEY = 'trendyWearCart';
const BACKUP_KEY = 'trendyWearCartBackup';
const ORDERS_KEY = 'lezeckOrders';
const USERS_KEY = 'lezeckUsers';

// Debug mode - DISABLED for production
const DEBUG = false; // localStorage.getItem('debug') === 'true';

// Production: No console logs
function log(...args) { if (DEBUG) console.log('[DEBUG]', ...args); }
function logInfo(message, data) { if (DEBUG) console.log(`%c[INFO] ${message}`, 'color: #4CAF50', data || ''); }
function logWarn(message, data) { if (DEBUG) console.log(`%c[WARN] ${message}`, 'color: #FF9800', data || ''); }
function logError(message, data) { if (DEBUG) console.error(`[ERROR] ${message}`, data || ''); }

// ============================================
// FLY-TO-CART ANIMATION (Day 10)
// ============================================

function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

let isAnimating = false;

function flyToCart(productImageSrc, productId, buttonElement) {
    if (isAnimating) return;
    isAnimating = true;
    
    const cartIcon = document.getElementById('cartIcon');
    if (!cartIcon) { addToCart(productId); isAnimating = false; return; }
    
    const productCard = buttonElement.closest('.product-card');
    const productImg = productCard.querySelector('.product-img');
    const startPos = getElementPosition(productImg);
    const endPos = getElementPosition(cartIcon);
    
    const clone = document.createElement('div');
    clone.className = 'flying-item';
    clone.style.cssText = `position:fixed; left:${startPos.x}px; top:${startPos.y}px; width:60px; height:60px; background-image:url(${productImageSrc}); background-size:cover; background-position:center; border-radius:50%; z-index:9999; transition:all 0.6s cubic-bezier(0.2,0.9,0.4,1.1); box-shadow:0 4px 15px rgba(0,0,0,0.2);`;
    document.body.appendChild(clone);
    clone.offsetHeight;
    clone.style.left = endPos.x + 'px';
    clone.style.top = endPos.y + 'px';
    clone.style.width = '30px';
    clone.style.height = '30px';
    clone.style.opacity = '0.5';
    clone.style.transform = 'rotate(360deg)';
    
    clone.addEventListener('transitionend', () => { clone.remove(); addToCart(productId); isAnimating = false; });
    setTimeout(() => { if (clone.parentNode) { clone.remove(); addToCart(productId); isAnimating = false; } }, 700);
}

// ============================================
// PRODUCT CATALOG
// ============================================

const products = [
    { id: 1, name: "Red Glove Long Dress", price: 550, category: "Dresses", image: 'dress7.jpg' },
    { id: 2, name: 'Kit Apple', price: 3850, category: "Computers", image: 'Apple-Black.jpg' },
    { id: 3, name: 'adidas-red', price: 1050, category: "Shoes", image: 'adidas-red.jpg' },
    { id: 4, name: 'adidas AS-230', price: 850, category: "Shoes", image: 'product1.jpg' },
    { id: 5, name: 'adidas GAZELLE', price: 650, category: "Shoes", image: 'product2.jpg' },
    { id: 6, name: 'Babys Dress', price: 720, category: "Dresses", image: 'product6.jpg' },
    { id: 7, name: 'ASICS Gel-Lyte V', price: 510, category: "Shoes", image: 'Product10.jpg' },
    { id: 8, name: 'Brown Loafers', price: 730, category: "Shoes", image: 'product17.jpg' },
    { id: 9, name: 'Apple Air 13 + kit', price: 2390, category: "Computers", image: 'product3.jpg' },
    { id: 11, name: 'MacBook Design', price: 2500, category: "Computers", image: 'Apple-Black.jpg' },
    { id: 12, name: 'Nike design Shoes', price: 1150, category: "Shoes", image: 'product39.jpg' },
    { id: 13, name: 'Nike Speckled Roshes', price: 1200, category: "Shoes", image: 'product33.jpg' },
    { id: 14, name: 'Raymond Cotton Mens', price: 900, category: "shirt", image: 'product23.jpg' },
    { id: 15, name: 'XANDRA-GOTS Dress', price: 450, category: "Dresses", image: 'product8.jpg' },
    { id: 16, name: 'Red Scarlet 4300', price: 300, category: "Shoes", image: 'product9.jpg' },
    { id: 17, name: 'Kit Gaming', price: 800, category: "Computers", image: 'product11.jpg' },
    { id: 18, name: 'ASTR floral Dress', price: 1100, category: "Dresses", image: 'product12.jpg' },
    { id: 19, name: 'Western Dress', price: 1300, category: "Dresses", image: 'product13.jpg' },
    { id: 20, name: 'Baby clothes', price: 700, category: "Dresses", image: 'product14.jpg' },
    { id: 21, name: 'adidas F50 Messi', price: 400, category: "Shoes", image: 'product19.jpg' },
    { id: 22, name: 'Loafer Casual Shoes', price: 600, category: "Shoes", image: 'product16.jpg' },
    { id: 23, name: 'Daniel willington classic', price: 3850, category: "watch", image: 'product45.jpg' },
    { id: 24, name: 'watch-EBEL 1911', price: 1050, category: "watch", image: 'product27.jpg' },
    { id: 25, name: 'Women TAMARIS', price: 850, category: "Shoes", image: 'product43.jpg' },
    { id: 26, name: 'adidas GAZELLE', price: 650, category: "Shoes", image: 'product38.jpg' },
    { id: 27, name: 'Puma Suede', price: 720, category: "Shoes", image: 'product36.jpg' },
    { id: 28, name: 'Apple watch serie', price: 510, category: "watch", image: 'product32.jpg' },
    { id: 29, name: 'Daniel Wellington', price: 1230, category: "watch", image: 'product29.jpg' },
    { id: 30, name: 'Nike Air Max Alpha', price: 2390, category: "Shoes", image: 'product26.jpg' },
    { id: 31, name: 'Puma serie', price: 2500, category: "shoes", image: 'product22.jpg' },
    { id: 32, name: 'Givenchi paris', price: 1150, category: "Shoes", image: 'product42.jpg' },
    { id: 33, name: 'Nike Air Force 1', price: 1200, category: "Shoes", image: 'product38.jpg' },
    { id: 34, name: 'Cameroon Pull-Over', price: 900, category: "Tops", image: 'product41.jpg' },
    { id: 35, name: 'Slim-fit black button-up shirt', price: 725, category: "shirt", image: 'nadiye-odabasi.jpg' },
    { id: 36, name: 'Men traditional African fashion outdoors', price: 1600, category: "shirt", image: 'africa shirt.jpg' },
    { id: 37, name: 'colourblock t-shirt', price: 940, category: "shirt", image: 'moh-adbelghaffar.jpg' },
];

let cart = [];
let currentProducts = [...products];
let saveTimeout = null;
let lastBackup = null;
let orders = [];

// User Account System (Day 16)
let currentUser = null;

// Filter state variables
let currentSortOrder = null;
let currentSearchTerm = '';
let selectedCategories = [];
let minPrice = 0;
let maxPrice = 5000;

// Day 17: Payment
let selectedPaymentMethod = 'bank';
let isProcessingPayment = false;

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return '★'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;');
}

// ============================================
// DATA & LOCALSTORAGE FUNCTIONS
// ============================================

function generateChecksum(items) {
    const str = JSON.stringify(items);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function createCartDataStructure(cartItems) {
    return { version: CART_VERSION, lastUpdated: new Date().toISOString(), items: cartItems, checksum: generateChecksum(cartItems) };
}

function validateCartData(items) {
    if (!Array.isArray(items)) return false;
    for (let item of items) {
        if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') return false;
        if (item.quantity < 1 || item.quantity > 99) return false;
    }
    return true;
}

function normalizeCartItems(items) {
    const merged = new Map();
    items.forEach(item => {
        if (!item || !item.id) return;
        const id = Number(item.id);
        const quantity = Number(item.quantity) || 0;
        if (quantity <= 0) return;
        const existing = merged.get(id);
        if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
        else merged.set(id, { id, name: item.name, price: Number(item.price) || 0, quantity: Math.min(99, quantity), image: item.image || DEFAULT_IMAGE });
    });
    return Array.from(merged.values());
}

function saveCartToLocalStorage() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            cart = normalizeCartItems(cart);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(createCartDataStructure(cart)));
        } catch (e) { logError('Save failed', e); }
        saveTimeout = null;
    }, 300);
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
        try {
            const parsed = JSON.parse(savedCart);
            if (parsed.items && Array.isArray(parsed.items)) {
                const normalized = normalizeCartItems(parsed.items);
                if (validateCartData(normalized)) cart = normalized;
                else { cart = []; localStorage.removeItem(STORAGE_KEY); }
            }
        } catch (e) { cart = []; localStorage.removeItem(STORAGE_KEY); }
    }
    renderCart();
}

// ============================================
// CART FUNCTIONS
// ============================================

function calculateTotal() { return cart.reduce((t, i) => t + (i.price * i.quantity), 0); }

function animateCartBadge() {
    const badge = document.getElementById('cartCount');
    if (badge) { badge.classList.add('bump'); setTimeout(() => badge.classList.remove('bump'), 300); }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const cartIcon = document.getElementById('cartIcon');
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    if (cartCount) {
        const oldValue = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = totalItems;
        if (cartIcon) {
            if (totalItems === 0) cartIcon.setAttribute('data-tooltip', 'Cart is empty');
            else if (totalItems === 1) cartIcon.setAttribute('data-tooltip', '1 item in cart');
            else cartIcon.setAttribute('data-tooltip', `${totalItems} items in cart`);
        }
        if (totalItems !== oldValue && totalItems > oldValue) {
            cartCount.classList.add('pulse');
            setTimeout(() => cartCount.classList.remove('pulse'), 500);
        }
        if (totalItems !== oldValue) animateCartBadge();
    }
}

function updateCartAndRender() { saveCartToLocalStorage(); renderCart(); }

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(i => i.id === productId);
    if (existing) {
        if (existing.quantity >= 99) { alert('Maximum quantity of 99 per item reached!'); return; }
        existing.quantity += 1;
    } else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    updateCartAndRender();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    if (newQuantity > 99) { alert('Maximum quantity is 99 per item!'); newQuantity = 99; }
    if (newQuantity <= 0) cart = cart.filter(i => i.id !== productId);
    else item.quantity = newQuantity;
    updateCartAndRender();
}

function removeFromCart(productId) { cart = cart.filter(i => i.id !== productId); updateCartAndRender(); }
function clearCart() { cart = []; updateCartAndRender(); }

// ============================================
// ORDER FUNCTIONS 
// ============================================

function generateOrderId() {
    const d = new Date();
    const ts = d.getFullYear().toString() + (d.getMonth()+1).toString().padStart(2,'0') + d.getDate().toString().padStart(2,'0') + d.getHours().toString().padStart(2,'0') + d.getMinutes().toString().padStart(2,'0') + d.getSeconds().toString().padStart(2,'0');
    return `ORD-${ts}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
}

function saveOrderToHistory(order) {
    try {
        let savedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        order.userId = currentUser ? currentUser.id : null;
        order.userEmail = currentUser ? currentUser.email : null;
        savedOrders.unshift(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(savedOrders));
    } catch (e) { logError('Failed to save order', e); }
}

function loadOrdersFromStorage() {
    try {
        const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
        orders = currentUser ? allOrders.filter(o => o.userId === currentUser.id) : [];
    } catch (e) { orders = []; }
}

function updateOrderSummary() {
    const div = document.getElementById('orderSummary');
    if (!div) return;
    if (cart.length === 0) { div.innerHTML = '<p style="text-align:center;color:#ff6b6b;">Your cart is empty</p>'; return; }
    let html = '<h4>Order Summary</h4>';
    cart.forEach(item => html += `<div class="order-summary-item"><span>${escapeHtml(item.name)} x ${item.quantity}</span><span>¥${(item.price*item.quantity).toLocaleString()}</span></div>`);
    html += `<div class="order-summary-total"><span>Total</span><span>¥${calculateTotal().toLocaleString()}</span></div>`;
    div.innerHTML = html;
}

function validateCheckoutForm() {
    let isValid = true;
    const name = document.getElementById('customerName');
    const email = document.getElementById('customerEmail');
    const address = document.getElementById('customerAddress');
    const payment = document.getElementById('paymentMethod');
    
    document.querySelectorAll('.form-input').forEach(i => { i.classList.remove('error'); i.parentNode?.querySelector('.error-message')?.remove(); });
    
    if (!name?.value.trim()) { showFieldError(name, 'Name required'); isValid = false; }
    if (!email?.value.trim()) { showFieldError(email, 'Email required'); isValid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showFieldError(email, 'Valid email required'); isValid = false; }
    if (!address?.value.trim()) { showFieldError(address, 'Address required'); isValid = false; }
    if (!payment?.value) { showFieldError(payment, 'Select payment method'); isValid = false; }
    return isValid;
}

function showFieldError(input, msg) {
    if (input) { input.classList.add('error'); const div = document.createElement('div'); div.className = 'error-message'; div.textContent = msg; input.parentNode.appendChild(div); }
}

// ============================================
// PAYMENT FUNCTIONS 
// ============================================

function updatePaymentDetails() {
    const detailsDiv = document.getElementById('paymentDetails');
    if (!detailsDiv) return;
    
    if (selectedPaymentMethod === 'bank') {
        detailsDiv.innerHTML = `<div class="bank-details">
            <p>🏦 <strong>Bank Transfer Details:</strong></p>
            <p>Bank: China Merchants Bank</p>
            <p>Account Name: LEZECK STORE LTD</p>
            <p>Account Number: 6212 **** **** 8888</p>
            <p>SWIFT Code: CMBCCNBS</p>
            <p class="payment-note">Please use your Order ID as reference</p>
        </div>`;
    } else if (selectedPaymentMethod === 'alipay') {
        detailsDiv.innerHTML = `<div class="alipay-details">
            <div class="qr-placeholder">📱 Alipay QR Code<br>(Scan to pay)</div>
            <p>Open Alipay app and scan QR code</p>
            <p class="payment-note">Amount: <strong>¥${calculateTotal().toLocaleString()}</strong></p>
        </div>`;
    } else if (selectedPaymentMethod === 'wechat') {
        detailsDiv.innerHTML = `<div class="wechat-details">
            <div class="qr-placeholder">💚 WeChat Pay QR Code<br>(Scan to pay)</div>
            <p>Open WeChat app and scan QR code</p>
            <p class="payment-note">Amount: <strong>¥${calculateTotal().toLocaleString()}</strong></p>
        </div>`;
    }
}

function setupPaymentMethods() {
    const methods = document.querySelectorAll('.payment-method');
    methods.forEach(method => {
        method.addEventListener('click', () => {
            methods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            selectedPaymentMethod = method.dataset.method;
            updatePaymentDetails();
        });
    });
}

function openPaymentModal() {
    if (!validateCheckoutForm()) return;
    const modal = document.getElementById('paymentModal');
    const paymentTotal = document.getElementById('paymentTotal');
    if (paymentTotal) paymentTotal.textContent = `¥${calculateTotal().toLocaleString()}`;
    updatePaymentDetails();
    if (modal) modal.classList.add('open');
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) { statusDiv.className = 'payment-status'; statusDiv.style.display = 'none'; }
    isProcessingPayment = false;
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) modal.classList.remove('open');
    isProcessingPayment = false;
    const statusDiv = document.getElementById('paymentStatus');
    if (statusDiv) { statusDiv.className = 'payment-status'; statusDiv.style.display = 'none'; }
}

function processPayment() {
    if (isProcessingPayment) return;
    const statusDiv = document.getElementById('paymentStatus');
    isProcessingPayment = true;
    statusDiv.className = 'payment-status processing';
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '⏳ Processing payment... Please wait.';
    
    setTimeout(() => {
        const isSuccess = Math.random() < 0.99;
        
        if (isSuccess) {
            statusDiv.className = 'payment-status success';
            statusDiv.innerHTML = '✅ Payment successful! Completing your order...';
            setTimeout(() => completeOrderAfterPayment(), 1500);
        } else {
            statusDiv.className = 'payment-status error';
            statusDiv.innerHTML = '❌ Payment failed. Please try again.';
            isProcessingPayment = false;
        }
    }, 2000);
}

function completeOrderAfterPayment() {
    const name = document.getElementById('customerName')?.value.trim() || '';
    const email = document.getElementById('customerEmail')?.value.trim() || '';
    const address = document.getElementById('customerAddress')?.value.trim() || '';
    const paymentMethodSelect = document.getElementById('paymentMethod')?.value || '';
    
    const methodNames = { 'bank': '🏦 Bank Transfer', 'alipay': '💰 Alipay', 'wechat': '💚 WeChat Pay' };
    const total = calculateTotal();
    
    const order = {
        orderId: generateOrderId(),
        date: new Date().toLocaleString(),
        customer: { name, email, address },
        paymentMethod: methodNames[selectedPaymentMethod] || paymentMethodSelect,
        paymentDetails: { method: selectedPaymentMethod, status: 'paid', timestamp: new Date().toISOString() },
        items: JSON.parse(JSON.stringify(cart)),
        total: total,
        itemCount: cart.reduce((s, i) => s + i.quantity, 0)
    };
    
    saveOrderToHistory(order);
    clearCart();
    closePaymentModal();
    closeCheckoutModal();
    showSuccessMessage(`✅ Payment completed! Order ${order.orderId} confirmed. Thank you ${name}!`);
    isProcessingPayment = false;
}

function placeOrder() {
    if (!validateCheckoutForm()) return;
    if (cart.length === 0) { alert('❌ Your cart is empty!'); return; }
    openPaymentModal();
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function showSuccessMessage(msg) {
    const toast = document.getElementById('successToast');
    if (toast) { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); }
}

function closeCheckoutModal() { document.getElementById('checkoutModal')?.classList.remove('open'); }
function openCheckoutModal() {
    if (!currentUser) { alert('Please login to checkout'); openLoginModal(); return; }
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const name = document.getElementById('customerName'); const email = document.getElementById('customerEmail'); const address = document.getElementById('customerAddress'); const payment = document.getElementById('paymentMethod');
    if (name) name.value = currentUser.name; if (email) email.value = currentUser.email; if (address) address.value = ''; if (payment) payment.value = '';
    document.querySelectorAll('.form-input').forEach(i => { i.classList.remove('error'); i.parentNode?.querySelector('.error-message')?.remove(); });
    updateOrderSummary(); document.getElementById('checkoutModal')?.classList.add('open');
}

function openOrdersModal() {
    loadOrdersFromStorage();
    const list = document.getElementById('ordersList');
    if (orders.length === 0) list.innerHTML = '<p style="text-align:center;color:#999;">📭 No orders yet. Complete your first order!</p>';
    else list.innerHTML = orders.map(o => `<div class="order-card"><div class="order-header"><span class="order-id">${escapeHtml(o.orderId)}</span><span>📅 ${o.date}</span></div><div class="order-items">${o.items.map(i => `${escapeHtml(i.name)} x ${i.quantity}`).join(', ')}</div><div class="order-total">💰 Total: ¥${o.total.toLocaleString()}</div><div class="order-header"><span>🚚 ${escapeHtml(o.customer.name)}</span><span>${o.paymentMethod}</span></div></div>`).join('');
    document.getElementById('ordersModal')?.classList.add('open');
}
function closeOrdersModal() { document.getElementById('ordersModal')?.classList.remove('open'); }

// ============================================
// USER ACCOUNT SYSTEM (Day 16)
// ============================================

function hashPassword(pwd) { let hash = 0; for (let i = 0; i < pwd.length; i++) { const c = pwd.charCodeAt(i); hash = ((hash << 5) - hash) + c; hash = hash & hash; } return hash.toString(); }
function loadUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch(e) { return []; } }
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function registerUser(name, email, password, confirm) {
    if (!name || !email || !password || !confirm) { alert('Please fill all fields'); return false; }
    if (password !== confirm) { alert('Passwords do not match'); return false; }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Valid email required'); return false; }
    const users = loadUsers();
    if (users.find(u => u.email === email)) { alert('Email already registered'); return false; }
    const newUser = { id: Date.now().toString(), name, email, passwordHash: hashPassword(password), createdAt: new Date().toISOString() };
    users.push(newUser); saveUsers(users);
    currentUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showSuccessMessage(`Welcome ${name}!`); updateAccountUI(); closeRegisterModal();
    return true;
}

function loginUser(email, password, remember) {
    if (!email || !password) { alert('Please enter email and password'); return false; }
    const users = loadUsers(); const hash = hashPassword(password);
    const user = users.find(u => u.email === email && u.passwordHash === hash);
    if (!user) { alert('Invalid email or password'); return false; }
    currentUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem('currentUser', JSON.stringify({ user: currentUser, remember }));
    showSuccessMessage(`Welcome back ${user.name}!`); updateAccountUI(); loadOrdersFromStorage(); closeLoginModal();
    return true;
}

function logoutUser() { currentUser = null; localStorage.removeItem('currentUser'); updateAccountUI(); loadOrdersFromStorage(); showSuccessMessage('Logged out'); closeDropdown(); }
function loadCurrentUser() { try { const session = JSON.parse(localStorage.getItem('currentUser')); if (session) currentUser = session.user; } catch(e) {} updateAccountUI(); }
function updateAccountUI() {
    const nameDisp = document.getElementById('userNameDisplay'); const loginBtn = document.getElementById('loginBtn'); const regBtn = document.getElementById('registerBtn'); const logoutBtn = document.getElementById('logoutBtn'); const ordersBtn = document.getElementById('ordersBtn');
    if (currentUser) {
        if (nameDisp) nameDisp.textContent = `👤 ${currentUser.name}`;
        if (loginBtn) loginBtn.style.display = 'none'; if (regBtn) regBtn.style.display = 'none'; if (logoutBtn) logoutBtn.style.display = 'block'; if (ordersBtn) ordersBtn.style.display = 'block';
    } else {
        if (nameDisp) nameDisp.textContent = 'Guest';
        if (loginBtn) loginBtn.style.display = 'block'; if (regBtn) regBtn.style.display = 'block'; if (logoutBtn) logoutBtn.style.display = 'none'; if (ordersBtn) ordersBtn.style.display = 'block';
    }
}
function toggleDropdown() { document.getElementById('dropdownContent')?.classList.toggle('show'); }
function closeDropdown() { document.getElementById('dropdownContent')?.classList.remove('show'); }
function openRegisterModal() { document.getElementById('registerModal')?.classList.add('open'); closeDropdown(); }
function closeRegisterModal() { document.getElementById('registerModal')?.classList.remove('open'); document.getElementById('registerForm')?.reset(); }
function openLoginModal() { document.getElementById('loginModal')?.classList.add('open'); closeDropdown(); }
function closeLoginModal() { document.getElementById('loginModal')?.classList.remove('open'); document.getElementById('loginForm')?.reset(); }

// ============================================
// DISPLAY PRODUCTS
// ============================================

function displayProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    grid.innerHTML = '';
    currentProducts.forEach(p => {
        const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
        const stars = getStarRating(parseFloat(rating));
        const inStock = Math.random() > 0.2;
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `<div class="skeleton-img"></div><img src="${p.image}" class="product-img" style="display:none;" loading="lazy" onerror="handleImageError(event)" onload="handleImageLoad(event)"><div class="product-info"><div class="product-name">${escapeHtml(p.name)}</div><div class="product-rating">${stars} ${rating}</div><div class="product-price">¥${p.price.toLocaleString()}</div><div class="stock-badge ${inStock ? 'stock-in' : 'stock-low'}">${inStock ? 'In Stock' : 'Low Stock'}</div><button class="add-btn" data-id="${p.id}">Add to Cart</button></div>`;
        grid.appendChild(card);
    });
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) flyToCart(product.image, id, btn);
            else addToCart(id);
            btn.textContent = '✓ Added!';
            setTimeout(() => btn.textContent = 'Add to Cart', 1000);
        });
    });
}

function handleImageError(e) { e.target.src = DEFAULT_IMAGE; }
function handleImageLoad(e) { const skel = e.target.previousSibling; if (skel?.classList?.contains('skeleton-img')) skel.style.display = 'none'; e.target.style.display = 'block'; }

// ============================================
// RENDER CART
// ============================================

function renderCart() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = `<div class="empty-cart-illustration"><div class="empty-cart-icon">🛍️</div><p>Your cart is empty</p><p class="empty-cart-subtitle">Add some trendy pieces to get started!</p><a href="#" class="empty-cart-link" id="browseProductsLink">→ Browse our products</a></div>`;
        if (totalEl) totalEl.textContent = 'Total: 0 RMB';
        updateCartCount();
        document.getElementById('browseProductsLink')?.addEventListener('click', (e) => { e.preventDefault(); closeSidebar(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
        return;
    }
    container.innerHTML = '';
    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<img src="${item.image}" class="cart-item-img" loading="lazy" onerror="handleImageError(event)"><div class="cart-item-details"><div class="cart-item-name">${escapeHtml(item.name)}</div><div class="cart-item-price">${item.price.toLocaleString()} RMB</div><div class="cart-item-subtotal">Subtotal: ${subtotal.toLocaleString()} RMB</div><div class="item-quantity"><button class="minus-btn" data-id="${item.id}">-</button><span>${item.quantity}</span><button class="plus-btn" data-id="${item.id}">+</button><button class="remove-item" data-id="${item.id}">🗑️</button></div></div>`;
        container.appendChild(div);
    });
    if (totalEl) totalEl.textContent = `Total: ${calculateTotal().toLocaleString()} RMB`;
    updateCartCount();
    document.querySelectorAll('.minus-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); const id = parseInt(btn.dataset.id); const item = cart.find(i => i.id === id); if (item.quantity > 1) updateQuantity(id, item.quantity - 1); else if (item.quantity === 1) removeFromCart(id); }));
    document.querySelectorAll('.plus-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); const id = parseInt(btn.dataset.id); const item = cart.find(i => i.id === id); if (item.quantity < 99) updateQuantity(id, item.quantity + 1); else alert('Maximum 99 per item'); }));
    document.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); removeFromCart(parseInt(btn.dataset.id)); }));
}

// ============================================
// FILTERS & SORTING (Days 11-14)
// ============================================

function applyFilters() {
    let filtered = [...products];
    if (selectedCategories.length > 0) filtered = filtered.filter(p => selectedCategories.includes(p.category));
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    if (currentSearchTerm.trim()) { const s = currentSearchTerm.toLowerCase(); filtered = filtered.filter(p => p.name.toLowerCase().includes(s)); }
    if (currentSortOrder === 'asc') filtered.sort((a,b) => a.price - b.price);
    else if (currentSortOrder === 'desc') filtered.sort((a,b) => b.price - a.price);
    currentProducts = filtered;
    displayProducts();
    const resultsEl = document.getElementById('resultsCount');
    if (resultsEl) resultsEl.innerHTML = currentProducts.length === 0 ? '😢 No products found.' : `Showing ${currentProducts.length} product${currentProducts.length !== 1 ? 's' : ''}`;
    updateActiveFilters();
}

function updateActiveFilters() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    const tags = [];
    if (selectedCategories.length) tags.push({ type: 'cat', label: `Categories: ${selectedCategories.join(', ')}`, remove: () => { document.querySelectorAll('.category-chk').forEach(c => c.checked = false); selectedCategories = []; applyFilters(); } });
    if (minPrice !== 0 || maxPrice !== 5000) tags.push({ type: 'price', label: `Price: ¥${minPrice} - ¥${maxPrice}`, remove: () => { minPrice = 0; maxPrice = 5000; const minInp = document.getElementById('minPrice'); const maxInp = document.getElementById('maxPrice'); const slider = document.getElementById('priceSlider'); if (minInp) minInp.value = 0; if (maxInp) maxInp.value = 5000; if (slider) slider.value = 5000; applyFilters(); } });
    if (currentSearchTerm.trim()) tags.push({ type: 'search', label: `Search: "${currentSearchTerm}"`, remove: () => { currentSearchTerm = ''; const searchInp = document.getElementById('searchInput'); if (searchInp) searchInp.value = ''; applyFilters(); } });
    if (currentSortOrder === 'asc') tags.push({ type: 'sort', label: 'Price: Low to High', remove: () => { currentSortOrder = null; document.getElementById('sortLowToHigh')?.classList.remove('active-sort'); document.getElementById('sortHighToLow')?.classList.remove('active-sort'); applyFilters(); } });
    else if (currentSortOrder === 'desc') tags.push({ type: 'sort', label: 'Price: High to Low', remove: () => { currentSortOrder = null; document.getElementById('sortLowToHigh')?.classList.remove('active-sort'); document.getElementById('sortHighToLow')?.classList.remove('active-sort'); applyFilters(); } });
    container.innerHTML = tags.length ? tags.map(t => `<div class="filter-tag">${t.label}<span class="remove-filter">✖</span></div>`).join('') : '';
    container.querySelectorAll('.remove-filter').forEach((btn, i) => btn.addEventListener('click', () => tags[i].remove()));
}

function sortProducts(order) {
    currentSortOrder = order;
    const lowBtn = document.getElementById('sortLowToHigh'), highBtn = document.getElementById('sortHighToLow');
    if (order === 'asc') { lowBtn?.classList.add('active-sort'); highBtn?.classList.remove('active-sort'); }
    else { highBtn?.classList.add('active-sort'); lowBtn?.classList.remove('active-sort'); }
    applyFilters();
}

function setupSortingUI() {
    const low = document.getElementById('sortLowToHigh'), high = document.getElementById('sortHighToLow');
    if (low) { const clone = low.cloneNode(true); low.parentNode.replaceChild(clone, low); clone.addEventListener('click', () => sortProducts('asc')); }
    if (high) { const clone = high.cloneNode(true); high.parentNode.replaceChild(clone, high); clone.addEventListener('click', () => sortProducts('desc')); }
}

function setupPriceRange() {
    const min = document.getElementById('minPrice'), max = document.getElementById('maxPrice'), slider = document.getElementById('priceSlider');
    min?.addEventListener('input', e => { minPrice = parseInt(e.target.value) || 0; if (minPrice < 0) minPrice = 0; applyFilters(); });
    max?.addEventListener('input', e => { maxPrice = parseInt(e.target.value) || 5000; if (slider) slider.value = maxPrice; applyFilters(); });
    slider?.addEventListener('input', e => { maxPrice = parseInt(e.target.value); if (max) max.value = maxPrice; applyFilters(); });
}

function setupMultiCategory() {
    document.querySelectorAll('.category-chk').forEach(cb => { const clone = cb.cloneNode(true); cb.parentNode.replaceChild(clone, cb); clone.addEventListener('change', e => { if (e.target.checked) selectedCategories.push(e.target.value); else selectedCategories = selectedCategories.filter(c => c !== e.target.value); applyFilters(); }); });
}

function setupSearch() { document.getElementById('searchInput')?.addEventListener('input', e => { currentSearchTerm = e.target.value; applyFilters(); }); }
function setupClearFilters() { document.getElementById('clearFiltersBtn')?.addEventListener('click', () => { selectedCategories = []; document.querySelectorAll('.category-chk').forEach(c => c.checked = false); minPrice = 0; maxPrice = 5000; const mi = document.getElementById('minPrice'), ma = document.getElementById('maxPrice'), sl = document.getElementById('priceSlider'); if (mi) mi.value = 0; if (ma) ma.value = 5000; if (sl) sl.value = 5000; currentSearchTerm = ''; const si = document.getElementById('searchInput'); if (si) si.value = ''; currentSortOrder = null; document.getElementById('sortLowToHigh')?.classList.remove('active-sort'); document.getElementById('sortHighToLow')?.classList.remove('active-sort'); applyFilters(); }); }

// ============================================
// SIDEBAR & KEYBOARD
// ============================================

function openSidebar() { const s = document.getElementById('cartSidebar'); if (s) { s.classList.add('open'); setTimeout(() => document.getElementById('cartItems')?.scrollTo(0, 0), 50); } }
function closeSidebar() { document.getElementById('cartSidebar')?.classList.remove('open'); }
function setupKeyboardSupport() { document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (document.getElementById('cartSidebar')?.classList.contains('open')) closeSidebar(); else if (document.getElementById('checkoutModal')?.classList.contains('open')) closeCheckoutModal(); } }); }
function setupCrossTabSync() { window.addEventListener('storage', e => { if (e.key === STORAGE_KEY && e.newValue) { loadCartFromLocalStorage(); renderCart(); showSuccessMessage('Cart updated from another tab'); } }); }

// ============================================
// TESTIMONIALS (Day 19) - FIXED
// ============================================

const testimonials = [
    { name: "Sarah Johnson", role: "Fashion Blogger", text: "Absolutely love my new dress from LEZECKSTORE! The quality is amazing and the shipping was super fast. Will definitely order again!", rating: 5, avatar: "👩‍🦰" },
    { name: "Michael Chen", role: "Tech Reviewer", text: "The MacBook Air I ordered arrived perfectly packaged. Great customer service and competitive prices. Highly recommended!", rating: 5, avatar: "👨‍💻" },
    { name: "Emma Williams", role: "Style Influencer", text: "Best online shopping experience ever! The return policy is hassle-free and their support team is always helpful. 10/10!", rating: 5, avatar: "👩‍🎨" },
    { name: "David Kim", role: "Business Owner", text: "I've bought multiple items from LEZECKSTORE. Consistent quality and excellent service. My go-to fashion store!", rating: 4, avatar: "👨‍💼" }
];

function displayTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    grid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="testimonial-stars">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
            <p class="testimonial-text">"${escapeHtml(t.text)}"</p>
            <div class="testimonial-author">
                <div class="testimonial-avatar">${t.avatar}</div>
                <div class="testimonial-info">
                    <h4>${escapeHtml(t.name)}</h4>
                    <p>${escapeHtml(t.role)}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// NEWSLETTER & HERO BUTTONS
// ============================================

function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail')?.value;
            if (email) {
                showSuccessMessage(`✅ Subscribed! Thank you for joining our newsletter.`);
                form.reset();
            }
        });
    }
}

function setupHeroButtons() {
    const shopNowBtn = document.getElementById('shopNowBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (shopNowBtn) shopNowBtn.addEventListener('click', () => document.querySelector('.main-content')?.scrollIntoView({ behavior: 'smooth' }));
    if (learnMoreBtn) learnMoreBtn.addEventListener('click', () => document.querySelector('.features-section')?.scrollIntoView({ behavior: 'smooth' }));
}

// ============================================
// UI SETUP FUNCTIONS
// ============================================

function setupUI() {
    document.getElementById('cartIcon')?.addEventListener('click', () => openSidebar());
    document.getElementById('closeCartBtn')?.addEventListener('click', () => closeSidebar());
    document.getElementById('checkoutBtn')?.addEventListener('click', () => openCheckoutModal());
    document.getElementById('cancelModalBtn')?.addEventListener('click', () => closeCheckoutModal());
    document.getElementById('confirmOrderBtn')?.addEventListener('click', () => placeOrder());
    document.getElementById('closeCheckoutModalBtn')?.addEventListener('click', () => closeCheckoutModal());
    window.addEventListener('click', e => { if (e.target === document.getElementById('checkoutModal')) closeCheckoutModal(); });
}

function setupOrdersModal() {
    document.getElementById('ordersBtn')?.addEventListener('click', () => openOrdersModal());
    document.getElementById('closeOrdersBtn')?.addEventListener('click', () => closeOrdersModal());
    window.addEventListener('click', e => { if (e.target === document.getElementById('ordersModal')) closeOrdersModal(); });
}

function setupPaymentModal() {
    document.getElementById('closePaymentBtn')?.addEventListener('click', () => closePaymentModal());
    document.getElementById('cancelPaymentBtn')?.addEventListener('click', () => closePaymentModal());
    document.getElementById('processPaymentBtn')?.addEventListener('click', () => processPayment());
    window.addEventListener('click', e => { if (e.target === document.getElementById('paymentModal')) closePaymentModal(); });
    setupPaymentMethods();
}

function setupAccountSystem() {
    document.getElementById('accountBtn')?.addEventListener('click', toggleDropdown);
    document.getElementById('loginBtn')?.addEventListener('click', openLoginModal);
    document.getElementById('registerBtn')?.addEventListener('click', openRegisterModal);
    document.getElementById('logoutBtn')?.addEventListener('click', logoutUser);
    document.getElementById('closeRegisterBtn')?.addEventListener('click', closeRegisterModal);
    document.getElementById('closeLoginBtn')?.addEventListener('click', closeLoginModal);
    document.getElementById('switchToLogin')?.addEventListener('click', e => { e.preventDefault(); closeRegisterModal(); openLoginModal(); });
    document.getElementById('switchToRegister')?.addEventListener('click', e => { e.preventDefault(); closeLoginModal(); openRegisterModal(); });
    document.getElementById('registerForm')?.addEventListener('submit', e => { e.preventDefault(); registerUser(document.getElementById('regName').value, document.getElementById('regEmail').value, document.getElementById('regPassword').value, document.getElementById('regConfirmPassword').value); });
    document.getElementById('loginForm')?.addEventListener('submit', e => { e.preventDefault(); loginUser(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value, document.getElementById('rememberMe')?.checked || false); });
    window.addEventListener('click', e => { const dd = document.getElementById('dropdownContent'); const btn = document.getElementById('accountBtn'); if (dd && !dd.contains(e.target) && e.target !== btn) dd.classList.remove('show'); });
}

// Make functions globally available
window.handleImageError = handleImageError;
window.handleImageLoad = handleImageLoad;

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Silent initialization for production (no console logs)
    
    loadCurrentUser();
    loadCartFromLocalStorage();
    loadOrdersFromStorage();
    displayProducts();
    setupSortingUI();
    setupPriceRange();
    setupMultiCategory();
    setupSearch();
    setupClearFilters();
    setupUI();
    setupKeyboardSupport();
    setupCrossTabSync();
    setupOrdersModal();
    setupAccountSystem();
    setupPaymentModal();
    
    // Day 18+19 functions
    displayTestimonials();
    setupNewsletter();
    setupHeroButtons();
    
    const resultsEl = document.getElementById('resultsCount');
    if (resultsEl) resultsEl.innerHTML = `Showing ${currentProducts.length} products`;
});