const products = {
  B1: [
  'Emerald Whisper',
  'Rs. 1,500',
  'NEW',
  'An elegant blend of emerald blooms, delicate pearls and golden butterflies, thoughtfully arranged to celebrate hope, love and treasured memories.',
  'Emerald tones express renewal and hope, while the pearl and butterfly details add a graceful finishing touch.',
  ['Birthday', 'Anniversary', 'Just Because']
],
  B2: ['Pink Lily Grace', 'Rs. 1,200', '', 'A sweet handmade bouquet inspired by the gentle charm of pink lilies, created to share warmth and heartfelt affection.', 'Pink lilies represent admiration, tenderness and the warmth of a thoughtful gesture.', ['Love', 'Birthday', 'Just Because']],
  B3: ['Butterfly Wishes', 'Rs. 1,500', '', 'Soft blossoms and elegant butterflies create a magical bouquet filled with happiness and beautiful memories.', 'Butterflies symbolise joyful new beginnings and wishes taking flight.', ['Birthday', 'Graduation', 'Just Because']],
  B4: ['Crimson Melody', 'Rs. 1,500', '', 'Rich crimson blooms beautifully arranged to express timeless love, devotion and heartfelt emotions.', 'Crimson flowers are a classic symbol of deep affection and lasting devotion.', ['Love', 'Anniversary', 'Special Occasion']],
  B5: ['Royal Sapphire Bloom', 'Rs. 1,500', '', 'Stunning sapphire blue roses with a golden butterfly, representing loyalty, elegance and meaningful moments.', 'Blue tones represent loyalty, trust and a calm, elegant connection.', ['Anniversary', 'Birthday', 'Congratulations']],
  B6: ['Crimson Royale', 'Rs. 1,800', '', 'Luxurious crimson blossoms with refined black accents, capturing elegance, passion and everlasting affection.', 'This deep, dramatic palette celebrates confident love and a special bond.', ['Love', 'Anniversary', 'Special Occasion']],
  B7: ['Golden Promise', 'Rs. 1,600', 'POPULAR', 'A joyful handmade bouquet designed to celebrate a proud new beginning.', 'Golden details represent success, optimism and the promise of what comes next.', ['Graduation', 'Congratulations', 'Birthday']],
  B8: ['Blush Garden', 'Rs. 1,400', '', 'A delicate floral gift for birthdays and heartfelt surprises.', 'Soft blush tones convey kindness, grace and a sweet personal message.', ['Birthday', 'Mother\u2019s Day', 'Just Because']],
  B9: ['Midnight Charm', 'Rs. 1,700', '', 'A polished bouquet with a bold, memorable presence and elegant finishing touches.', 'Its rich palette creates a sense of mystery, confidence and celebration.', ['Anniversary', 'Love', 'Special Occasion']],
  B10: ['Mother\u2019s Embrace', 'Rs. 1,600', '', 'A gentle expression of gratitude, warmth and love for someone truly special.', 'Thoughtful floral details reflect care, appreciation and a comforting embrace.', ['Mother\u2019s Day', 'Birthday', 'Thank You']],
  B11: ['Velvet Petals', 'Rs. 1,450', '', 'Soft petals and charming details make this a beautifully personal gift.', 'Velvet-like florals communicate warmth, romance and a touch of luxury.', ['Birthday', 'Love', 'Just Because']],
  B12: ['Pearl Petal', 'Rs. 1,650', '', 'A refined floral design finished with elegant, pearlescent touches.', 'Pearls symbolise precious memories, elegance and enduring beauty.', ['Custom', 'Anniversary', 'Birthday']],
  B13: ['Forever Yours', 'Rs. 1,700', '', 'A romantic arrangement created for love-filled occasions and sincere messages.', 'This bouquet is made to celebrate a promise, a memory or an enduring bond.', ['Love', 'Anniversary', 'Valentine\u2019s Day']],
  B14: ['Dream Chaser', 'Rs. 1,550', '', 'A bright, thoughtful gift for a milestone worth remembering.', 'It is a celebration of dreams, hard work and fresh beginnings.', ['Graduation', 'Congratulations', 'New Job']],
  B15: ['Sweet Celebration', 'Rs. 1,500', '', 'A cheerful bouquet made for smiles, wishes and joyful celebrations.', 'Playful details make this a lovely way to share happiness and good wishes.', ['Birthday', 'Congratulations', 'Just Because']],
  B16: ['Graceful Bloom', 'Rs. 1,650', '', 'Delicate textures and blooms come together in a warm, graceful composition.', 'Graceful blooms express appreciation, gentleness and heartfelt respect.', ['Mother\u2019s Day', 'Birthday', 'Thank You']],
  B17: ['Golden Bloom', 'Rs. 1,750', '', 'A premium bouquet with beautiful hand-finished details for a memorable gift.', 'Golden accents bring a luxurious, uplifting feeling to the occasion.', ['Custom', 'Anniversary', 'Celebration']],
  B18: ['Ever After', 'Rs. 1,800', '', 'A luxurious keepsake bouquet for a cherished celebration and lasting memory.', 'The arrangement honours a story worth remembering and a love worth celebrating.', ['Anniversary', 'Love', 'Wedding']],
  B19: ['Love Letter', 'Rs. 1,900', 'LIMITED', 'A romantic finishing touch for your most special message.', 'This design turns a heartfelt message into a keepsake filled with romance.', ['Love', 'Anniversary', 'Valentine\u2019s Day']]
};

