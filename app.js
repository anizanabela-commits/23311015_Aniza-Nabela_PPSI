/**
 * Pasar Tani OKU Timur - Frontend Controller (app.js)
 * Mengelola state multi-peran (Pembeli, Penjual, Admin Dinas),
 * Katalog produk, Keranjang, Checkout, Inventaris, dan Verifikasi.
 */

// Global State
const state = {
  currentRole: 'pembeli', // 'pembeli' | 'penjual' | 'admin'
  currentCategory: 'Semua',
  searchQuery: '',
  products: [],
  categories: [],
  cart: JSON.parse(localStorage.getItem('pasartani_cart') || '[]'),
  orders: [],
  stores: [],
  analytics: null,
  activeSellerStoreId: 'STR-001' // Default: Tani Makmur Belitang (Pak Wayan)
};

// Format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Toast Notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Inisialisasi Aplikasi Saat Halaman Selesai Dimuat
document.addEventListener('DOMContentLoaded', () => {
  initPWA();
  initEvents();
  loadAllData();
});

// Registrasi Service Worker PWA
function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker terdaftar:', reg.scope))
      .catch(err => console.log('SW registration gagal:', err));
  }

  window.addEventListener('online', () => {
    document.getElementById('offline-banner').style.display = 'none';
    showToast('Koneksi internet terhubung kembali.', 'success');
  });

  window.addEventListener('offline', () => {
    document.getElementById('offline-banner').style.display = 'block';
    showToast('Mode offline aktif. Anda mengakses data cache.', 'warning');
  });
}

// Inisialisasi Event Listener
function initEvents() {
  // Role Switcher Buttons
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const role = e.currentTarget.dataset.role;
      switchRole(role);
    });
  });

  // Mobile Bottom Navigation
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      switchTab(tab);
    });
  });

  // Live Search Input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Cart Button Click
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', openCartModal);
  }

  // Form Checkout Submit
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }

  // Form Tambah / Edit Produk Penjual
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', handleSaveProduct);
  }
}

// Muat Seluruh Data dari Backend REST API
async function loadAllData() {
  try {
    await Promise.all([
      loadCategories(),
      loadProducts(),
      loadOrders(),
      loadStores(),
      loadAdminAnalytics()
    ]);
    updateCartBadge();
  } catch (err) {
    console.error('Error loadAllData:', err);
  }
}

// 1. Kategori
async function loadCategories() {
  try {
    const res = await fetch('/api/categories');
    state.categories = await res.json();
    renderCategories();
  } catch (err) {
    console.error('Gagal memuat kategori:', err);
  }
}

function renderCategories() {
  const container = document.getElementById('category-bar');
  if (!container) return;

  let html = `
    <button class="category-chip ${state.currentCategory === 'Semua' ? 'active' : ''}" onclick="selectCategory('Semua')">
      <span>🌾</span> Semua Komoditas
    </button>
  `;

  state.categories.forEach(cat => {
    const isActive = state.currentCategory === cat.name;
    html += `
      <button class="category-chip ${isActive ? 'active' : ''}" onclick="selectCategory('${cat.name}')">
        <span>${cat.icon}</span> ${cat.name}
      </button>
    `;
  });

  container.innerHTML = html;

  // Isi juga pilihan select kategori di form produk
  const prodCategorySelect = document.getElementById('prod-category');
  if (prodCategorySelect && prodCategorySelect.options.length <= 1) {
    state.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.name;
      opt.textContent = `${cat.icon} ${cat.name}`;
      prodCategorySelect.appendChild(opt);
    });
  }
}

window.selectCategory = function (catName) {
  state.currentCategory = catName;
  renderCategories();
  renderProducts();
};

// 2. Produk
async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    state.products = await res.json();
    renderProducts();
    renderSellerProducts();
  } catch (err) {
    console.error('Gagal memuat produk:', err);
  }
}

