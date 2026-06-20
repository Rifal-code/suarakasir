"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";

interface EditOrderModalProps {
  order: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function EditOrderModal({ order, onClose, onRefresh }: EditOrderModalProps) {
  // Deep copy order items so we don't mutate the original prop
  const [items, setItems] = useState<any[]>(
    order.items ? JSON.parse(JSON.stringify(order.items)) : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const handleUpdateQty = (index: number, delta: number) => {
    const newItems = [...items];
    const newQty = newItems[index].quantity + delta;
    if (newQty <= 0) {
      newItems.splice(index, 1);
    } else {
      newItems[index].quantity = newQty;
    }
    setItems(newItems);
  };

  const handleSave = async () => {
    if (items.length === 0) {
      toast.error("Pesanan tidak boleh kosong. Gunakan fitur batalkan pesanan jika ingin menghapus.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };

      const { response, data } = await fetchApi(`/api/orders/${order.id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
      });

      if (response.ok && data.success) {
        toast.success("Pesanan berhasil diperbarui.");
        onRefresh();
        onClose();
      } else {
        toast.error(data.message || "Gagal memperbarui pesanan.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  const currentTotal = items.reduce((sum, item) => sum + (item.quantity * Number(item.unit_price)), 0);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end md:items-center md:justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-6" onClick={onClose}>
      
      <div 
        className="bg-card w-full max-w-lg md:rounded-[32px] rounded-t-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-soft">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Edit Pesanan</h2>
            <p className="text-xs font-mono text-text-secondary mt-1">#{order.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto no-scrollbar flex flex-col gap-4 flex-1 bg-background/50">
          
          <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-start gap-3 border border-blue-100 mb-2">
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">info</span>
            <p className="text-xs font-medium leading-relaxed">
              Anda dapat mengubah jumlah (qty) produk atau menghapus produk dari daftar ini. Jika Anda ingin menambah produk baru, harap buat pesanan baru.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {items.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm font-medium">Daftar produk kosong.</div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 p-4 bg-card border border-border-default rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-text-primary line-clamp-1">{item.product_name}</span>
                      <span className="text-xs font-medium text-text-secondary">Rp {Number(item.unit_price).toLocaleString('id-ID')} / item</span>
                    </div>
                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                      Rp {(item.quantity * Number(item.unit_price)).toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  {/* Qty Controls */}
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-border-soft border-dashed">
                    <button 
                      onClick={() => handleUpdateQty(idx, -item.quantity)}
                      className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Hapus
                    </button>
                    
                    <div className="flex items-center gap-3 bg-background border border-border-default rounded-full p-1">
                      <button 
                        onClick={() => handleUpdateQty(idx, -1)}
                        className="w-7 h-7 bg-card text-text-primary rounded-full flex items-center justify-center shadow-sm hover:bg-border-soft transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQty(idx, 1)}
                        className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary-hover transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary & Footer */}
        <div className="p-6 border-t border-border-soft bg-card rounded-b-[32px] flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-bold text-text-secondary">Estimasi Total Baru</span>
            <span className="text-xl font-bold text-primary">
              Rp {currentTotal.toLocaleString('id-ID')}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-3.5 bg-background text-text-primary rounded-2xl font-bold text-sm border border-border-soft hover:bg-border-default transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || items.length === 0}
              className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
