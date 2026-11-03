const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// File Penyimpanan Data Sederhana
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

// Initial Seed Data yang Otentik dengan OKU Timur
const initialData = {
  categories: [
    { id: 'cat-1', name: 'Beras dan hasil pertanian', icon: '🌾' },
    { id: 'cat-2', name: 'Karet', icon: '🌳' },
    { id: 'cat-3', name: 'Sayur dan buah', icon: '🥬' },
    { id: 'cat-4', name: 'Olahan khas Belitang', icon: '🍘' },
    { id: 'cat-5', name: 'Produk UMKM lainnya', icon: '🍯' }
  ],
  stores: [
    {
      id: 'STR-001',
      name: 'Tani Makmur Belitang',
      owner: 'Pak Wayan Sudarma',
      phone: '081273449901',
      address: 'Desa Karang Binangun, BK 10',
      district: 'Belitang Madang Raya',
      status: 'terverifikasi',
      verifiedAt: '2026-10-15',
      rating: 4.9,
      salesCount: 142
    },
    {
      id: 'STR-002',
      name: 'Subur Sari Martapura',
      owner: 'Ibu Nurhayati',
      phone: '082188443322',
      address: 'Jl. Merdeka, Pasar Martapura',
      district: 'Martapura',
      status: 'terverifikasi',
      verifiedAt: '2026-10-20',
      rating: 4.8,
      salesCount: 98
    },
    {
      id: 'STR-003',
      name: 'Berkah Perkebunan Buay Madang',
      owner: 'Pak Hendra Saputra',
      phone: '081377551122',
      address: 'Desa Kurungan Nyawa',
      district: 'Buay Madang',
      status: 'terverifikasi',
      verifiedAt: '2026-10-22',
      rating: 4.7,
      salesCount: 56
    },
    {
      id: 'STR-004',
      name: 'Dapur Belitang Rasa (Kue & Kerupuk)',
      owner: 'Ibu Komang Ayu',
      phone: '085267119090',
      address: 'Desa Gumawang, BK 4',
      district: 'Belitang',
      status: 'menunggu',
      verifiedAt: null,
      rating: 5.0,
      salesCount: 12
    },
    {
      id: 'STR-005',
      name: 'Madu Rimba Alami Komering',
      owner: 'Pak Rusli Cempaka',
      phone: '081299882311',
      address: 'Desa Campang Tiga',
      district: 'Cempaka',
      status: 'menunggu',
      verifiedAt: null,
      rating: 4.9,
      salesCount: 8
    }
  ],
  products: [
    {
      id: 'PRD-001',
      storeId: 'STR-001',
      storeName: 'Tani Makmur Belitang',
      name: 'Beras Organik Ramos Belitang Super',
      category: 'Beras dan hasil pertanian',
      price: 14500,
      unit: 'kg',
      stock: 120,
      stockMin: 15,
      description: 'Beras pulen asli hasil panen sawah irigasi teknis Belitang. Tanpa pemutih, tanpa pengawet sintetis, wangi dan higienis.',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      district: 'Belitang Madang Raya'
    },
    {
      id: 'PRD-002',
      storeId: 'STR-001',
      storeName: 'Tani Makmur Belitang',
      name: 'Beras Ketan Putih Belitang Murni',
      category: 'Beras dan hasil pertanian',
      price: 18000,
      unit: 'kg',
      stock: 45,
      stockMin: 10,
      description: 'Beras ketan putih kualitas prima cocok untuk aneka jajanan tradisional dan lemang khas daerah.',
      image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80',
      district: 'Belitang Madang Raya'
    },
    {
      id: 'PRD-003',
      storeId: 'STR-003',
      storeName: 'Berkah Perkebunan Buay Madang',
      name: 'Lateks Karet Beku Bersih Kering (Lump Mangkok)',
      category: 'Karet',
      price: 13200,
      unit: 'kg',
      stock: 450,
      stockMin: 50,
      description: 'Karet olahan petani Buay Madang dengan kadar karet kering (KKK) tinggi dan minim kotoran.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      district: 'Buay Madang'
    },
    {
      id: 'PRD-004',
      storeId: 'STR-002',
      storeName: 'Subur Sari Martapura',
      name: 'Duku Komering Manis Pilihan',
      category: 'Sayur dan buah',
      price: 22000,
      unit: 'kg',
      stock: 65,
      stockMin: 10,
      description: 'Duku asli aliran Sungai Komering dengan cita rasa manis segar, biji kecil, dan kulit tipis.',
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
      district: 'Martapura'
    },
    {
      id: 'PRD-005',
      storeId: 'STR-002',
      storeName: 'Subur Sari Martapura',
      name: 'Jeruk Siam Belitang Segar',
      category: 'Sayur dan buah',
      price: 16000,
      unit: 'kg',
      stock: 80,
      stockMin: 15,
      description: 'Jeruk segar dipetik langsung dari kebun Belitang, air berlimpah dengan rasa manis manis segar.',
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
      district: 'Martapura'
    },
    {
      id: 'PRD-006',
      storeId: 'STR-001',
      storeName: 'Tani Makmur Belitang',
      name: 'Cabai Rawit Merah Segar Petik Pagi',
      category: 'Sayur dan buah',
      price: 45000,
      unit: 'kg',
      stock: 4, // Stok menipis (<5) untuk menguji fitur peringatan stok
      stockMin: 5,
      description: 'Cabai rawit merah pedas alami, hasil panen segar pagi hari petani Belitang.',
      image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
      district: 'Belitang Madang Raya'
    },
    {
      id: 'PRD-007',
      storeId: 'STR-004',
      storeName: 'Dapur Belitang Rasa (Kue & Kerupuk)',
      name: 'Kerupuk Ikan Gabus Asli Belitang',
      category: 'Olahan khas Belitang',
      price: 25000,
      unit: 'kemasan 250g',
      stock: 35,
      stockMin: 5,
      description: 'Kerupuk renyah gurih olahan ikan sungai komering dan rempah pilihan khas daerah Belitang.',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      district: 'Belitang'
    },
    {
      id: 'PRD-008',
      storeId: 'STR-004',
      storeName: 'Dapur Belitang Rasa (Kue & Kerupuk)',
      name: 'Lempuk Durian Komering Istimewa',
      category: 'Olahan khas Belitang',
      price: 35000,
      unit: 'kemasan 200g',
      stock: 20,
      stockMin: 5,
      description: 'Dodol lempuk durian asli tanpa campuran tepung berlebih, wangi durian legit mantap.',
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
      district: 'Belitang'
    },
    {
      id: 'PRD-009',
      storeId: 'STR-005',
      storeName: 'Madu Rimba Alami Komering',
      name: 'Madu Hutan Liar Murni OKU Timur',
      category: 'Produk UMKM lainnya',
      price: 95000,
      unit: 'botol 500ml',
      stock: 18,
      stockMin: 5,
      description: 'Madu mentah (raw honey) dipanen lestari oleh warga perbatasan Cempaka. 100% murni tanpa pemanasan.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      district: 'Cempaka'
    },
    {
      id: 'PRD-010',
      storeId: 'STR-001',
      storeName: 'Tani Makmur Belitang',
      name: 'Pupuk Kompos Organik Granul Kascing',
      category: 'Produk UMKM lainnya',
      price: 20000,
      unit: 'karung 10kg',
      stock: 50,
      stockMin: 10,
      description: 'Pupuk ramah lingkungan penyubur tanah sawah & kebun buah, diproduksi dari fermentasi limbah jerami padi.',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80',
      district: 'Belitang Madang Raya'
    }
  ],
  orders: [
    {
      id: 'ORD-20261103-001',
      buyerName: 'Siti Rahmawati',
      buyerPhone: '082177889900',
      buyerAddress: 'Jl. Merdeka No. 45, Martapura',
      district: 'Martapura',
      items: [
        {
          productId: 'PRD-001',
          name: 'Beras Organik Ramos Belitang Super',
          price: 14500,
          qty: 10,
          unit: 'kg',
          storeId: 'STR-001',
          subtotal: 145000
        }
      ],
      totalAmount: 145000,
      paymentMethod: 'COD (Bayar di Tempat)',
      notes: 'Antar sore hari sesudah jam 4',
      status: 'diproses',
      createdAt: '2026-11-03T11:20:00Z'
    },
    {
      id: 'ORD-20261103-002',
      buyerName: 'Bambang Irawan',
      buyerPhone: '081366554433',
      buyerAddress: 'Komplek Pemkab OKU Timur, Kotabaru',
      district: 'Martapura',
      items: [
        {
          productId: 'PRD-004',
          name: 'Duku Komering Manis Pilihan',
          price: 22000,
          qty: 5,
          unit: 'kg',
          storeId: 'STR-002',
          subtotal: 110000
        },
        {
          productId: 'PRD-005',
          name: 'Jeruk Siam Belitang Segar',
          price: 16000,
          qty: 3,
          unit: 'kg',
          storeId: 'STR-002',
          subtotal: 48000
        }
      ],
      totalAmount: 158000,
      paymentMethod: 'Transfer Bank Sumsel Babel',
      notes: 'Pilih yang matang pohon manis',
      status: 'dikirim',
      createdAt: '2026-11-03T09:40:00Z'
    },
    {
      id: 'ORD-20261102-003',
      buyerName: 'Ahmad Faisal',
      buyerPhone: '085278901234',
      buyerAddress: 'Desa Sidodadi, BK 9',
      district: 'Belitang',
      items: [
        {
          productId: 'PRD-007',
          name: 'Kerupuk Ikan Gabus Asli Belitang',
          price: 25000,
          qty: 4,
          unit: 'kemasan 250g',
          storeId: 'STR-004',
          subtotal: 100000
        }
      ],
      totalAmount: 100000,
      paymentMethod: 'COD (Bayar di Tempat)',
      notes: 'Bungkus rapat jangan sampai hancur',
      status: 'selesai',
      createdAt: '2026-11-02T14:15:00Z'
    }
  ]
};

