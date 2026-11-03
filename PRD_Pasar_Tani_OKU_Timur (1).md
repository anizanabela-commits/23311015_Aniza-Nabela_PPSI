# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Pasar Tani OKU Timur

**Jenis Produk:** Aplikasi marketplace berbasis mobile  
**Wilayah Implementasi:** Kabupaten Ogan Komering Ulu Timur (OKU Timur), Sumatera Selatan  
**Versi Dokumen:** 1.0

---

## 1. Ringkasan Produk

Pasar Tani OKU Timur merupakan aplikasi marketplace yang dirancang untuk mempertemukan petani, pelaku Usaha Mikro, Kecil, dan Menengah (UMKM), serta pembeli dalam satu platform digital. Aplikasi ini membantu petani dan pelaku UMKM memasarkan hasil pertanian maupun produk olahan lokal secara lebih luas, sekaligus memudahkan pembeli menemukan dan memesan produk lokal.

Aplikasi menyediakan fitur pencarian produk, kategori, detail produk, keranjang, pemesanan, pengelolaan toko, serta dashboard admin. Admin dari dinas terkait dapat memantau aktivitas platform dan memperoleh data transaksi sebagai bahan evaluasi serta perencanaan program daerah.

## 2. Latar Belakang dan Permasalahan

Kabupaten OKU Timur memiliki potensi hasil pertanian dan produk UMKM lokal, seperti beras, karet, sayuran, buah-buahan, serta berbagai produk olahan khas Belitang. Namun, pemasaran produk masih dapat menghadapi sejumlah kendala, antara lain:
- Informasi produk dan harga belum terpusat dalam satu platform.
- Petani dan pelaku UMKM memiliki keterbatasan jangkauan pemasaran.
- Pembeli kesulitan menemukan informasi produk lokal dan penjualnya.
- Pendataan produk, pelaku usaha, dan aktivitas transaksi belum tentu terdokumentasi secara terintegrasi.

Pasar Tani OKU Timur diusulkan sebagai sarana digital untuk membantu mengatasi permasalahan tersebut. Permasalahan dan kebutuhan di atas merupakan dasar perancangan dan perlu divalidasi kembali bersama calon pengguna serta dinas terkait.

## 3. Tujuan Produk

1. Memudahkan petani dan pelaku UMKM memasarkan produk secara digital.
2. Memudahkan pembeli mencari, melihat, dan memesan produk lokal OKU Timur.
3. Menyediakan sarana pengelolaan produk, stok, dan pesanan bagi penjual.
4. Membantu admin melakukan pemantauan data pengguna, produk, dan transaksi.
5. Menyediakan data aktivitas marketplace yang dapat dimanfaatkan sebagai bahan evaluasi dan perencanaan pemerintah daerah.

## 4. Indikator Keberhasilan

Indikator yang dapat digunakan untuk mengevaluasi aplikasi:
- Jumlah petani dan pelaku UMKM yang mendaftar dan memiliki toko.
- Jumlah produk lokal yang dipublikasikan.
- Jumlah pembeli terdaftar dan pengguna aktif.
- Jumlah pesanan dan nilai transaksi yang tercatat.
- Persentase pesanan yang berhasil diselesaikan.
- Tingkat kelengkapan dan keakuratan data produk serta penjual.

Target angka untuk setiap indikator ditetapkan setelah tersedia data awal dan kesepakatan dengan pemangku kepentingan.

## 5. Target Pengguna dan Hak Akses

### 5.1 Pembeli
Pembeli menggunakan aplikasi untuk:
- Melihat dan mencari produk.
- Menjelajahi kategori produk.
- Melihat informasi produk dan profil penjual.
- Menambahkan produk ke keranjang.
- Membuat pesanan.
- Melihat status dan riwayat pesanan.
- Mengelola profil akun.

### 5.2 Petani dan Pelaku UMKM (Penjual)
Penjual menggunakan aplikasi untuk:
- Mendaftarkan akun dan informasi toko.
- Menambahkan, mengubah, dan menghapus produk.
- Mengatur harga dan stok.
- Melihat pesanan masuk.
- Memperbarui status pesanan sesuai proses yang disepakati.
- Melihat ringkasan penjualan.

### 5.3 Admin Dinas
Admin bertugas untuk:
- Mengelola dan memverifikasi akun penjual.
- Memantau data pembeli, penjual, dan produk.
- Meninjau atau menonaktifkan produk yang tidak sesuai ketentuan.
- Memantau data pesanan dan transaksi.
- Melihat laporan aktivitas marketplace.
- Mengelola kategori dan informasi yang ditampilkan dalam aplikasi.

