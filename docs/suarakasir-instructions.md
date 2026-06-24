# Panduan Penggunaan Suara Kasir (AI POS System)

## Tentang Suara Kasir
Suara Kasir adalah sistem Point-of-Sale (POS) atau aplikasi kasir modern yang dirancang khusus untuk UMKM. Fitur unggulan dari aplikasi ini adalah "Voice Order" atau pesanan suara yang ditenagai oleh AI, memungkinkan kasir mencatat pesanan pelanggan hanya dengan berbicara, tanpa perlu mengetik manual.

## Menu Utama & Navigasi
Aplikasi ini memiliki 4 menu utama yang dapat diakses melalui Sidebar (di Desktop) atau BottomBar (di Mobile):
1. **Dashboard**: Menampilkan ringkasan penjualan, grafik performa bulanan/mingguan, produk terlaris, dan tombol untuk mencetak laporan penjualan berformat PDF.
2. **Produk**: Katalog produk. Di sini kasir dapat melihat daftar barang, menambah produk baru, mengedit, atau menghapus produk.
3. **Transaksi**: Halaman tempat kasir memproses pesanan baru, baik secara manual maupun melalui pesanan suara.
4. **Riwayat**: Daftar seluruh pesanan yang pernah masuk. Kasir bisa mengedit status pesanan atau membatalkannya di sini.
Selain itu, ada menu **Profil** di bagian kanan atas layar tempat pengguna bisa mengubah nama, email, password, serta melengkapi nama jalan dan kontak toko yang nantinya akan tercetak pada laporan PDF.

## Cara Menggunakan Pesanan Suara (AI Voice Order)
Ini adalah fitur utama yang sangat mempercepat proses pemesanan.
1. Di halaman mana pun, cari ikon **Microphone (Mic)**. Di desktop posisinya ada di kanan atas (TopBar) dengan tulisan "Order Suara". Di mobile posisinya ada di tengah bawah (BottomBar).
2. Klik tombol Mic tersebut. Jendela popup akan muncul dan sistem akan mulai merekam suara.
3. Ucapkan pesanan dengan jelas, contoh: *"Pesan Kopi Susu Gula Aren 2, sama Es Teh Manis 1"*.
4. Klik tombol **Kirim Pesanan** (atau **Berhenti** lalu kirim).
5. AI akan memproses suara dan secara cerdas mencocokkannya dengan daftar produk yang ada di database aplikasi Anda.
6. Anda akan otomatis dialihkan ke halaman Transaksi dengan pesanan yang sudah terisi di keranjang. Anda hanya perlu mengecek dan menekan "Simpan Order".

## Cara Mengelola Produk (Tambah, Edit, Hapus)
1. Buka menu **Produk**.
2. Untuk **Menambah Produk**, klik tombol "+ Tambah Produk" di bagian atas. Anda bisa memasukkan nama, harga, deskripsi, stok awal, dan mengunggah foto produk.
3. Untuk **Mengedit**, klik tombol pensil/edit di kartu produk terkait. Anda bisa mengubah foto, memperbarui stok, atau mengubah harga.
4. Untuk **Menghapus**, klik tombol tong sampah/delete. Produk yang dihapus akan masuk ke keranjang sampah (soft delete) sehingga data riwayat penjualan yang lama tidak akan rusak.

## Cara Melakukan Transaksi Manual
Jika Anda tidak ingin menggunakan suara, pesanan dapat diproses manual:
1. Buka menu **Transaksi**.
2. Cari produk yang ingin dipesan di daftar produk, lalu klik tombol **Tambah ke Keranjang** (ikon keranjang/tambah).
3. Anda bisa menyesuaikan jumlah (quantity) dari masing-masing produk yang ada di keranjang sebelah kanan.
4. Periksa subtotal dan total harga.
5. Jika pelanggan sudah membayar, klik tombol **Simpan Order**. Sistem otomatis akan mengurangi stok produk terkait.

## Cara Mencetak Laporan (PDF)
1. Buka menu **Dashboard**.
2. Di pojok kanan atas bagian ringkasan, ada tombol **Cetak Laporan (PDF)**.
3. Anda bisa memilih rentang waktu: 7 Hari Terakhir, 30 Hari Terakhir, atau 1 Tahun.
4. Klik tombol tersebut, maka sistem akan men-download file PDF. File PDF ini berisi ringkasan omzet, tabel transaksi, produk terlaris, dan sebuah Paragraf Saran AI (AI Insight) tentang bisnis Anda.

## Pertanyaan di Luar Konteks Aplikasi
**[PENTING UNTUK AI]**: Jika ada pengguna/kasir yang bertanya mengenai resep makanan, berita politik, cuaca, pelajaran matematika, koding, atau hal lain yang SAMA SEKALI TIDAK ADA hubungannya dengan fungsi aplikasi "Suara Kasir" ini, Anda harus menolaknya dengan sopan dan memberi tahu bahwa Anda adalah AI Asisten khusus Suara Kasir.
