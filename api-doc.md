Format Response
Semua endpoint menggunakan format JSON yang konsisten.

Sukses (satu item):

{
  "success": true,
  "message": "...",
  "data": { ... }
}
Sukses (daftar paginasi):

{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "limit": 10
}
Error:

{
  "success": false,
  "message": "Deskripsi error",
  "data": null
}
Autentikasi
Endpoint yang dilindungi membutuhkan header Authorization:

Authorization: Bearer <jwt_token>
Token JWT berlaku selama 7 hari.

Endpoint API
Auth — /api/auth
Method	Path	Auth	Deskripsi
POST	/api/auth/register	Publik	Daftar akun baru
POST	/api/auth/login	Publik	Login, terima JWT
POST	/api/auth/logout	🔒 JWT	Logout (hapus token di sisi klien)
GET	/api/auth/me	🔒 JWT	Profil pengguna yang login
PUT	/api/auth/me	🔒 JWT	Update profil
Produk — /api/products 🔒
Semua endpoint produk memerlukan JWT. User hanya bisa akses produk miliknya sendiri.

Method	Path	Deskripsi
GET	/api/products	Daftar produk (paginasi, cari nama)
GET	/api/products/:id	Detail produk
POST	/api/products	Buat produk baru
PUT	/api/products/:id	Update produk
DELETE	/api/products/:id	Hapus produk (soft delete)
POST /api/products
{
  "name": "Kopi Susu",
  "price": "15000.00",
  "description": "Kopi susu segar",
  "image_url": "https://example.com/kopi.jpg",
  "stock": 50
}
Aturan:

name: 2–255 karakter, unik per user
price: harus > 0
image_url: opsional, harus URL valid
stock: opsional, default 0
Order — /api/orders 🔒
⚠️ Harga dihitung server-side. Harga dari klien diabaikan. ⚠️ Stok divalidasi sebelum order disimpan, dan dikurangi otomatis setelah berhasil.

Method	Path	Deskripsi
GET	/api/orders	Daftar order (paginasi, filter status/tanggal)
GET	/api/orders/:id	Detail order beserta item
POST	/api/orders	Buat order baru
PUT	/api/orders/:id	Update order
DELETE	/api/orders/:id	Hapus order (soft delete)
POST /api/orders
{
  "items": [
    { "product_id": "uuid", "quantity": 2 },
    { "product_id": "uuid", "quantity": 1 }
  ]
}
Alur:

Validasi stok tiap produk
Hitung unit_price dari database (bukan dari klien)
Hitung subtotal = quantity × unit_price
Hitung total_amount = Σ subtotals
Simpan order & order_items
Kurangi stok tiap produk
Error stok tidak cukup (422):

{
  "success": false,
  "message": "Insufficient stock for 'Kopi Susu'. Available: 3, requested: 5",
  "data": null
}
Feedback — /api/feedback
Method	Path	Auth	Deskripsi
GET	/api/feedback	Publik	Daftar feedback publik
GET	/api/feedback/:id	Publik	Detail feedback publik
POST	/api/feedback	🔒 JWT	Kirim feedback
PUT	/api/feedback/:id	🔒 JWT	Update feedback sendiri
DELETE	/api/feedback/:id	🔒 JWT	Hapus feedback sendiri
Dashboard — /api/dashboard 🔒
Semua endpoint dashboard mengembalikan data milik user yang login. Data diambil via SQL agregasi — tidak ada load semua data ke memory.

Method	Path	Query Params	Deskripsi
GET	/api/dashboard	—	Ringkasan penjualan
GET	/api/dashboard/sales	range=7d|30d|1y	Data grafik penjualan
GET	/api/dashboard/top-products	range=7d|30d|1y	Produk terlaris
GET	/api/dashboard/trends	range=7d|30d|1y	Perbandingan pertumbuhan
GET /api/dashboard
{
  "success": true,
  "message": "Dashboard overview",
  "data": {
    "total_sales_today": "125000.00",
    "total_sales_week": "870000.00",
    "total_sales_month": "3500000.00",
    "total_orders_today": 8,
    "total_orders_week": 54,
    "total_orders_month": 210,
    "best_selling_product": {
      "product_id": "uuid",
      "product_name": "Kopi Susu",
      "total_quantity": 120,
      "total_revenue": "1800000.00"
    },
    "recent_orders_count": 210
  }
}
GET /api/dashboard/sales?range=7d
{
  "success": true,
  "message": "Sales chart data",
  "data": {
    "range": "7d",
    "data": [
      { "label": "2026-06-06", "total_sales": "150000.00", "total_orders": 10 },
      { "label": "2026-06-07", "total_sales": "0.00", "total_orders": 0 }
    ]
  }
}
Range 1y menggunakan agregasi bulanan (YYYY-MM). Range lainnya agregasi harian. Hari tanpa transaksi tetap muncul dengan nilai 0.