// Muat atau Buat Database
let db = { ...initialData };

function loadData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      db = JSON.parse(content);
      console.log('Database dimuat dari file lokal.');
    } else {
      saveData();
      console.log('Database baru dibuat dengan data awal OKU Timur.');
    }
  } catch (err) {
    console.error('Gagal membaca database lokal, menggunakan memory:', err);
  }
}

function saveData() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Gagal menyimpan database:', err);
  }
}

loadData();

// --- REST API ENDPOINTS ---

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Pasar Tani OKU Timur API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Kategori
app.get('/api/categories', (req, res) => {
  res.json(db.categories);
});

// 3. Produk (GET list, filter search & category)
app.get('/api/products', (req, res) => {
  let result = [...db.products];
  const { category, search, storeId } = req.query;

  if (category && category !== 'Semua') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.storeName.toLowerCase().includes(q)
    );
  }

  if (storeId) {
    result = result.filter(p => p.storeId === storeId);
  }

  res.json(result);
});

// Detail Produk
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  const store = db.stores.find(s => s.id === product.storeId);
  res.json({ ...product, storeDetails: store || null });
});

// Tambah Produk Baru (Penjual)
app.post('/api/products', (req, res) => {
  const { name, category, price, unit, stock, stockMin, description, image, storeId, storeName, district } = req.body;
  if (!name || !price || !unit || stock === undefined) {
    return res.status(400).json({ message: 'Lengkapi semua field wajib produk!' });
  }

  const newProduct = {
    id: `PRD-${Date.now().toString().slice(-6)}`,
    storeId: storeId || 'STR-001',
    storeName: storeName || 'Tani Makmur Belitang',
    name,
    category: category || 'Beras dan hasil pertanian',
    price: Number(price),
    unit,
    stock: Number(stock),
    stockMin: Number(stockMin || 5),
    description: description || 'Produk hasil tani lokal OKU Timur.',
    image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    district: district || 'Belitang'
  };

  db.products.unshift(newProduct);
  saveData();
  res.status(201).json({ message: 'Produk berhasil ditambahkan', product: newProduct });
});

