"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";
import AlertDialog from "@/components/ui/AlertDialog";

interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
  onEdit: (order: any) => void;
  onRefresh: () => void;
}

export default function OrderDetailModal({ orderId, onClose, onEdit, onRefresh }: OrderDetailModalProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { response, data } = await fetchApi(`/api/orders/${orderId}`);
        if (response.ok && data.success) {
          setOrder(data.data);
        } else {
          toast.error("Gagal memuat detail pesanan.");
          onClose();
        }
      } catch (error) {
        toast.error("Terjadi kesalahan jaringan.");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [orderId, onClose, toast]);

  const confirmDelete = async () => {
    setIsAlertOpen(false);
    setIsDeleting(true);
    try {
      const { response, data } = await fetchApi(`/api/orders/${orderId}`, {
        method: "DELETE"
      });
      if (response.ok && data.success) {
        toast.success("Pesanan berhasil dihapus.");
        onRefresh();
        onClose();
      } else {
        toast.error(data.message || "Gagal menghapus pesanan.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-card w-full max-w-md rounded-3xl shadow-xl p-8 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-sidebar border-t-primary rounded-full animate-spin" />
          <p className="text-text-secondary font-medium animate-pulse">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const dateStr = new Date(order.created_at || Date.now()).toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short'
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col justify-end md:items-center md:justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-0 md:p-6" onClick={onClose}>
        
        <div 
          className="bg-card w-full max-w-lg md:rounded-[32px] rounded-t-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-soft">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Detail Pesanan</h2>
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
          <div className="p-6 overflow-y-auto no-scrollbar flex flex-col gap-6 flex-1">
            {/* Info Banner */}
            <div className="flex items-center justify-between bg-sidebar text-white p-4 rounded-2xl shadow-inner">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">Waktu Pemesanan</span>
                <span className="text-sm font-bold">{dateStr}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[11px] text-white/60 font-medium uppercase tracking-wider">Status</span>
                <span className="text-xs font-bold px-2.5 py-1 bg-success/20 text-green-400 rounded-full">Selesai</span>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-muted">receipt_long</span>
                Daftar Produk
              </h3>
              <div className="flex flex-col gap-3">
                {order.items && order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-background border border-border-default rounded-2xl">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-text-primary line-clamp-1">{item.product_name}</span>
                      <span className="text-xs font-medium text-text-secondary">
                        {item.quantity} x Rp {Number(item.unit_price).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      Rp {(item.quantity * Number(item.unit_price)).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-dashed border-border-soft pt-4 flex justify-between items-center">
              <span className="text-base font-bold text-text-secondary">Total Tagihan</span>
              <span className="text-xl font-bold text-primary">
                Rp {Number(order.total_amount).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border-soft bg-background rounded-b-[32px] flex items-center gap-3">
            <button
              onClick={() => setIsAlertOpen(true)}
              disabled={isDeleting}
              className="flex-1 py-3.5 bg-red-50 text-red-600 rounded-2xl font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">delete</span>
              )}
              Hapus
            </button>
            <button
              onClick={() => onEdit(order)}
              className="flex-1 py-3.5 bg-sidebar text-white rounded-2xl font-bold text-sm shadow-md hover:bg-black transition-all flex justify-center items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Pesanan
            </button>
          </div>

        </div>
      </div>

      <AlertDialog 
        isOpen={isAlertOpen}
        title="Hapus Pesanan"
        message="Apakah Anda yakin ingin menghapus pesanan ini? Data yang telah dihapus tidak akan ditampilkan lagi pada riwayat transaksi."
        confirmText="Hapus Pesanan"
        cancelText="Kembali"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
}
