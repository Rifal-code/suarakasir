"use client";

import { useState, useRef } from "react";
import { fetchApi } from "@/lib/api";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("API Key ImgBB belum dikonfigurasi di .env.local");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Gagal mengunggah gambar ke ImgBB");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name || !price) {
        throw new Error("Nama dan harga produk wajib diisi.");
      }

      let imageUrl = "";

      // 1. Upload Image to ImgBB if exists
      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      // 2. Submit to Backend
      const payload = {
        name,
        price: Number(price).toFixed(2),
        description: description || name,
        image_url: imageUrl,
        stock: stock ? parseInt(stock) : 0,
      };

      const { response, data } = await fetchApi("/api/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok && data.success) {
        // Reset form
        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
        onSuccess();
        onClose();
      } else {
        throw new Error(data.message || "Gagal menyimpan produk.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border-default overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-soft flex justify-between items-center bg-background/50">
          <h2 className="text-lg font-bold text-text-primary">Tambah Produk Baru</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-text-primary border border-border-soft transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm font-medium flex gap-2 items-start">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <form id="addProductForm" onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-2xl border-2 border-dashed border-border-default hover:border-primary/50 bg-background flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors group relative"
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="material-symbols-outlined text-white">edit</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-text-muted group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-3xl mb-1">add_photo_alternate</span>
                    <span className="text-[10px] font-bold">Upload Foto</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Nama Produk *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border-default rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm text-text-primary font-medium"
                placeholder="Contoh: Kopi Susu Gula Aren"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1.5">Keterangan Produk</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-background border border-border-default rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm text-text-primary font-medium resize-none"
                placeholder="Deskripsi singkat produk..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">Harga (Rp) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-background border border-border-default rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm text-text-primary font-bold"
                  placeholder="0"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1.5">Stok</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full bg-background border border-border-default rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-sm text-text-primary font-bold"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-soft bg-background/50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-sm text-text-secondary hover:text-text-primary hover:bg-border-soft transition-colors"
            disabled={loading}
          >
            Batal
          </button>
          <button 
            type="submit"
            form="addProductForm"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Menyimpan...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                Simpan Produk
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