function renderProducts() {
  const container = document.getElementById('product-grid');
  if (!container) return;

  let filtered = [...state.products];

  if (state.currentCategory !== 'Semua') {
    filtered = filtered.filter(p => p.category.toLowerCase() === state.currentCategory.toLowerCase());
  }

  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.storeName.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 32px; margin-bottom: 8px;">🔍</p>
        <p style="font-weight: 600;">Komoditas tidak ditemukan</p>
        <p style="font-size: 13px;">Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isLowStock = p.stock <= p.stockMin;
    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-img-wrapper">
          <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'" />
          ${isLowStock ? `<span class="badge-stock low">⚠️ Sisa ${p.stock} ${p.unit}</span>` : ''}
          <span class="badge-district">📍 ${p.district}</span>
        </div>
        <div class="product-body">
          <div class="product-store">🏪 ${p.storeName}</div>
          <h3 class="product-name" title="${p.name}">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-footer">
            <div class="product-price-wrap">
              <span class="product-price">${formatRupiah(p.price)}</span>
              <span class="product-unit">per ${p.unit} (Stok: ${p.stock})</span>
            </div>
            <button class="btn-add-cart" onclick="addToCart('${p.id}')">
              <span>+</span> Beli
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Keranjang & Pemesanan
window.addToCart = function (productId) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast(`Maaf, stok ${product.name} sedang habis!`, 'warning');
    return;
  }

  const existing = state.cart.find(item => item.productId === productId);
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty += 1;
      showToast(`Jumlah ${product.name} ditambah di keranjang.`, 'success');
    } else {
      showToast(`Maksimal stok tercapai (${product.stock} ${product.unit}).`, 'warning');
      return;
    }
  } else {
    state.cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      storeId: product.storeId,
      storeName: product.storeName,
      qty: 1
    });
    showToast(`${product.name} dimasukkan ke keranjang.`, 'success');
  }

  saveCart();
  updateCartBadge();
};

function saveCart() {
  localStorage.setItem('pasartani_cart', JSON.stringify(state.cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function openCartModal() {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;
  renderCartItems();
  modal.classList.add('open');
}

window.closeCartModal = function () {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.classList.remove('open');
};

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const totalAmountEl = document.getElementById('cart-total-amount');
  const btnCheckout = document.getElementById('btn-to-checkout');

  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: var(--text-muted);">
        <p style="font-size: 36px; margin-bottom: 6px;">🛒</p>
        <p style="font-weight: 600;">Keranjang Belanja Kosong</p>
        <p style="font-size: 12px;">Pilih hasil panen atau produk UMKM untuk dipesan.</p>
      </div>
    `;
    if (totalAmountEl) totalAmountEl.textContent = formatRupiah(0);
    if (btnCheckout) btnCheckout.disabled = true;
    return;
  }

  let total = 0;
  container.innerHTML = state.cart.map(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)} / ${item.unit}</div>
          <div style="font-size: 11px; color: var(--primary);">🏪 ${item.storeName}</div>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateItemQty('${item.productId}', -1)">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateItemQty('${item.productId}', 1)">+</button>
        </div>
        <div style="font-weight: 700; font-size: 13px; min-width: 75px; text-align: right;">
          ${formatRupiah(subtotal)}
        </div>
      </div>
    `;
  }).join('');

  if (totalAmountEl) totalAmountEl.textContent = formatRupiah(total);
  if (btnCheckout) btnCheckout.disabled = false;
}

window.updateItemQty = function (productId, delta) {
  const item = state.cart.find(i => i.productId === productId);
  if (!item) return;

  const product = state.products.find(p => p.id === productId);

  if (delta > 0) {
    if (product && item.qty >= product.stock) {
      showToast(`Stok maksimal yang tersedia hanya ${product.stock} ${product.unit}`, 'warning');
      return;
    }
    item.qty += 1;
  } else {
    item.qty -= 1;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.productId !== productId);
    }
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
};

window.openCheckoutStep = function () {
  if (state.cart.length === 0) return;
  closeCartModal();
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('open');
};

window.closeCheckoutModal = function () {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('open');
};