GET /api/dashboard/top-products?range=30d
{
  "success": true,
  "message": "Top products",
  "data": [
    {
      "product_id": "uuid",
      "product_name": "Kopi Susu",
      "total_quantity": 120,
      "total_revenue": "1800000.00"
    }
  ]
}
GET /api/dashboard/trends?range=7d
{
  "success": true,
  "message": "Sales trends",
  "data": {
    "range": "7d",
    "current_sales": "870000.00",
    "previous_sales": "650000.00",
    "sales_growth_pct": 33.85,
    "current_orders": 54,
    "previous_orders": 40,
    "order_growth_pct": 35.0,
    "sales_trend": "up",
    "order_trend": "up"
  }
}
AI & Voice — /api/ai 🔒
POST /api/ai/chat
Chat umum dengan AI assistant.

{ "message": "Rekomendasikan menu untuk siang hari" }
POST /api/ai/parse-order
Flow Voice Order:

User rekam suara
↓ FE kirim audio ke Gemini
↓ Gemini hasilkan JSON mentah:
  { "items": [{ "n": "baxo", "q": 3 }] }
↓ FE kirim JSON mentah ke endpoint ini
↓ BE fuzzy match ke produk di database
↓ BE kembalikan hasil match ke FE
↓ FE tampilkan form konfirmasi
↓ User validasi lalu POST /api/orders
Request:

{
  "items": [
    { "n": "baxo", "q": 3 },
    { "n": "es teh mnis", "q": 2 }
  ]
}
Response:

{
  "success": true,
  "message": "Order parsed from voice input",
  "data": {
    "items": [
      {
        "product_id": "uuid",
        "name": "Bakso",
        "input_name": "baxo",
        "quantity": 3,
        "unit_price": "15000.00",
        "confidence": 0.9333,
        "needs_confirmation": false
      },
      {
        "product_id": "uuid",
        "name": "Es Teh Manis",
        "input_name": "es teh mnis",
        "quantity": 2,
        "unit_price": "5000.00",
        "confidence": 0.9542,
        "needs_confirmation": false
      }
    ]
  }
}
Aturan Fuzzy Matching:

Algoritma: Jaro-Winkler (dari crate strsim)
Bonus: jika input adalah substring dari nama produk (atau sebaliknya)
confidence: nilai 0.0–1.0 (4 desimal)
needs_confirmation: true jika confidence < 0.80
Daftar produk tidak pernah dikirim ke Gemini — Gemini hanya mengubah suara/teks manusia menjadi JSON mentah
Setelah dikonfirmasi user, kirim POST /api/orders dengan data yang tervalidasi.

Referensi Error
HTTP Status	AppError	Penyebab Umum
400	BadRequest	Request tidak valid
401	Unauthorized	JWT hilang/invalid, atau password salah
403	Forbidden	Akses resource milik user lain
404	NotFound	Resource tidak ditemukan
409	Conflict	Email/nama produk duplikat
422	ValidationError	Validasi field gagal, stok tidak cukup
500	InternalServerError	Error database atau server
Keamanan
Password di-hash dengan bcrypt
Token JWT menggunakan HS256 dengan secret yang dapat dikonfigurasi
Semua operasi tulis dibatasi per-user — akses lintas user mengembalikan 403
Soft delete menjaga integritas data (record yang dihapus dikecualikan dari semua query)
Harga order selalu dihitung server-side — total dari klien diabaikan
Stok divalidasi atomik dengan UPDATE ... WHERE stock >= qty