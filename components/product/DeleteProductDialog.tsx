"use client";

import { useState } from "react";
import { fetchApi } from "@/lib/api";

type DeleteProductDialogProps = {
  isOpen: boolean;
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeleteProductDialog({ isOpen, productId, productName, onClose, onSuccess }: DeleteProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const { response, data } = await fetchApi(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        throw new Error(data.message || "Gagal menghapus produk.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-sm rounded-3xl shadow-2xl border border-border-default overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
        
        <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">delete_forever</span>
        </div>
        
        <h2 className="text-lg font-bold text-text-primary mb-2">Hapus Produk?</h2>
        <p className="text-sm text-text-secondary mb-6">
          Apakah Anda yakin ingin menghapus <strong>{productName}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-text-secondary bg-background border border-border-default hover:bg-border-soft transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-danger hover:bg-danger/90 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[16px]">delete</span>
            )}
            Hapus
          </button>
        </div>

      </div>
    </div>
  );
}
