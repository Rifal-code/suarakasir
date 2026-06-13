"use client";

import { useState, useEffect } from "react";

type CartItemProps = {
  name: string;
  variant?: string;
  price: number;
  imageUrl?: string;
  initialQty?: number;
  needsConfirmation?: boolean;
  onRemove?: () => void;
  onQtyChange?: (qty: number) => void;
};

export default function CartItem({ name, variant, price, imageUrl, initialQty = 1, needsConfirmation, onRemove, onQtyChange }: CartItemProps) {
  const [qty, setQty] = useState(initialQty);

  useEffect(() => {
    setQty(initialQty);
  }, [initialQty]);

  const handleDecrease = () => {
    if (qty > 1) {
      setQty(qty - 1);
      onQtyChange?.(qty - 1);
    }
  };

  const handleIncrease = () => {
    setQty(qty + 1);
    onQtyChange?.(qty + 1);
  };

  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  return (
    <div className={`flex p-2 rounded-xl shadow-sm gap-3 group relative ${needsConfirmation ? 'bg-indigo-50/50 border border-indigo-200' : 'bg-secondary'}`}>
      {needsConfirmation && (
        <div className="absolute -top-2 -right-2 z-10 bg-white rounded-full flex items-center justify-center" title="Hasil AI - Mohon verifikasi">
          <span className="material-symbols-outlined text-[18px] text-indigo-500" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
      )}
      <div className="w-16 h-16 bg-background rounded-xl overflow-hidden flex-shrink-0 border border-border-soft flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-[24px] text-border-default">inventory_2</span>
        )}
      </div>
      <div className="flex-grow flex flex-col justify-between py-0.5 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-text-primary truncate">{name}</h4>
            {variant && (
              <span className="text-[10px] bg-background px-2 py-0.5 rounded font-semibold text-text-secondary inline-block mt-1 border border-border-soft">
                {variant}
              </span>
            )}
          </div>
          <button
            onClick={onRemove}
            className="text-text-muted hover:text-danger transition-colors flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-bold text-text-primary">{formatRupiah(price * qty)}</span>
          <div className="flex items-center gap-2 bg-background rounded-lg px-1.5 py-0.5 border border-border-soft">
            <button
              onClick={handleDecrease}
              className="w-6 h-6 flex items-center justify-center hover:text-primary transition-all rounded"
            >
              <span className="material-symbols-outlined text-[12px]">remove</span>
            </button>
            <span className="text-xs font-bold w-5 text-center">{String(qty).padStart(2, "0")}</span>
            <button
              onClick={handleIncrease}
              className="w-6 h-6 flex items-center justify-center hover:text-primary transition-all rounded"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

