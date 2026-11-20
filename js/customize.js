const form = document.querySelector('#customizeForm');
const priceElement = document.querySelector('#estimatedPrice');
const message = document.querySelector('#specialMessage');
const characterCount = document.querySelector('.character-count');
const summaryImage = document.querySelector('.summary-image');
const summaryTitle = document.querySelector('.summary-title');

const bouquetData = {
    B1: { name: "Emerald Whisper", image: "image/B1.jpeg" },
    B2: { name: "Pink Lily Grace", image: "image/B2.jpeg" },
    B3: { name: "Butterfly Wishes", image: "image/B3.jpeg" },
    B4: { name: "Crimson Melody", image: "image/B4.jpeg" },
    B5: { name: "Royal Sapphire Bloom", image: "image/B5.jpeg" },
    B6: { name: "Crimson Royale", image: "image/B6.jpeg" },
    B7: { name: "Golden Promise", image: "image/B7.jpeg" },
    B8: { name: "Blush Garden", image: "image/B8.jpeg" },
    B9: { name: "Midnight Charm", image: "image/B9.jpeg" },
    B10: { name: "Mother's Embrace", image: "image/B10.jpeg" },
    B11: { name: "Velvet Petals", image: "image/B11.jpeg" },
    B12: { name: "Pearl Petal", image: "image/B12.jpeg" },
    B13: { name: "Forever Yours", image: "image/B13.jpeg" },
    B14: { name: "Dream Chaser", image: "image/B14.jpeg" },
    B15: { name: "Sweet Celebration", image: "image/B15.jpeg" },
    B16: { name: "Graceful Bloom", image: "image/B16.jpeg" },
    B17: { name: "Golden Bloom", image: "image/B17.jpeg" },
    B18: { name: "Ever After", image: "image/B18.jpeg" },
    B19: { name: "Love Letter", image: "image/B19.jpeg" }
};

const bouquetId = new URLSearchParams(window.location.search).get("id");
const activeBouquetId = bouquetData[bouquetId] ? bouquetId : 'B1';
const activeBouquet = bouquetData[activeBouquetId];

summaryImage.src = activeBouquet.image;
summaryTitle.textContent = activeBouquet.name;

function selectedOption(name) {
  return form.querySelector(`input[name="${name}"]:checked`);
}

let currentTotal = 0;

function updateCustomBouquet() {
  let total = 0;
  ['size', 'flower', 'wrapper', 'ribbon', 'butterfly', 'card'].forEach((name) => {
    const option = selectedOption(name);
    total += Number(option.dataset.price);
    const summaryName = name === 'butterfly' || name === 'card' ? 'extras' : name;
    if (summaryName !== 'extras') document.querySelector(`[data-summary="${summaryName}"]`).textContent = option.value;
  });

  document.querySelector('[data-summary="extras"]').textContent = `${selectedOption('butterfly').value}, ${selectedOption('card').value}`;
  currentTotal = total;
  priceElement.textContent = `Rs. ${total.toLocaleString('en-LK')}`;

  form.querySelectorAll('.choice-card').forEach((card) => {
    card.classList.toggle('selected', card.querySelector('input').checked);
  });
}

form.addEventListener('change', updateCustomBouquet);
message.addEventListener('input', () => { characterCount.textContent = `${message.value.length} / 180`; });

/* ============================================================
   CART INTEGRATION
   Shared localStorage key with cart.html / cart.js: "dearFloraCart"
   Custom bouquets get a unique id per configuration so different
   customisations don't merge into the same cart line.
   ============================================================ */

const CART_KEY = 'dearFloraCart';

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

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const size = selectedOption('size').value;
  const flower = selectedOption('flower').value;
  const wrapper = selectedOption('wrapper').value;
  const ribbon = selectedOption('ribbon').value;
  const butterfly = selectedOption('butterfly').value;
  const card = selectedOption('card').value;
  const variantText = `${size}, ${flower}, ${wrapper}, ${ribbon}, ${butterfly}, ${card}`;

  const cart = getCart();
  cart.push({
    id: `custom-${activeBouquetId}-${Date.now()}`,
    name: `Custom ${activeBouquet.name}`,
    image: activeBouquet.image,
    price: currentTotal,
    variant: variantText,
    quantity: 1,
    note: message.value.trim()
  });
  saveCart(cart);

  const addBtn = form.querySelector('.create-bouquet-btn');
  const originalText = addBtn.textContent;
  addBtn.textContent = 'Added to Cart ✓';
  addBtn.disabled = true;
  setTimeout(() => {
    window.location.href = 'cart.html';
  }, 700);
});

updateCustomBouquet();
