// Dear Flora — Checkout Page Logic

const CART_KEY = 'dearFloraCart';
const LAST_ORDER_KEY = 'dearFloraLastOrder';
const DELIVERY_FEE = 300;

/* ============================================================
   CONFIG — oyage values dala replace karanna
   ============================================================ */
// SETUP-GUIDE.md eke 2 wana step eke ganna Web App URL eka methanata danna
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBDnh1AgvHf72xyfLui44k0ZNkQLTxk8EvvqIhlZVqjIQJOuaPvssY1FZXQWjK_sqR6Q/exec';

// Owner ge WhatsApp number eka, country code eka ekka, "+" ekakwath, space ekakwath nathuwa
// Udahara: Sri Lanka 077 1234567 nam -> "94771234567"
const WHATSAPP_NUMBER = '94761247323';

const checkoutForm = document.querySelector('#checkoutForm');
const checkoutItems = document.querySelector('#checkoutItems');
const subtotalAmount = document.querySelector('#subtotalAmount');
const deliveryAmount = document.querySelector('#deliveryAmount');
const totalAmount = document.querySelector('#totalAmount');
const placeOrderBtn = document.querySelector('#placeOrderBtn');
const bankDetails = document.querySelector('#bankDetails');
const paymentCards = document.querySelectorAll('.payment-card');

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Could not read cart:', err);
    return [];
  }
}

function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

let currentCart = [];
let currentSubtotal = 0;
let currentDelivery = 0;
let currentTotal = 0;

function renderSummary() {
  currentCart = getCart();
  checkoutItems.replaceChildren();

  if (currentCart.length === 0) {
    checkoutItems.innerHTML = '<p class="checkout-empty-note">Your cart is empty. <a href="shop.html">Browse bouquets →</a></p>';
    placeOrderBtn.disabled = true;
  } else {
    placeOrderBtn.disabled = false;
  }

  currentSubtotal = 0;

  currentCart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    currentSubtotal += lineTotal;

    const row = document.createElement('div');
    row.className = 'checkout-item-row';
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="checkout-item-details">
        <p class="checkout-item-name">${item.name} <span>× ${item.quantity}</span></p>
        ${item.variant ? `<p class="checkout-item-variant">${item.variant}</p>` : ''}
      </div>
      <p class="checkout-item-price">${formatPrice(lineTotal)}</p>
    `;
    checkoutItems.appendChild(row);
  });

  currentDelivery = currentSubtotal > 0 ? DELIVERY_FEE : 0;
  currentTotal = currentSubtotal + currentDelivery;

  subtotalAmount.textContent = formatPrice(currentSubtotal);
  deliveryAmount.textContent = formatPrice(currentDelivery);
  totalAmount.textContent = formatPrice(currentTotal);
}

/* ---- Payment method toggle ---- */
paymentCards.forEach((card) => {
  card.addEventListener('click', () => {
    paymentCards.forEach((c) => c.classList.remove('selected'));
    card.classList.add('selected');
    const input = card.querySelector('input');
    input.checked = true;
    bankDetails.hidden = input.value !== 'Bank Transfer';
  });
});

/* ---- Build the WhatsApp message + link for this order ---- */
function buildWhatsAppLink(order) {
  const lines = [
    `*New Order — ${order.orderId}*`,
    '',
    `Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    order.customer.email ? `Email: ${order.customer.email}` : null,
    `Address: ${order.customer.address}, ${order.customer.city}`,
    order.customer.deliveryDate ? `Preferred date: ${order.customer.deliveryDate}` : null,
    order.customer.notes ? `Notes: ${order.customer.notes}` : null,
    '',
    '*Items:*',
    ...order.items.map((i) => `• ${i.name} x${i.quantity}${i.variant ? ` (${i.variant})` : ''} — ${formatPrice(i.price * i.quantity)}`),
    '',
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery: ${formatPrice(order.delivery)}`,
    `*Total: ${formatPrice(order.total)}*`,
    '',
    `Payment method: ${order.paymentMethod}`,
    order.transactionRef ? `Transaction ref: ${order.transactionRef}` : null
  ].filter(Boolean);

  const message = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

/* ---- Send a copy of the order to the Google Sheet (fire-and-forget) ---- */
function logOrderToSheet(order) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR')) {
    console.warn('Google Script URL not configured — order was not logged to the sheet.');
    return;
  }

  // 'no-cors' mode eken response eka read karanna behe, eth request eka yanawa.
  // Ithin order eka save wenna wenna, checkout flow eka fail wenne na.
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ type: 'order', ...order })
  }).catch((err) => console.error('Could not log order to sheet:', err));
}

/* ---- Form submission ---- */
checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (currentCart.length === 0) return;

  const requiredFields = checkoutForm.querySelectorAll('[required]');
  let hasError = false;
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add('field-error');
      hasError = true;
    } else {
      field.classList.remove('field-error');
    }
  });

  if (hasError) {
    checkoutForm.querySelector('.field-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const formData = new FormData(checkoutForm);
  const order = {
    orderId: `DF-${Date.now().toString().slice(-8)}`,
    date: new Date().toISOString(),
    customer: {
      fullName: formData.get('fullName').trim(),
      phone: formData.get('phone').trim(),
      email: formData.get('email').trim(),
      address: formData.get('address').trim(),
      city: formData.get('city').trim(),
      deliveryDate: formData.get('deliveryDate'),
      notes: formData.get('notes').trim()
    },
    paymentMethod: formData.get('paymentMethod'),
    transactionRef: formData.get('transactionRef') || '',
    items: currentCart,
    subtotal: currentSubtotal,
    delivery: currentDelivery,
    total: currentTotal
  };

  // 1. Automatic record — Google Sheet ekata save wenawa (customer kisima click ekak one na)
  logOrderToSheet(order);

  // 2. WhatsApp link eka generate karala order object eka ekka save karanawa,
  //    confirmation page eke "Send via WhatsApp" button eka methanin use karanawa
  order.whatsappLink = buildWhatsAppLink(order);

  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  localStorage.removeItem(CART_KEY);

  window.location.href = 'order-confirmation.html';
});

renderSummary();

window.addEventListener('storage', (event) => {
  if (event.key === CART_KEY) renderSummary();
});