Hak akses admin perlu dibatasi berdasarkan kewenangan dan kebijakan dinas yang ditetapkan.

## 6. User Stories

| Pengguna | Kebutuhan | Tujuan |
|---|---|---|
| Pembeli | Sebagai pembeli, saya ingin mencari produk berdasarkan nama atau kategori | Saya dapat menemukan produk dengan mudah |
| Pembeli | Saya ingin melihat harga, stok, deskripsi, dan penjual | Saya dapat mempertimbangkan produk sebelum memesan |
| Pembeli | Saya ingin memasukkan produk ke keranjang dan membuat pesanan | Saya dapat melakukan pemesanan |
| Penjual | Saya ingin menambahkan dan mengelola produk | Produk saya dapat dilihat pembeli |
| Penjual | Saya ingin melihat pesanan masuk | Saya dapat memproses pesanan |
| Penjual | Saya ingin melihat ringkasan penjualan | Saya dapat memantau aktivitas toko |
| Admin | Saya ingin memverifikasi penjual dan memantau produk | Data marketplace lebih terkelola |
| Admin | Saya ingin melihat laporan transaksi | Saya dapat mengevaluasi aktivitas platform |

## 7. Kebutuhan Fungsional

### 7.1 Autentikasi dan Akun
- Sistem menyediakan registrasi, login, dan logout.
- Pengguna dapat memilih atau memperoleh peran sesuai proses pendaftaran.
- Pengguna dapat melihat dan memperbarui informasi profil.
- Sistem membatasi akses fitur berdasarkan peran pengguna.

### 7.2 Beranda Pembeli
- Menampilkan kolom pencarian.
- Menampilkan kategori produk.
- Menampilkan produk pilihan atau produk terbaru.
- Menampilkan kartu produk yang memuat foto, nama, harga, dan nama penjual.
- Menyediakan navigasi ke halaman kategori, keranjang, pesanan, dan akun.

### 7.3 Kategori dan Pencarian
Kategori awal yang direncanakan:
- Beras dan hasil pertanian.
- Karet.
- Sayur dan buah.
- Olahan khas Belitang.
- Produk UMKM lainnya.

Pengguna dapat mencari produk berdasarkan nama dan menyaring produk berdasarkan kategori. Kategori dapat dikelola admin.

### 7.4 Detail Produk
Halaman detail produk menampilkan:
- Foto produk.
- Nama dan deskripsi produk.
- Harga dan satuan, misalnya per kilogram atau per kemasan.
- Informasi stok.
- Informasi penjual, termasuk nama toko dan desa.
- Pengaturan jumlah produk.
- Tombol tambah ke keranjang.

### 7.5 Keranjang dan Pemesanan
- Pembeli dapat menambahkan produk ke keranjang.
- Pembeli dapat mengubah jumlah atau menghapus produk dari keranjang.
- Sistem menampilkan ringkasan item dan total harga.
- Pembeli dapat mengisi atau memilih informasi penerimaan pesanan.
- Sistem membuat catatan pesanan setelah pembeli melakukan konfirmasi.
- Pembeli dapat melihat status pesanan.

**Catatan:** Metode pembayaran, pilihan pengiriman, biaya layanan, dan mekanisme pengembalian dana perlu diputuskan bersama pemilik proses sebelum implementasi. Dokumen ini tidak menetapkan integrasi payment gateway tertentu.

### 7.6 Dashboard Penjual
Dashboard penjual menampilkan:
- Ringkasan penjualan hari ini.
- Jumlah pesanan masuk.
- Daftar produk.
- Informasi stok produk.
- Peringatan stok menipis.
- Form tambah dan edit produk.
- Daftar pesanan beserta statusnya.

### 7.7 Dashboard Admin
Dashboard admin menampilkan:
- Ringkasan jumlah pembeli.
- Ringkasan jumlah penjual.
- Jumlah produk aktif.
- Jumlah pesanan dan transaksi.
- Daftar verifikasi penjual.
- Pengelolaan kategori.
- Pengelolaan produk dan akun.
- Laporan aktivitas marketplace.

