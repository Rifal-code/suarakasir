# SUARA KASIR - DESIGN SYSTEM

Versi: 1.0
Bahasa: Indonesia
Framework Agnostic
Design Style: Modern SaaS Dashboard + POS System + AI Assistant

---

# BRAND IDENTITY

Nama Produk:
Suara Kasir

Tagline:
Kelola Keuangan Dengan Suara

Karakter Brand:
- Modern
- Cepat
- Cerdas
- Profesional
- Ramah UMKM
- AI Powered

Target Pengguna:
- UMKM
- Warung
- Toko Kelontong
- Cafe
- Restoran
- Pedagang Kecil
- Kasir

---

# DESIGN PRINCIPLES

WAJIB:

- Clean
- Modern
- Minimal
- Professional
- Enterprise Ready
- AI Friendly
- Mobile First
- Component Based

HINDARI:

- Terlalu banyak warna
- Border berlebihan
- Efek neon berlebihan
- Gradien mencolok
- Layout berantakan

---

# COLOR SYSTEM

## Primary

Orange digunakan untuk:

- CTA utama
- Tombol Simpan
- Tombol Tambah
- Tombol Checkout
- Tombol Konfirmasi

Primary Orange:
#FF5A2C

Primary Hover:
#FF6A42

Primary Active:
#E84A1D

---

## Secondary

Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Info:
#3B82F6

---

## Background

Page Background:
#F5F6F8

Card Background:
#FFFFFF

Sidebar Background:
#0D0D0D

Dark Surface:
#111827

---

## Text

Primary Text:
#111827

Secondary Text:
#6B7280

Muted Text:
#9CA3AF

White Text:
#FFFFFF

---

## Border

Border Default:
#E5E7EB

Border Soft:
#F1F5F9

---

# TYPOGRAPHY

Font Family:

Inter

Fallback:

sans-serif

---

Heading 1
32px
700

Heading 2
28px
700

Heading 3
24px
600

Heading 4
20px
600

Body Large
16px
500

Body Normal
14px
400

Caption
12px
400

---

# BORDER RADIUS

Small:
12px

Medium:
16px

Large:
20px

Extra Large:
24px

Card Radius:
24px

Button Radius:
14px

---

# SHADOW SYSTEM

Soft Shadow:

0 4px 20px rgba(0,0,0,0.05)

Card Shadow:

0 8px 30px rgba(0,0,0,0.06)

Floating Shadow:

0 15px 40px rgba(0,0,0,0.12)

---

# SPACING SYSTEM

4
8
12
16
20
24
32
40
48
64

Gunakan kelipatan 4.

---

# COMPONENT ARCHITECTURE

Semua UI HARUS berbasis component.

JANGAN membuat elemen langsung di halaman.

Setiap bagian harus reusable.

Contoh:

components/
├─ ui/
├─ dashboard/
├─ product/
├─ transaction/
├─ analytics/
├─ ai/
├─ shared/

---

# CORE COMPONENTS

## Button

Variant:

- Primary
- Secondary
- Outline
- Ghost
- Danger

---

## Card

Variant:

- ProductCard
- StatsCard
- AnalyticsCard
- CustomerCard
- AIInsightCard

---

## Modal

Variant:

- Confirmation
- Form
- Detail
- AI Assistant

---

## Input

Variant:

- Text
- Number
- Currency
- Search
- Voice Input

---

## Badge

Variant:

- Success
- Warning
- Danger
- Info
- Stock

---

# DASHBOARD STYLE

Gunakan:

- Grid Layout
- Large Cards
- Statistik Ringkas
- Banyak White Space

Dashboard harus terasa ringan.

Jangan memenuhi layar dengan informasi.

---

# TABLE STYLE

- Rounded
- Sticky Header
- Search
- Filter
- Pagination

Warna tabel harus lembut.

---

# PRODUCT CARD STYLE

Berisi:

- Gambar
- Nama Produk
- Harga
- Stok
- Kategori
- Tombol Aksi

Radius:
24px

---

# AI DESIGN LANGUAGE

Karena Suara Kasir berbasis AI.

Gunakan komponen khusus AI.

Contoh:

- AI Insight Card
- AI Recommendation
- AI Summary
- Voice Assistant

Gunakan aksen hijau.

AI Color:
#22C55E

---

# ICON SYSTEM

Gunakan:

- Lucide
atau
- Heroicons

Style:

- Outline
- Modern
- Konsisten

---

# DESKTOP LAYOUT

Sidebar:
280px

Content:
Flexible

Right Panel:
Optional

Layout:

Sidebar
Content
Panel

---

# MOBILE EXPERIENCE

Mobile TIDAK BOLEH hanya responsive.

Mobile harus memiliki layout khusus.

---

Bottom Navigation:

Dashboard
Voice Button
Riwayat

---

Tombol Tengah:

Bentuk:
Lingkaran

Posisi:
Floating

Ukuran:
Lebih besar dari menu lain

Fungsi:
Mulai Transaksi Suara

Warna:
#22C55E

Icon:
Microphone

---

# LANGUAGE

SEMUA TEKS WAJIB BAHASA INDONESIA

Contoh:

Benar:
- Beranda
- Produk
- Riwayat
- Laporan
- Transaksi

Salah:
- Home
- Product
- History
- Report

---

# ANIMATION

Durasi:

150ms
200ms
300ms

Gunakan:

- Fade
- Scale
- Slide

Hindari animasi berlebihan.

---

# ACCESSIBILITY

Kontras minimal WCAG AA.

Semua tombol memiliki state:

- Hover
- Active
- Focus
- Disabled

---

# FINAL RULE

Setiap halaman baru yang dibuat HARUS:

- Mengikuti design system ini
- Menggunakan component reusable
- Menggunakan warna yang sudah ditentukan
- Menggunakan typography yang sudah ditentukan
- Menggunakan bahasa Indonesia
- Mempertahankan identitas visual Suara Kasir
- Konsisten antara desktop dan mobile