const requestedId = new URLSearchParams(window.location.search).get('id');
const productId = products[requestedId] ? requestedId : 'B1';
const [name, price, badgeText, description, meaning, occasions] = products[productId];

document.title = `${name} | Dear Flora`;
document.querySelector('.product-name').textContent = name;
document.querySelector('.breadcrumb-product').textContent = name;
document.querySelector('.product-price').textContent = price;
document.querySelector('.product-description').textContent = description;
document.querySelector('.product-main-image').src = `image/${productId}.jpeg`;
document.querySelector('.product-main-image').alt = `${name} handmade bouquet`;
document.querySelector('.product-meaning-card p').textContent = meaning;

/* ---- SEO: update meta description + Open Graph tags per bouquet ---- */
function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

setMeta('meta[name="description"]', 'content', description);
setMeta('meta[property="og:title"]', 'content', `${name} | Dear Flora`);
setMeta('meta[property="og:description"]', 'content', description);
setMeta('meta[property="og:image"]', 'content', `image/${productId}.jpeg`);

const badge = document.querySelector('.product-badge');
badge.textContent = badgeText;
badge.hidden = !badgeText;

const occasionTags = document.querySelector('.product-occasions');
occasionTags.replaceChildren(...occasions.map((occasion) => {
  const tag = document.createElement('span');
  tag.textContent = occasion;
  return tag;
}));

/* ------------------------------------------------------------
   "Customise this bouquet" link — made robust on purpose.
   Some product pages have the class typed slightly differently
   (customize-Link, customize-btn, missing class, etc), so instead
   of relying only on ".customize-link", we ALSO fall back to any
   <a> tag whose href starts with "customize.html" (or is a plain
   "#" placeholder). This way the link works correctly on every
   product page regardless of small class-name typos in that
   page's HTML.
   ------------------------------------------------------------ */
const customizeLink =
  document.querySelector('.customize-link') ||
  document.querySelector('a[href^="customize.html"]') ||
  document.querySelector('a[href="#"]');

if (customizeLink) {
  customizeLink.href = `customize.html?id=${productId}`;
} else {
  console.warn('Customise link not found on this page — check the "Customise this bouquet" <a> tag.');
}

/* ============================================================
   CART INTEGRATION
   Shared localStorage key with cart.html / cart.js: "dearFloraCart"
   Each cart item: { id, name, image, price, variant, quantity }
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

function parsePrice(priceText) {
  // "Rs. 1,500" -> 1500
  return Number(priceText.replace(/[^0-9]/g, ''));
}

function addToCart(id, qty) {
  const cart = getCart();
  const priceNumber = parsePrice(price);
  const existing = cart.find((item) => item.id === id && !item.variant);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id,
      name,
      image: `image/${id}.jpeg`,
      price: priceNumber,
      variant: '',
      quantity: qty
    });
  }

  saveCart(cart);
}

/* ---- Quantity selector on product page ---- */
const quantityControl = document.querySelector('.quantity-control');
const decreaseBtn = document.querySelector('[aria-label="Decrease quantity"]');
const increaseBtn = document.querySelector('[aria-label="Increase quantity"]');
const quantityDisplay = quantityControl ? quantityControl.querySelector('span') : null;

let currentQuantity = 1;

function renderQuantity() {
  if (quantityDisplay) quantityDisplay.textContent = currentQuantity;
}

if (decreaseBtn) {
  decreaseBtn.addEventListener('click', () => {
    if (currentQuantity > 1) currentQuantity -= 1;
    renderQuantity();
  });
}

if (increaseBtn) {
  increaseBtn.addEventListener('click', () => {
    currentQuantity += 1;
    renderQuantity();
  });
}

/* ---- Add to Cart / Buy Now buttons ---- */
const addCartBtn = document.querySelector('.add-cart-btn');
const buyNowBtn = document.querySelector('.buy-now-btn');

if (addCartBtn) {
  addCartBtn.addEventListener('click', () => {
    addToCart(productId, currentQuantity);
    addCartBtn.textContent = 'Added ✓';
    setTimeout(() => { addCartBtn.textContent = 'Add to Cart'; }, 1500);
  });
}

if (buyNowBtn) {
  buyNowBtn.addEventListener('click', () => {
    addToCart(productId, currentQuantity);
    window.location.href = 'cart.html';
  });
}