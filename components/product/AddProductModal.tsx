"use client";

import { useState, useRef } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

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

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        toast.success("Produk berhasil ditambahkan!");
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Gagal menyimpan produk.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border-default overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-border-soft flex justify-between items-center bg-white z-10 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">Tambah Produk</h2>
            <p className="text-xs text-text-secondary mt-0.5">Masukkan detail produk baru ke katalog</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-border-soft transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="addProductForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-bold text-text-primary mb-2">Foto Produk</label>
              <div 
                onClick={() => !imagePreview && fileInputRef.current?.click()}
                className={`relative w-full aspect-[2/1] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden transition-colors ${
                  imagePreview ? 'border-transparent bg-background' : 'border-border-default hover:border-primary/50 bg-background cursor-pointer group'
                }`}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-white rounded-xl" />
                    {/* Dark overlay on hover for image change */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer z-10"
                    >
                      <span className="material-symbols-outlined text-white text-3xl mb-1">edit</span>
                      <span className="text-white text-xs font-bold">Ubah Foto</span>
                    </div>
                    {/* Remove Image Button - Absolute positioned outside the hover overlay */}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-danger active:scale-90 transition-all z-20 shadow-sm"
                      title="Hapus foto"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-text-muted group-hover:text-primary transition-colors py-8">
                    <div className="w-12 h-12 rounded-full bg-border-default/50 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                      <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                    </div>
                    <span className="text-sm font-bold text-text-primary mb-1">Klik untuk upload foto</span>
                    <span className="text-xs text-text-secondary">PNG, JPG, max 5MB</span>
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">Nama Produk <span className="text-danger">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border-default rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[15px] text-text-primary transition-all placeholder:text-text-muted"
                  placeholder="Contoh: Kopi Susu Gula Aren"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1.5">Harga (Rp) <span className="text-danger">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-[15px]">Rp</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-background border border-border-default rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[15px] text-text-primary font-bold transition-all placeholder:text-text-muted/50 font-mono"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-primary mb-1.5">Stok</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-background border border-border-default rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[15px] text-text-primary font-bold transition-all placeholder:text-text-muted font-mono"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-1.5">Keterangan Produk <span className="text-text-muted font-normal text-xs">(Opsional)</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-border-default rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-[15px] text-text-primary transition-all placeholder:text-text-muted resize-none"
                  placeholder="Tambahkan detail produk seperti ukuran, varian, atau komposisi..."
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-soft bg-white flex justify-end gap-3 shrink-0">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-text-secondary hover:text-text-primary bg-background hover:bg-border-soft border border-border-default transition-colors"
            disabled={loading}
          >
            Batal
          </button>
          <button 
            type="submit"
            form="addProductForm"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-sm bg-surface-dark text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 shadow-md"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Menyimpan...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">add</span>
                Tambah Produk
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