// Update Produk & Stok (Penjual)
app.put('/api/products/:id', (req, res) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Produk tidak ditemukan' });

  const current = db.products[idx];
  const { name, category, price, unit, stock, stockMin, description, image } = req.body;

  db.products[idx] = {
    ...current,
    name: name !== undefined ? name : current.name,
    category: category !== undefined ? category : current.category,
    price: price !== undefined ? Number(price) : current.price,
    unit: unit !== undefined ? unit : current.unit,
    stock: stock !== undefined ? Number(stock) : current.stock,
    stockMin: stockMin !== undefined ? Number(stockMin) : current.stockMin,
    description: description !== undefined ? description : current.description,
    image: image !== undefined ? image : current.image
  };

  saveData();
  res.json({ message: 'Produk berhasil diperbarui', product: db.products[idx] });
});

// Hapus Produk
app.delete('/api/products/:id', (req, res) => {
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Produk tidak ditemukan' });

  const deleted = db.products.splice(idx, 1);
  saveData();
  res.json({ message: 'Produk berhasil dihapus', product: deleted[0] });
});

// 4. Pesanan / Orders
app.get('/api/orders', (req, res) => {
  const { storeId, status } = req.query;
  let result = [...db.orders];

  if (storeId) {
    result = result.filter(order => order.items.some(item => item.storeId === storeId));
  }

  if (status && status !== 'Semua') {
    result = result.filter(order => order.status === status);
  }

  res.json(result);
});