Dashboard dapat menampilkan **estimasi potensi PAD** hanya sebagai informasi analisis apabila tersedia dasar perhitungan dan kebijakan yang sah. Nilai transaksi marketplace tidak otomatis menjadi Pendapatan Asli Daerah (PAD). Pungutan atau retribusi hanya dapat diterapkan jika memiliki dasar hukum, jenis layanan, kewenangan, dan mekanisme pemungutan yang sesuai.

### 7.8 Notifikasi
- Pembeli memperoleh informasi perubahan status pesanan.
- Penjual memperoleh informasi pesanan baru.
- Admin memperoleh informasi pengajuan verifikasi atau aktivitas yang memerlukan tindak lanjut.

Jenis dan saluran notifikasi ditentukan pada tahap teknis.

## 8. Kebutuhan Nonfungsional

1. **Kemudahan penggunaan:** Antarmuka sederhana, konsisten, dan mudah dipahami.
2. **Responsivitas:** Tampilan menyesuaikan ukuran layar perangkat yang didukung.
3. **Keamanan:** Kata sandi disimpan secara aman dan akses fitur dibatasi berdasarkan peran.
4. **Kinerja:** Halaman dan daftar produk ditampilkan dengan waktu respons yang wajar.
5. **Keandalan data:** Perubahan stok dan status pesanan harus tercatat secara konsisten.
6. **Kompatibilitas:** Aplikasi ditujukan untuk perangkat Android sesuai versi minimum yang ditentukan pada tahap pengembangan.
7. **Aksesibilitas:** Ukuran teks, kontras warna, dan tombol dibuat nyaman digunakan.

## 9. Alur Penggunaan Utama

### 9.1 Alur Pembeli
1. Pembeli membuka aplikasi.
2. Pembeli masuk atau mendaftar.
3. Pembeli melihat beranda dan memilih kategori atau mencari produk.
4. Pembeli membuka detail produk.
5. Pembeli menentukan jumlah dan menambahkan produk ke keranjang.
6. Pembeli memeriksa keranjang dan mengonfirmasi pesanan.
7. Pembeli memantau status pesanan melalui halaman Pesanan.

### 9.2 Alur Penjual
1. Penjual mendaftar dan melengkapi profil toko.
2. Admin melakukan verifikasi jika fitur verifikasi diterapkan.
3. Penjual masuk ke dashboard.
4. Penjual menambahkan produk, harga, foto, dan stok.
5. Penjual menerima pesanan.
6. Penjual memproses pesanan dan memperbarui statusnya.
7. Penjual memantau ringkasan penjualan.

### 9.3 Alur Admin
1. Admin masuk ke dashboard.
2. Admin memeriksa ringkasan aktivitas.
3. Admin meninjau pendaftaran penjual.
4. Admin mengelola kategori, akun, dan produk.
5. Admin memantau pesanan dan laporan transaksi.

## 10. Ruang Lingkup Produk

### 10.1 Fitur MVP (Prioritas Awal)
- Registrasi dan login.
- Pengaturan peran pengguna.
- Beranda dan kategori produk.
- Pencarian produk.
- Detail produk.
- Keranjang dan pencatatan pesanan.
- Dashboard penjual.
- Pengelolaan produk dan stok.
- Dashboard admin dasar.
- Pemantauan pengguna, produk, dan pesanan.

### 10.2 Pengembangan Lanjutan
- Integrasi pembayaran digital.
- Integrasi jasa pengiriman atau pelacakan.
- Peta lokasi penjual.
- Ulasan dan penilaian produk.
- Analitik penjualan lanjutan.
- Integrasi notifikasi eksternal.
- Integrasi dengan sistem pemerintah daerah jika tersedia dasar dan kebutuhan resmi.

### 10.3 Di Luar Ruang Lingkup Awal
- Pengelolaan pajak atau retribusi otomatis tanpa dasar hukum dan integrasi resmi.
- Penjaminan kualitas produk secara fisik oleh aplikasi.
- Pengelolaan logistik secara langsung oleh pengelola marketplace.
- Penetapan harga pasar oleh sistem.

## 11. Struktur Navigasi

### Pembeli
- Beranda
- Kategori
- Keranjang
- Pesanan
- Akun

### Penjual
- Dashboard
- Produk Saya
- Pesanan
- Penjualan
- Profil Toko

### Admin
- Dashboard
- Data Pengguna
- Verifikasi Penjual
- Kategori
- Data Produk
- Pesanan dan Transaksi
- Laporan
- Pengaturan

## 12. Arahan UI/UX

