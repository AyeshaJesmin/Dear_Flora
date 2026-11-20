// Dear Flora — Cart Page Logic
// Cart is stored in localStorage under key "dearFloraCart"
// Each cart item: { id, name, image, price, variant, quantity }

const CART_KEY = 'dearFloraCart';
const DELIVERY_FEE = 300;

const cartList = document.querySelector('#cartList');
const cartEmpty = document.querySelector('#cartEmpty');
const subtotalAmount = document.querySelector('#subtotalAmount');
const deliveryAmount = document.querySelector('#deliveryAmount');
const totalAmount = document.querySelector('#totalAmount');
const checkoutBtn = document.querySelector('#checkoutBtn');
const itemTemplate = document.querySelector('#cartItemTemplate');

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read cart:', err);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

function renderCart() {
  const cart = getCart();
  cartList.replaceChildren();

  if (cart.length === 0) {
    cartEmpty.hidden = false;
    subtotalAmount.textContent = formatPrice(0);
    deliveryAmount.textContent = formatPrice(0);
    totalAmount.textContent = formatPrice(0);
    checkoutBtn.disabled = true;
    return;
  }

  cartEmpty.hidden = true;
  checkoutBtn.disabled = false;

  let subtotal = 0;

  cart.forEach((item) => {
    const node = itemTemplate.content.cloneNode(true);
    const article = node.querySelector('.cart-item');
    article.dataset.id = item.id;

    node.querySelector('.cart-item-image').src = item.image;
    node.querySelector('.cart-item-image').alt = item.name;
    node.querySelector('.cart-item-name').textContent = item.name;
    node.querySelector('.cart-item-variant').textContent = item.variant || '';
    node.querySelector('.cart-item-price').textContent = `${formatPrice(item.price)} each`;
    node.querySelector('.qty-value').textContent = item.quantity;

    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    node.querySelector('.cart-item-line-total').textContent = formatPrice(lineTotal);

    cartList.appendChild(node);
  });

  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  subtotalAmount.textContent = formatPrice(subtotal);
  deliveryAmount.textContent = formatPrice(delivery);
  totalAmount.textContent = formatPrice(subtotal + delivery);
}

function updateQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity < 1) item.quantity = 1;

  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}

cartList.addEventListener('click', (event) => {
  const article = event.target.closest('.cart-item');
  if (!article) return;
  const id = article.dataset.id;

  if (event.target.matches('.qty-increase')) {
    updateQuantity(id, 1);
  } else if (event.target.matches('.qty-decrease')) {
    updateQuantity(id, -1);
  } else if (event.target.matches('.remove-item-btn')) {
    removeItem(id);
  }
});

checkoutBtn.addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

renderCart();

/* Keep the cart in sync if items are added/changed from another tab
   (e.g. a product page open in a different tab) or when the user
   switches back to this tab after adding something elsewhere. */
window.addEventListener('storage', (event) => {
  if (event.key === CART_KEY) renderCart();
});

window.addEventListener('pageshow', renderCart);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') renderCart();
});