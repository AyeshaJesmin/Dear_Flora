// Dear Flora — Order Confirmation Page Logic

const LAST_ORDER_KEY = 'dearFloraLastOrder';

const confirmationContent = document.querySelector('#confirmationContent');
const confirmationEmpty = document.querySelector('#confirmationEmpty');
const confirmationSubtitle = document.querySelector('#confirmationSubtitle');
const orderIdEl = document.querySelector('#orderId');
const deliveryDetails = document.querySelector('#deliveryDetails');
const paymentSummary = document.querySelector('#paymentSummary');
const bankDetailsConfirm = document.querySelector('#bankDetailsConfirm');
const checkoutItems = document.querySelector('#checkoutItems');
const subtotalAmount = document.querySelector('#subtotalAmount');
const deliveryAmount = document.querySelector('#deliveryAmount');
const totalAmount = document.querySelector('#totalAmount');
const whatsappBtn = document.querySelector('#whatsappConfirmBtn');

function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

function loadOrder() {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Could not read last order:', err);
    return null;
  }
}

const order = loadOrder();

if (!order) {
  confirmationContent.hidden = true;
  confirmationEmpty.hidden = false;
  confirmationSubtitle.textContent = '';
} else {
  orderIdEl.textContent = `Order ${order.orderId}`;
  confirmationSubtitle.textContent = `We've received your order and will be in touch at ${order.customer.phone}.`;

  const detailRows = [
    ['Name', order.customer.fullName],
    ['Phone', order.customer.phone],
    ['Address', `${order.customer.address}, ${order.customer.city}`],
  ];
  if (order.customer.email) detailRows.push(['Email', order.customer.email]);
  if (order.customer.deliveryDate) detailRows.push(['Preferred date', order.customer.deliveryDate]);
  if (order.customer.notes) detailRows.push(['Notes', order.customer.notes]);

  deliveryDetails.replaceChildren();
  detailRows.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    deliveryDetails.appendChild(dt);
    deliveryDetails.appendChild(dd);
  });

  paymentSummary.textContent = order.paymentMethod;
  if (order.paymentMethod === 'Bank Transfer') {
    bankDetailsConfirm.hidden = false;
  }

  checkoutItems.replaceChildren();
  order.items.forEach((item) => {
    const lineTotal = item.price * item.quantity;
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

  subtotalAmount.textContent = formatPrice(order.subtotal);
  deliveryAmount.textContent = formatPrice(order.delivery);
  totalAmount.textContent = formatPrice(order.total);

  // WhatsApp button — checkout.js eken hadapu pre-filled link eka use karanawa.
  // Order eka mekada Sheet ekata giya, methanata click karoth WhatsApp ekenuth
  // customer ge order eka ownage number ekata instant yanawa.
  if (whatsappBtn) {
    if (order.whatsappLink) {
      whatsappBtn.href = order.whatsappLink;
      whatsappBtn.hidden = false;
    } else {
      whatsappBtn.hidden = true;
    }
  }
}