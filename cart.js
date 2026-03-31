/* ================================================
   ALFULANY CONCEPT — CART SYSTEM
   LocalStorage-powered cart for store page
   ================================================ */

const CART_KEY = 'alfulany_cart';

// ─── Cart State ───
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

// ─── Cart Persistence ───
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ─── Add to Cart ───
function addToCart(id, title, price, emoji) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, title, price, emoji, qty: 1 });
  }
  saveCart();
  renderCart();
  updateBadge();
  openCart();
  if (typeof showToast === 'function') {
    showToast(`🛒 "${title}" added to cart!`);
  }
}

// ─── Remove from Cart ───
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
  updateBadge();
}

// ─── Update Quantity ───
function updateQty(id, delta) {
  const item = cart.find(item => item.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCart();
  updateBadge();
}

// ─── Get Total ───
function getTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// ─── Get Total Items ───
function getTotalItems() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// ─── Update Badge ───
function updateBadge() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const count = getTotalItems();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

// ─── Render Cart ───
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍️</div>
        <h3>Your cart is empty</h3>
        <p>Add some books to get started on your reading journey.</p>
      </div>
    `;
    updateTotal();
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-thumb">${item.emoji}</div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">₦${(item.price).toLocaleString()}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">×</button>
    </div>
  `).join('');

  updateTotal();
}

// ─── Update Total Display ───
function updateTotal() {
  const total = getTotal();
  const subtotalEl = document.getElementById('cartSubtotal');
  const totalEl = document.getElementById('cartTotal');
  if (subtotalEl) subtotalEl.textContent = `₦${total.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;
}

// ─── Open/Close Cart ───
function openCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  panel?.classList.add('open');
  overlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  panel?.classList.remove('open');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── Checkout (placeholder) ───
function checkout() {
  if (cart.length === 0) {
    showToast('⚠️ Your cart is empty!');
    return;
  }
  // Format WhatsApp message
  const lines = cart.map(item => `• ${item.title} x${item.qty} — ₦${(item.price * item.qty).toLocaleString()}`).join('\n');
  const total = getTotal();
  const msg = `Hello Alfulany Concept! I'd like to order:\n\n${lines}\n\n*Total: ₦${total.toLocaleString()}*\n\nPlease confirm availability. Thank you!`;
  const encoded = encodeURIComponent(msg);
  const phone = '2348000000000'; // TODO: Replace with actual WhatsApp number
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
}

// ─── Init on DOM ready ───
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateBadge();

  // Cart trigger button
  const cartTrigger = document.getElementById('cartTrigger');
  cartTrigger?.addEventListener('click', openCart);

  // Close button
  const cartClose = document.getElementById('cartClose');
  cartClose?.addEventListener('click', closeCart);

  // Overlay click
  const cartOverlay = document.getElementById('cartOverlay');
  cartOverlay?.addEventListener('click', closeCart);

  // Checkout button
  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn?.addEventListener('click', checkout);

  // Wire up Add to Cart buttons
  document.querySelectorAll('[data-add-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const title = btn.dataset.title;
      const price = parseInt(btn.dataset.price);
      const emoji = btn.dataset.emoji || '📚';
      addToCart(id, title, price, emoji);
    });
  });
});

// Expose globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;
window.openCart = openCart;
window.closeCart = closeCart;
window.checkout = checkout;