// Buat Pesanan Baru (Checkout Pembeli)
app.post('/api/orders', (req, res) => {
  const { buyerName, buyerPhone, buyerAddress, district, items, paymentMethod, notes } = req.body;

  if (!buyerName || !buyerPhone || !buyerAddress || !items || items.length === 0) {
    return res.status(400).json({ message: 'Lengkapi identitas pembeli dan produk pesanan!' });
  }

  let totalAmount = 0;
  // Kurangi stok produk
  items.forEach(item => {
    totalAmount += item.price * item.qty;
    const prod = db.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - item.qty);
    }
  });

  const newOrder = {
    id: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    buyerName,
    buyerPhone,
    buyerAddress,
    district: district || 'OKU Timur',
    items,
    totalAmount,
    paymentMethod: paymentMethod || 'COD (Bayar di Tempat)',
    notes: notes || '-',
    status: 'menunggu_konfirmasi',
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveData();
  res.status(201).json({ message: 'Pesanan berhasil dibuat!', order: newOrder });
});

// Update Status Pesanan (Penjual / Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

  const { status } = req.body;
  const validStatus = ['menunggu_konfirmasi', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid' });
  }

  order.status = status;
  saveData();
  res.json({ message: `Status pesanan diubah menjadi ${status}`, order });
});

// 5. Toko & Verifikasi Admin
app.get('/api/stores', (req, res) => {
  res.json(db.stores);
});

app.get('/api/stores/verification', (req, res) => {
  const pendingStores = db.stores.filter(s => s.status === 'menunggu');
  res.json(pendingStores);
});

app.patch('/api/stores/:id/verify', (req, res) => {
  const store = db.stores.find(s => s.id === req.params.id);
  if (!store) return res.status(404).json({ message: 'Toko tidak ditemukan' });

  const { status } = req.body; // 'terverifikasi' | 'ditolak'
  if (!['terverifikasi', 'ditolak'].includes(status)) {
    return res.status(400).json({ message: 'Status verifikasi harus terverifikasi atau ditolak' });
  }

  store.status = status;
  if (status === 'terverifikasi') {
    store.verifiedAt = new Date().toISOString().slice(0, 10);
  }
  saveData();
  res.json({ message: `Toko ${store.name} berhasil diubah status menjadi ${status}`, store });
});

// 6. Analitik Admin & Potensi PAD OKU Timur (Sesuai PRD Seksi 7.7)
app.get('/api/admin/analytics', (req, res) => {
  const totalUsers = 48; // Estimasi user terdaftar
  const totalStores = db.stores.length;
  const verifiedStores = db.stores.filter(s => s.status === 'terverifikasi').length;
  const pendingStores = db.stores.filter(s => s.status === 'menunggu').length;
  const totalProducts = db.products.length;
  const lowStockProducts = db.products.filter(p => p.stock <= p.stockMin).length;

  const totalOrders = db.orders.length;
  const completedOrders = db.orders.filter(o => o.status === 'selesai');
  const activeOrders = db.orders.filter(o => ['menunggu_konfirmasi', 'diproses', 'dikirim'].includes(o.status));

  const totalTurnover = db.orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const completedTurnover = completedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Estimasi potensi PAD (hanya analisis jika perda/retribusi 1% jasa pasar tani diterapkan - PRD 7.7)
  const estimasiPotensiPAD = Math.round(totalTurnover * 0.01);

  // Ringkasan per kecamatan di OKU Timur
  const districts = ['Belitang', 'Belitang Madang Raya', 'Martapura', 'Buay Madang', 'Cempaka'];
  const districtSummary = districts.map(name => {
    const pCount = db.products.filter(p => (p.district || '').toLowerCase().includes(name.toLowerCase())).length;
    const sCount = db.stores.filter(s => (s.district || '').toLowerCase().includes(name.toLowerCase())).length;
    return { name, productCount: pCount, storeCount: sCount };
  });

  res.json({
    users: { total: totalUsers },
    stores: { total: totalStores, verified: verifiedStores, pending: pendingStores },
    products: { total: totalProducts, lowStock: lowStockProducts },
    orders: { total: totalOrders, active: activeOrders.length, completed: completedOrders.length },
    finance: {
      totalTurnover,
      completedTurnover,
      estimasiPotensiPAD,
      catatanKebijakan: "Estimasi potensi PAD bersifat simulasi analisis jika ada regulasi retribusi resmi dari Dinas OKU Timur (PRD 7.7)."
    },
    districtSummary
  });
});

// Reset Data untuk Demo Pengujian
app.post('/api/reset-data', (req, res) => {
  db = JSON.parse(JSON.stringify(initialData));
  saveData();
  res.json({ message: 'Data demo Pasar Tani OKU Timur berhasil di-reset ke nilai awal.' });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌾 Pasar Tani OKU Timur Web & PWA Server Berjalan!`);
  console.log(`📍 Port: http://localhost:${PORT}`);
  console.log(`🛒 Marketplace Pembeli: http://localhost:${PORT}/customer.html`);
  console.log(`📱 PWA Manifest: http://localhost:${PORT}/manifest.json`);
  console.log(`====================================================`);
});