### 12.1 Konsep Visual
Desain aplikasi menggunakan konsep bersih, hangat, sederhana, dan mudah dibaca. Tampilan harus konsisten pada seluruh halaman dan mengutamakan kemudahan pengguna.

### 12.2 Warna
- Hijau daun sebagai warna utama untuk menggambarkan pertanian dan kesegaran.
- Kuning padi sebagai warna aksen.
- Putih krem sebagai warna latar.
- Warna teks gelap untuk menjaga keterbacaan.

### 12.3 Komponen Antarmuka
- Tombol utama berukuran cukup besar dan memiliki label jelas.
- Kartu produk menampilkan foto, nama, harga, dan penjual.
- Ikon navigasi konsisten.
- Formulir menggunakan label dan petunjuk pengisian.
- Status pesanan menggunakan penanda visual yang mudah dibedakan.

## 13. Asumsi dan Ketergantungan

- Penjual dan pembeli memiliki akses ke perangkat serta koneksi internet.
- Informasi produk dan stok diperbarui oleh penjual.
- Admin dinas memiliki petugas dan kewenangan untuk mengelola platform.
- Data awal kategori, wilayah, penjual, dan produk disediakan atau diverifikasi oleh pihak terkait.
- Kebijakan pembayaran, pengiriman, privasi, dan pengelolaan data ditetapkan sebelum peluncuran.
- Penerapan pungutan atau retribusi memerlukan kajian dan dasar hukum tersendiri.

## 14. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Penjual belum terbiasa menggunakan aplikasi | Produk dan stok tidak diperbarui | Sediakan panduan dan pelatihan singkat |
| Informasi produk tidak akurat | Pembeli kehilangan kepercayaan | Sediakan fitur pelaporan dan pemeriksaan admin |
| Koneksi internet terbatas | Penggunaan aplikasi terganggu | Optimalkan ukuran gambar dan kebutuhan data |
| Pesanan tidak diproses | Pengalaman pembeli menurun | Sediakan status pesanan dan pemantauan admin |
| Data pengguna tidak terlindungi | Risiko privasi dan keamanan | Terapkan kontrol akses dan perlindungan data |
| Ekspektasi PAD tidak sesuai | Kesalahan perencanaan pendapatan | Pisahkan nilai transaksi, potensi, dan PAD aktual |

## 15. Kriteria Penerimaan

Produk dapat dinyatakan memenuhi kebutuhan MVP apabila:
- Pengguna dapat mendaftar, login, dan logout.
- Sistem membatasi menu sesuai peran pengguna.
- Pembeli dapat melihat, mencari, dan membuka detail produk.
- Pembeli dapat menambahkan produk ke keranjang dan membuat pesanan.
- Penjual dapat menambah, mengubah, dan mengelola stok produk.
- Penjual dapat melihat pesanan masuk dan memperbarui status pesanan.
- Admin dapat melihat dan mengelola data pengguna, produk, kategori, serta pesanan.
- Informasi yang ditampilkan sesuai dengan data yang tersimpan.
- Tampilan utama dapat digunakan dengan jelas pada perangkat yang ditargetkan.

## 16. Hal yang Perlu Dikonfirmasi

Hal-hal berikut belum ditetapkan secara rinci dan perlu diputuskan bersama pemilik produk:
1. Apakah aplikasi hanya mendukung Android atau juga akan tersedia untuk iOS dan web?
2. Apakah pembayaran dilakukan secara tunai, transfer, COD, payment gateway, atau kombinasi?
3. Siapa yang bertanggung jawab atas pengiriman produk?
4. Apakah penjual harus diverifikasi sebelum dapat mempublikasikan produk?
5. Apakah transaksi dilakukan langsung antara pembeli dan penjual atau melalui pengelola marketplace?
6. Apakah ada biaya layanan bagi penjual atau pembeli?
7. Apakah dashboard admin digunakan oleh satu dinas atau beberapa perangkat daerah?
8. Data apa saja yang boleh ditampilkan dalam laporan pemerintah daerah?

## 17. Penutup

Pasar Tani OKU Timur diharapkan menjadi sarana digital untuk memperluas pemasaran hasil pertanian dan produk UMKM lokal, mempermudah transaksi antara penjual dan pembeli, serta menyediakan data aktivitas marketplace yang lebih terstruktur. Pengembangan dilakukan secara bertahap dengan memprioritaskan kebutuhan utama pengguna, keamanan data, kemudahan penggunaan, dan kesesuaian dengan kebijakan pemerintah daerah.
