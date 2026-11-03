# VIBECODING.MD — Pasar Tani OKU Timur
## Panduan Pengembangan Berbasis AI (Vibe Coding) & Standar Proyek

**Proyek:** Pasar Tani OKU Timur  
**Mata Kuliah:** Perancangan dan Pengembangan Sistem Informasi (PPSI)  
**Tahun:** 2026  

---

## 1. Filosofi Vibe Coding Proyek Ini

Proyek ini dibangun dengan metodologi **Vibe Coding Modern**: menggabungkan kecepatan iterasi berbantuan AI (Antigravity Agent) dengan kepatuhan ketat terhadap dokumen spesifikasi teknis (**PRD.md**) dan arsitektur sistem (**Design.md**).

Prinsip utama yang diterapkan:
1. **Spec-Driven Prompting:** Setiap fitur yang diimplementasikan harus merujuk pada bab dan poin di dalam `PRD.md`.
2. **Konteks Lokal OKU Timur:** Seluruh dummy data, komoditas, nama wilayah (Belitang, Martapura, Buay Madang, Cempaka), dan persona mencerminkan realitas pertanian di Kabupaten OKU Timur, Sumatera Selatan.
3. **No-Heavy-Build Architecture:** Menggunakan JavaScript modern vanila (HTML5, CSS3, ES6) di frontend serta Node.js Express di backend agar aplikasi langsung dapat dijalankan tanpa dependensi build tools yang rumit (Webpack/Vite/Babel) sehingga mempermudah demonstrasi dan penilaian dosen.
4. **PWA-First:** Petani dan pembeli di daerah pedesaan sering kali memiliki koneksi internet yang fluktuatif. Service Worker (`sw.js`) dan Web App Manifest (`manifest.json`) memastikan aplikasi ringan, cepat dibuka, dan dapat di-install di smartphone Android.

---

## 2. Struktur Proyek

```text
ppsi/
├── PRD.md                  # Product Requirements Document resmi Pasar Tani OKU Timur
├── Design.md               # Arsitektur sistem, skema basis data, dan spesifikasi API
├── VIBECODING.md           # Catatan instruksi, standar kode, dan panduan run
├── package.json            # Konfigurasi dependensi Node.js & skrip server
├── server.js               # Backend REST API dengan Express & persistence data lokal
├── index.html              # Aplikasi Marketplace Lengkap (Pembeli, Penjual & Admin)
├── customer.html           # Tampilan khusus Pembeli (Customer Mobile Experience)
├── style.css               # Desain UI modern dengan palet warna pertanian OKU Timur
├── app.js                  # Frontend Controller, Manajemen State, Keranjang & Interaksi
├── manifest.json           # Web App Manifest PWA (Layar penuh, ikon & tema)
└── sw.js                   # Service Worker untuk caching offline dan reliabilitas
```

---

## 3. Peran Pengguna & Skala Fitur (RBAC)

Aplikasi memiliki switch peran interaktif di bagian atas antarmuka:
- 🛒 **Pembeli (Customer):**
  - Telusuri katalog komoditas: Beras Belitang, Karet, Sayur & Buah Segar, Olahan Lokal.
  - Live search dan filter per kategori.
  - Tambah ke keranjang, atur kuantitas, input nama & alamat kirim di OKU Timur.
  - Riwayat pesanan real-time dengan status badge.
- 🌾 **Petani / Pelaku UMKM (Penjual):**
  - Monitoring omzet penjualan hari ini dan total pesanan.
  - Kelola etalase: Tambah produk, ubah stok, atur harga dan satuan (kg, ikat, kemasan).
  - Peringatan otomatis stok menipis (< 5 unit).
  - Proses pesanan: Ubah status dari *Menunggu Konfirmasi* -> *Diproses* -> *Dikirim* -> *Selesai*.
- 🏛️ **Admin Dinas Pertanian & UMKM OKU Timur:**
  - Pantau total pengguna, produk aktif, total perputaran transaksi.
  - Verifikasi pendaftaran toko petani (Terima / Tolak).
  - Analitik potensi Pendapatan Asli Daerah (PAD) sebagai bahan evaluasi dinas (sesuai PRD Seksi 7.7).
  - Cetak ringkasan laporan aktivitas pasar digital.

---

## 4. Cara Menjalankan Proyek

### Prasyarat
- Node.js versi 18 ke atas sudah terpasang di komputer.

### Langkah Menjalankan
1. Buka terminal pada folder proyek `c:\PPSI`.
2. Jalankan perintah instalasi dependensi (jika belum):
   ```bash
   npm install
   ```
3. Nyalakan server backend & web server:
   ```bash
   npm start
   ```
   *Atau jalankan:*
   ```bash
   node server.js
   ```
4. Buka peramban (browser) dan akses:
   - **Aplikasi Utama (Multi-Role Portal):** `http://localhost:3000`
   - **Tampilan Khusus Pembeli:** `http://localhost:3000/customer.html`
   - **Pemeriksaan Status API:** `http://localhost:3000/api/health`

---

## 5. Konvensi Kode & Best Practices
- **Penamaan Variabel & Fungsi:** Menggunakan camelCase dalam bahasa Indonesia/Inggris yang jelas (`loadProducts`, `renderCart`, `updateOrderStatus`).
- **Penyimpanan Data:** Server menyajikan data in-memory dengan initial seed data realistis OKU Timur dan mendukung penyimpanan file JSON otomatis (`data/database.json`) sehingga perubahan data saat demo tidak langsung hilang.
- **Responsif:** Desain disesuaikan untuk tampilan mobile smartphone (360px - 480px) hingga layar monitor proyektor ruang sidang/kelas.

