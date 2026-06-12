"use client";

import { useState } from "react";
import CartItem from "./CartItem";

const initialCart = [
  {
    id: 1,
    name: "Ayam Bakar Madu",
    variant: "Porsi Besar",
    price: 35000,
    imageUrl: "",
    qty: 1,
  },
  {
    id: 2,
    name: "Es Kopi Susu Gula Aren",
    variant: "Medium",
    price: 18000,
    imageUrl: "",
    qty: 2,
  },
  {
    id: 3,
    name: "Nasi Goreng Spesial",
    variant: "Pedas Lv.2",
    price: 28000,
    imageUrl: "",
    qty: 1,
  },
];

export default function OrderPanel() {
  const [cart, setCart] = useState(initialCart);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qris" | "cash">("cash");
  const [discount, setDiscount] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = discount ? Math.round(subtotal * 0.2) : 0;
  const tax = Math.round((subtotal - discountAmount) * 0.11);
  const total = subtotal - discountAmount + tax;

  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  const removeItem = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id: number, newQty: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  return (
    <aside className="w-full xl:w-[380px] bg-card border-l border-border-default flex flex-col h-full rounded-3xl xl:rounded-none shadow-lg xl:shadow-none">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-border-default">
        <h2 className="text-lg font-bold text-text-primary">Detail Pesanan</h2>
        <span className="text-[10px] font-bold text-text-secondary bg-background px-2.5 py-1 rounded-md border border-border-soft">
          #TRX-2025
        </span>
      </div>

      {/* Customer Section */}
      <div className="px-6 pt-5 pb-4 space-y-3 border-b border-border-soft">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Pelanggan</p>
          <button className="text-[10px] flex items-center gap-1 bg-sidebar text-white px-3 py-1 rounded-full font-bold hover:bg-text-primary transition-colors">
            Tambah <span className="material-symbols-outlined text-[12px]">add</span>
          </button>
        </div>
        <div className="bg-background rounded-2xl p-4 flex justify-between items-center border border-border-soft">
          <div>
            <p className="font-bold text-sm text-text-primary">Pelanggan Umum</p>
            <p className="text-[10px] text-text-secondary mt-0.5">Walk-in Customer</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-text-primary">3</p>
            <p className="text-[10px] text-text-secondary font-semibold">Kunjungan</p>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Keranjang</p>
          <button 
            onClick={() => setCart([])}
            className="text-[10px] font-bold text-primary hover:text-primary-active uppercase transition-colors"
          >
            Hapus Semua
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <span className="material-symbols-outlined text-[48px] mb-3 opacity-30">shopping_cart</span>
            <p className="text-sm font-medium">Keranjang kosong</p>
            <p className="text-xs mt-1">Tambahkan produk dari katalog</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <CartItem 
                key={item.id}
                name={item.name}
                variant={item.variant}
                price={item.price}
                imageUrl={item.imageUrl}
                initialQty={item.qty}
                onRemove={() => removeItem(item.id)}
                onQtyChange={(newQty) => updateQty(item.id, newQty)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-white/80 backdrop-blur-md border-t border-border-default p-6 space-y-4">
        {/* Discount Input */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Detail Pembayaran</p>
          <div className="bg-background rounded-xl p-2 flex items-center gap-2 border border-border-soft">
            <span className="material-symbols-outlined text-primary pl-1 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              sell
            </span>
            <input
              className="bg-transparent border-none focus:outline-none text-xs flex-grow font-medium placeholder-text-muted"
              placeholder="Kode Diskon 20%"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <button 
              onClick={() => setDiscount(discount ? "" : "DISC20")}
              className="bg-sidebar text-white text-[10px] px-3 py-1.5 rounded-lg font-bold hover:bg-text-primary transition-colors"
            >
              {discount ? "Hapus" : "Terapkan"}
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="space-y-2 py-2">
          <div className="flex justify-between text-xs text-text-secondary font-semibold">
            <span>Subtotal</span>
            <span className="text-text-primary">{formatRupiah(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-xs text-text-secondary font-semibold">
              <span>Diskon</span>
              <span className="text-primary">- {formatRupiah(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-text-secondary font-semibold">
            <span>PPN (11%)</span>
            <span className="text-text-primary">{formatRupiah(tax)}</span>
          </div>
          <div className="flex justify-between items-end border-t border-dashed border-border-default pt-3 mt-3">
            <span className="text-sm font-bold text-text-primary uppercase">Total</span>
            <span className="text-xl font-black text-text-primary leading-none">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Metode Pembayaran</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: "card" as const, icon: "credit_card", label: "Kartu" },
              { key: "qris" as const, icon: "qr_code_scanner", label: "QRIS" },
              { key: "cash" as const, icon: "account_balance_wallet", label: "Tunai" },
            ]).map(method => (
              <button
                key={method.key}
                onClick={() => setPaymentMethod(method.key)}
                className={`py-3 px-1 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1.5 transition-all border-2 ${
                  paymentMethod === method.key
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border-soft bg-card text-text-secondary hover:border-primary/30 hover:text-primary"
                }`}
              >
                <span 
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: paymentMethod === method.key ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {method.icon}
                </span>
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button className="py-3.5 rounded-xl bg-sidebar text-white font-bold text-sm shadow-lg active:scale-95 transition-all hover:bg-text-primary">
            Cetak Struk
          </button>
          <button className="py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 active:scale-95 transition-all hover:bg-primary-hover">
            Bayar Sekarang
          </button>
        </div>
      </div>
    </aside>
  );
}
