
/* =========================================================
   DEAR FLORA - DYNAMIC SHOP
   Products are loaded from Google Sheets through Apps Script
   ========================================================= */

const API_URL = 'https://script.google.com/macros/s/AKfycbyBDnh1AgvHf72xyfLui44k0ZNkQLTxk8EvvqIhlZVqjIQJOuaPvssY1FZXQWjK_sqR6Q/exec';

const productGrid = document.querySelector('.shop-product-grid');
const searchInput = document.querySelector('#searchInput');
const productCount = document.querySelector('.product-count');
const categoryButtons = document.querySelectorAll('.category-filter button');

let products = [];
let selectedCategory = 'all';
let searchTerm = '';

/* ---------- Load products using JSONP ---------- */

function loadProducts() {
  productGrid.innerHTML = '<p class="shop-message">Loading bouquets...</p>';

  const callbackName = 'dearFloraProductsCallback';

  window[callbackName] = function (data) {
    delete window[callbackName];

    products = Array.isArray(data) ? data : [];
    renderProducts();
  };

  const script = document.createElement('script');

  script.src = `${API_URL}?action=getProducts&callback=${callbackName}`;

  script.onerror = function () {
    productGrid.innerHTML =
      '<p class="shop-message">Unable to load bouquets. Please try again later.</p>';

    productCount.textContent = 'Unable to load products';
    delete window[callbackName];
    script.remove();
  };

  document.body.appendChild(script);
}

/* ---------- Create product card ---------- */

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = product.badge || '';
  badge.hidden = !product.badge;

  const image = document.createElement('img');
  image.src = product.image_url || `image/${product.product_id}.jpeg`;
  image.alt = `${product.name} bouquet`;
  image.loading = 'lazy';

  image.onerror = function () {
    this.style.display = 'none';
  };

  const name = document.createElement('h3');
  name.textContent = product.name;

  const price = document.createElement('h4');
  price.textContent = `Rs. ${Number(product.price).toLocaleString('en-US')}`;

  const description = document.createElement('p');
  description.textContent = product.description || '';

  const link = document.createElement('a');
  link.href = `product.html?id=${encodeURIComponent(product.product_id)}`;
  link.className = 'card-btn';
  link.textContent = 'View Bouquet';

  card.append(badge, image, name, price, description, link);

  return card;
}

/* ---------- Category matching ---------- */

function normalizeCategory(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function matchesCategory(product, category) {
  if (category === 'all') return true;

  const selected = normalizeCategory(category);

  const productCategory = normalizeCategory(product.category);

  const occasions = String(product.occasions || '')
    .split(',')
    .map(normalizeCategory);

  return productCategory === selected || occasions.includes(selected);
}

/* ---------- Filter and search ---------- */

function getFilteredProducts() {
  return products.filter(product => {
    const matchesSelectedCategory =
      matchesCategory(product, selectedCategory);

    const searchText = [
      product.name,
      product.description,
      product.category,
      product.occasions,
      product.meaning
    ].join(' ').toLowerCase();

    const matchesSearch = searchText.includes(searchTerm);

    return matchesSelectedCategory && matchesSearch;
  });
}

/* ---------- Render products ---------- */

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  productGrid.replaceChildren();

  if (filteredProducts.length === 0) {
    productGrid.innerHTML =
      '<p class="shop-message">No bouquets found. Try another search.</p>';
  } else {
    filteredProducts.forEach(product => {
      productGrid.appendChild(createProductCard(product));
    });
  }

  productCount.textContent =
    `${filteredProducts.length} handcrafted bouquet${filteredProducts.length !== 1 ? 's' : ''} to discover`;
}

/* ---------- Search event ---------- */

if (searchInput) {
  searchInput.addEventListener('input', function () {
    searchTerm = this.value.trim().toLowerCase();
    renderProducts();
  });
}

/* ---------- Category filter event ---------- */

categoryButtons.forEach(button => {
  button.addEventListener('click', function () {
    categoryButtons.forEach(btn => btn.classList.remove('active'));

    this.classList.add('active');

    selectedCategory = this.dataset.category || 'all';

    renderProducts();
  });
});

/* ---------- Start ---------- */

loadProducts();