async function handleCheckout(e) {
  e.preventDefault();

  const buyerName = document.getElementById('buyer-name').value;
  const buyerPhone = document.getElementById('buyer-phone').value;
  const district = document.getElementById('buyer-district').value;
  const buyerAddress = document.getElementById('buyer-address').value;
  const paymentMethod = document.getElementById('payment-method').value;
  const notes = document.getElementById('order-notes').value;

  const orderPayload = {
    buyerName,
    buyerPhone,
    buyerAddress,
    district,
    paymentMethod,
    notes,
    items: state.cart.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty,
      unit: item.unit,
      storeId: item.storeId,
      subtotal: item.price * item.qty
    }))
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memproses pesanan');

    // Kosongkan keranjang
    state.cart = [];
    saveCart();
    updateCartBadge();
    closeCheckoutModal();

    showToast(`Pesanan #${data.order.id} berhasil dikirim ke penjual!`, 'success');

    // Reload data pesanan & produk terbaru
    await loadProducts();
    await loadOrders();
    await loadAdminAnalytics();

    // Buka tab pesanan
    switchTab('orders');
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

// 4. Riwayat Pesanan Pembeli & Toko
async function loadOrders() {
  try {
    const res = await fetch('/api/orders');
    state.orders = await res.json();
    renderBuyerOrders();
    renderSellerOrders();
    renderAdminOrders();
  } catch (err) {
    console.error('Gagal memuat pesanan:', err);
  }
}

