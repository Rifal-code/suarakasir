"use client";

import CartItem from "./CartItem";

export interface CartItemType {
  id: string; // The ID of the order item in the cart (using product_id or a unique uuid)
  product_id: string;
  name: string;
  variant?: string;
  price: number;
  imageUrl?: string;
  qty: number;
}

interface OrderPanelProps {
  cart: CartItemType[];
  onUpdateQty: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  isSubmitting: boolean;
}

export default function OrderPanel({
  cart,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
  isSubmitting,
}: OrderPanelProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  return (
    <aside className="w-full xl:w-[320px] bg-white flex flex-col h-full rounded-3xl shadow-xl border border-border-soft overflow-hidden">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-border-default">
        <h2 className="text-lg font-bold text-text-primary">Detail Pesanan</h2>
        <span className="text-[10px] font-bold text-text-secondary bg-background px-2.5 py-1 rounded-md border border-border-soft">
          Pesanan Baru
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Keranjang</p>
          <button
            onClick={() => cart.forEach(item => onRemoveItem(item.id))}
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
                onRemove={() => onRemoveItem(item.id)}
                onQtyChange={(newQty) => onUpdateQty(item.id, newQty)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-white/80 backdrop-blur-md border-t border-border-default p-6 space-y-4">
        {/* Totals */}
        <div className="space-y-2 py-2">
          <div className="flex justify-between text-xs text-text-secondary font-semibold">
            <span>Subtotal</span>
            <span className="text-text-primary">{formatRupiah(subtotal)}</span>
          </div>
          <div className="flex justify-between items-end border-t border-dashed border-border-default pt-3 mt-3">
            <span className="text-sm font-bold text-text-primary uppercase">Total</span>
            <span className="text-xl font-black text-text-primary leading-none">{formatRupiah(total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3 pt-2">
          <button
            onClick={onCheckout}
            disabled={cart.length === 0 || isSubmitting}
            className={`py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
              cart.length === 0 || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white shadow-primary/30 active:scale-95 hover:bg-primary-hover"
            }`}
          >
            {isSubmitting ? "Memproses..." : "Buat Pesanan"}
          </button>
        </div>
      </div>
    </aside>
  );
}