function renderBuyerOrders() {
  const container = document.getElementById('buyer-orders-list');
  if (!container) return;

  if (state.orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; background: #fff; border-radius: var(--radius-md); border: 1px solid var(--border);">
        <p style="font-size: 32px; margin-bottom: 6px;">📦</p>
        <p style="font-weight: 600;">Belum Ada Riwayat Pesanan</p>
        <p style="font-size: 13px; color: var(--text-muted);">Pesan hasil tani lokal sekarang dan pantau proses pengirimannya di sini.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.orders.map(order => {
    const statusLabel = {
      'menunggu_konfirmasi': 'Menunggu Konfirmasi Penjual',
      'diproses': 'Sedang Dikemas / Diproses',
      'dikirim': 'Dalam Pengiriman',
      'selesai': 'Pesanan Selesai',
      'dibatalkan': 'Dibatalkan'
    }[order.status] || order.status;

    const itemsSummary = order.items.map(it => `${it.name} (${it.qty} ${it.unit})`).join(', ');

    return `
      <div style="background: #fff; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 14px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; margin-bottom: 10px;">
          <div>
            <span style="font-weight: 700; font-size: 14px;">${order.id}</span>
            <span style="font-size: 11px; color: var(--text-muted); margin-left: 8px;">${new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <span class="status-badge ${order.status}">${statusLabel}</span>
        </div>
        <div style="font-size: 13px; margin-bottom: 6px;">
          <strong>Komoditas:</strong> ${itemsSummary}
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
          📍 Pengiriman ke: ${order.buyerAddress} (${order.district}) • Pembayaran: ${order.paymentMethod}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px dashed var(--border-light);">
          <span style="font-size: 12px; color: var(--text-muted);">Total Pembayaran:</span>
          <span style="font-size: 16px; font-weight: 800; color: var(--primary-dark);">${formatRupiah(order.totalAmount)}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 5. Dashboard Penjual (Petani / UMKM OKU Timur)
function renderSellerProducts() {
  const container = document.getElementById('seller-products-table-body');
  const alertContainer = document.getElementById('seller-stock-alerts');
  if (!container) return;

  const sellerProducts = state.products.filter(p => p.storeId === state.activeSellerStoreId);
  const lowStock = sellerProducts.filter(p => p.stock <= p.stockMin);

  // Render Low Stock Alert
  if (alertContainer) {
    if (lowStock.length > 0) {
      alertContainer.innerHTML = `
        <div style="background: var(--warning-light); border: 1px solid #FCD34D; border-radius: var(--radius-sm); padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">⚠️</span>
          <div>
            <strong style="color: #92400E; font-size: 13px;">Peringatan Stok Menipis!</strong>
            <p style="font-size: 12px; color: #78350F; margin: 0;">Ada ${lowStock.length} produk Anda yang mendekati batas stok minimum (${lowStock.map(l => l.name).join(', ')}). Segera perbarui stok panen.</p>
          </div>
        </div>
      `;
    } else {
      alertContainer.innerHTML = '';
    }
  }

  // Update Statistik Penjual
  const sellerOrders = state.orders.filter(o => o.items.some(i => i.storeId === state.activeSellerStoreId));
  const sellerTurnover = sellerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const statSales = document.getElementById('seller-stat-sales');
  const statOrders = document.getElementById('seller-stat-orders');
  const statProducts = document.getElementById('seller-stat-products');

  if (statSales) statSales.textContent = formatRupiah(sellerTurnover);
  if (statOrders) statOrders.textContent = sellerOrders.length;
  if (statProducts) statProducts.textContent = sellerProducts.length;

  if (sellerProducts.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Belum ada produk di etalase Anda.</td></tr>`;
    return;
  }

  container.innerHTML = sellerProducts.map(p => {
    const isLow = p.stock <= p.stockMin;
    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${p.image}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'">
            <div>
              <strong>${p.name}</strong><br>
              <span style="font-size: 11px; color: var(--text-muted);">${p.category}</span>
            </div>
          </div>
        </td>
        <td><strong>${formatRupiah(p.price)}</strong></td>
        <td>per ${p.unit}</td>
        <td>
          <span style="font-weight: 700; color: ${isLow ? 'var(--danger)' : 'var(--text-main)'};">
            ${p.stock}
          </span>
          ${isLow ? '<span style="font-size: 10px; background: #FEE2E2; color: #DC2626; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">Menipis</span>' : ''}
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary btn-sm" onclick="openEditProduct('${p.id}')">✏️ Edit Stok</button>
            <button class="btn btn-secondary btn-sm" style="color: var(--danger);" onclick="deleteProduct('${p.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSellerOrders() {
  const container = document.getElementById('seller-orders-table-body');
  if (!container) return;

  const sellerOrders = state.orders.filter(o => o.items.some(i => i.storeId === state.activeSellerStoreId));

  if (sellerOrders.length === 0) {
    container.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Belum ada pesanan masuk untuk toko ini.</td></tr>`;
    return;
  }

  container.innerHTML = sellerOrders.map(order => {
    const itemsText = order.items.filter(i => i.storeId === state.activeSellerStoreId)
      .map(i => `${i.name} (x${i.qty})`).join(', ');

    return `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>
          <strong>${order.buyerName}</strong><br>
          <span style="font-size: 11px; color: var(--text-muted);">📱 ${order.buyerPhone} • 📍 ${order.district}</span>
        </td>
        <td>${itemsText}</td>
        <td><strong>${formatRupiah(order.totalAmount)}</strong></td>
        <td><span class="status-badge ${order.status}">${order.status}</span></td>
        <td>
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">
            ${order.status === 'menunggu_konfirmasi' ? `
              <button class="btn btn-primary btn-sm" onclick="updateOrderStatus('${order.id}', 'diproses')">Konfirmasi & Proses</button>
            ` : ''}
            ${order.status === 'diproses' ? `
              <button class="btn btn-accent btn-sm" onclick="updateOrderStatus('${order.id}', 'dikirim')">Kirim Barang</button>
            ` : ''}
            ${order.status === 'dikirim' ? `
              <button class="btn btn-primary btn-sm" onclick="updateOrderStatus('${order.id}', 'selesai')">Tandai Selesai</button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.openAddProductModal = function () {
  document.getElementById('modal-product-title').textContent = 'Tambah Komoditas Tani / UMKM';
  document.getElementById('product-form').reset();
  document.getElementById('prod-id').value = '';
  document.getElementById('product-modal').classList.add('open');
};

window.closeProductModal = function () {
  document.getElementById('product-modal').classList.remove('open');
};

window.openEditProduct = function (productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  document.getElementById('modal-product-title').textContent = 'Edit Komoditas & Stok';
  document.getElementById('prod-id').value = prod.id;
  document.getElementById('prod-name').value = prod.name;
  document.getElementById('prod-category').value = prod.category;
  document.getElementById('prod-price').value = prod.price;
  document.getElementById('prod-unit').value = prod.unit;
  document.getElementById('prod-stock').value = prod.stock;
  document.getElementById('prod-stock-min').value = prod.stockMin;
  document.getElementById('prod-image').value = prod.image;
  document.getElementById('prod-desc').value = prod.description;

  document.getElementById('product-modal').classList.add('open');
};

async function handleSaveProduct(e) {
  e.preventDefault();
  const prodId = document.getElementById('prod-id').value;
  const name = document.getElementById('prod-name').value;
  const category = document.getElementById('prod-category').value;
  const price = document.getElementById('prod-price').value;
  const unit = document.getElementById('prod-unit').value;
  const stock = document.getElementById('prod-stock').value;
  const stockMin = document.getElementById('prod-stock-min').value;
  const image = document.getElementById('prod-image').value;
  const description = document.getElementById('prod-desc').value;

  const payload = {
    name, category, price, unit, stock, stockMin, image, description,
    storeId: state.activeSellerStoreId,
    storeName: 'Tani Makmur Belitang',
    district: 'Belitang Madang Raya'
  };

  try {
    let res;
    if (prodId) {
      // Edit
      res = await fetch(`/api/products/${prodId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      // Tambah Baru
      res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menyimpan produk');

    closeProductModal();
    showToast(data.message, 'success');
    await loadProducts();
    await loadAdminAnalytics();
  } catch (err) {
    showToast(err.message, 'danger');
  }
}

window.deleteProduct = async function (productId) {
  if (!confirm('Apakah Anda yakin ingin menghapus produk ini dari etalase?')) return;

  try {
    const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menghapus');
    showToast('Produk berhasil dihapus.', 'info');
    await loadProducts();
    await loadAdminAnalytics();
  } catch (err) {
    showToast(err.message, 'danger');
  }
};

window.updateOrderStatus = async function (orderId, newStatus) {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memperbarui status');
    showToast(data.message, 'success');
    await loadOrders();
    await loadAdminAnalytics();
  } catch (err) {
    showToast(err.message, 'danger');
  }
};

// 6. Dashboard Admin Dinas Pertanian & UMKM OKU Timur
async function loadStores() {
  try {
    const res = await fetch('/api/stores');
    state.stores = await res.json();
    renderAdminStores();
  } catch (err) {
    console.error('Gagal memuat toko:', err);
  }
}

async function loadAdminAnalytics() {
  try {
    const res = await fetch('/api/admin/analytics');
    state.analytics = await res.json();
    renderAdminDashboard();
  } catch (err) {
    console.error('Gagal memuat analitik admin:', err);
  }
}

function renderAdminDashboard() {
  if (!state.analytics) return;
  const a = state.analytics;

  // Stat Cards
  const elUsers = document.getElementById('admin-stat-users');
  const elStores = document.getElementById('admin-stat-stores');
  const elTurnover = document.getElementById('admin-stat-turnover');
  const elPAD = document.getElementById('admin-stat-pad');

  if (elUsers) elUsers.textContent = a.users.total;
  if (elStores) elStores.textContent = `${a.stores.verified} Toko Aktif (${a.stores.pending} Antrean)`;
  if (elTurnover) elTurnover.textContent = formatRupiah(a.finance.totalTurnover);
  if (elPAD) elPAD.textContent = formatRupiah(a.finance.estimasiPotensiPAD);

  // Render Ringkasan Komoditas per Kecamatan di OKU Timur
  const districtContainer = document.getElementById('admin-district-summary');
  if (districtContainer && a.districtSummary) {
    districtContainer.innerHTML = a.districtSummary.map(d => `
      <div style="background: #F8FAFC; border: 1px solid var(--border); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="font-size: 13px;">📍 Kec. ${d.name}</strong>
          <div style="font-size: 11px; color: var(--text-muted);">${d.storeCount} Toko Tani / Kelompok Usaha</div>
        </div>
        <span style="background: var(--primary-light); color: var(--primary-dark); font-weight: 700; padding: 3px 10px; border-radius: var(--radius-full); font-size: 12px;">
          ${d.productCount} Komoditas
        </span>
      </div>
    `).join('');
  }
}

function renderAdminStores() {
  const container = document.getElementById('admin-verification-table-body');
  if (!container) return;

  const pendingStores = state.stores.filter(s => s.status === 'menunggu');

  if (pendingStores.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Tidak ada pengajuan verifikasi toko petani yang menunggu saat ini.</td></tr>`;
    return;
  }

  container.innerHTML = pendingStores.map(store => `
    <tr>
      <td>
        <strong>${store.name}</strong><br>
        <span style="font-size: 11px; color: var(--text-muted);">Pemilik: ${store.owner}</span>
      </td>
      <td>📍 ${store.address}, Kec. ${store.district}</td>
      <td>📱 ${store.phone}</td>
      <td><span class="status-badge menunggu">Menunggu Verifikasi</span></td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-primary btn-sm" onclick="verifyStore('${store.id}', 'terverifikasi')">✅ Setujui</button>
          <button class="btn btn-danger btn-sm" onclick="verifyStore('${store.id}', 'ditolak')">❌ Tolak</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderAdminOrders() {
  const container = document.getElementById('admin-orders-table-body');
  if (!container) return;

  container.innerHTML = state.orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${order.buyerName}</td>
      <td>📍 ${order.district}</td>
      <td><strong>${formatRupiah(order.totalAmount)}</strong></td>
      <td><span class="status-badge ${order.status}">${order.status}</span></td>
      <td>${order.paymentMethod}</td>
    </tr>
  `).join('');
}

window.verifyStore = async function (storeId, status) {
  try {
    const res = await fetch(`/api/stores/${storeId}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memverifikasi');
    showToast(data.message, 'success');
    await loadStores();
    await loadAdminAnalytics();
  } catch (err) {
    showToast(err.message, 'danger');
  }
};

window.printAdminReport = function () {
  window.print();
};

window.resetDemoData = async function () {
  if (!confirm('Apakah Anda ingin mereset seluruh data kembali ke setelan awal simulasi OKU Timur?')) return;
  try {
    const res = await fetch('/api/reset-data', { method: 'POST' });
    const data = await res.json();
    showToast(data.message, 'success');
    await loadAllData();
  } catch (err) {
    showToast('Gagal mereset data', 'danger');
  }
};

// 7. Navigasi Tab & Switch Role
function switchRole(role) {
  state.currentRole = role;

  // Update Buttons Active State
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.role === role);
  });

  // Tampilkan panel yang bersangkutan
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  if (role === 'pembeli') {
    document.getElementById('view-buyer').classList.add('active');
    document.getElementById('buyer-hero').style.display = 'block';
    document.getElementById('buyer-catalog').style.display = 'block';
    document.getElementById('buyer-orders-tab').style.display = 'none';
    updateBottomNavActive('home');
  } else if (role === 'penjual') {
    document.getElementById('view-seller').classList.add('active');
    renderSellerProducts();
    renderSellerOrders();
  } else if (role === 'admin') {
    document.getElementById('view-admin').classList.add('active');
    renderAdminStores();
    renderAdminDashboard();
    renderAdminOrders();
  }

  showToast(`Beralih ke peran: ${role.toUpperCase()}`, 'info');
}

function switchTab(tab) {
  if (state.currentRole !== 'pembeli') {
    switchRole('pembeli');
  }

  updateBottomNavActive(tab);

  const hero = document.getElementById('buyer-hero');
  const catalog = document.getElementById('buyer-catalog');
  const ordersTab = document.getElementById('buyer-orders-tab');

  if (tab === 'home' || tab === 'category') {
    if (hero) hero.style.display = 'block';
    if (catalog) catalog.style.display = 'block';
    if (ordersTab) ordersTab.style.display = 'none';
    if (tab === 'category') {
      document.getElementById('category-bar')?.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (tab === 'cart') {
    openCartModal();
  } else if (tab === 'orders') {
    if (hero) hero.style.display = 'none';
    if (catalog) catalog.style.display = 'none';
    if (ordersTab) ordersTab.style.display = 'block';
    renderBuyerOrders();
  } else if (tab === 'account') {
    showToast('Profil Pembeli Aktif: Siti Rahmawati (OKU Timur)', 'info');
  }
}

function updateBottomNavActive(tab) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tab);
  });
}

