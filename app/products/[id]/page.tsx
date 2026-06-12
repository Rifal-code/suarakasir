"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import EditProductModal from "@/components/product/EditProductModal";
import DeleteProductDialog from "@/components/product/DeleteProductDialog";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadProductDetail = async () => {
    setLoading(true);
    try {
      const { response, data } = await fetchApi(`/api/products/${productId}`);
      if (response.ok && data.success) {
        setProduct(data.data);
      } else {
        setError(data.message || "Produk tidak ditemukan.");
      }
    } catch (err) {
      setError("Gagal memuat data produk karena masalah jaringan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadProductDetail();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-primary flex-col gap-3">
        <span className="material-symbols-outlined text-5xl animate-spin">progress_activity</span>
        <p className="font-bold tracking-widest uppercase text-xs">Memuat Data...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1000px] mx-auto min-h-[50vh] flex flex-col items-center justify-center bg-card rounded-3xl shadow-lg p-10 text-center mt-10">
        <span className="material-symbols-outlined text-6xl text-danger mb-4">error</span>
        <h2 className="text-2xl font-black text-text-primary mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-text-secondary mb-8">{error}</p>
        <button 
          onClick={() => router.push('/products')}
          className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-md shadow-primary/30 hover:shadow-lg hover:scale-105 transition-all"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const imageUrl = product.image_url || "https://placehold.co/600x600?text=No+Image";
  const formattedPrice = `Rp ${Number(product.price).toLocaleString('id-ID')}`;
  const addedDate = new Date(product.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1200px] mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <button 
          onClick={() => router.push('/products')}
          className="group flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-bold text-sm bg-card px-5 py-2.5 rounded-full shadow-sm hover:shadow-md"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_left_alt</span>
          Kembali ke Katalog
        </button>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-success text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-success/30 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">edit_square</span>
            Edit Produk
          </button>
          <button 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-danger text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-danger/30 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Hapus
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card rounded-[2rem] shadow-xl overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Left Column: Image Gallery Style */}
        <div className="lg:w-1/2 bg-background/50 p-8 lg:p-12 flex flex-col items-center justify-center relative">
          <div className="w-full aspect-square max-w-[450px] relative rounded-3xl overflow-hidden bg-white shadow-2xl shadow-black/5 group">
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Absolute Badges over image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider text-white backdrop-blur-md shadow-lg ${product.stock > 10 ? 'bg-success/90' : 'bg-danger/90'}`}>
                {product.stock > 10 ? 'TERSEDIA' : 'STOK MENIPIS'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Details */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center z-10">
          
          {/* Metadata Row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-border-default text-text-secondary rounded-full text-[10px] font-black uppercase tracking-widest">
              ID: {productId.substring(0, 8)}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
              Katalog Utama
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black text-text-primary mb-4 leading-tight tracking-tight">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-border-default/50">
            <p className="text-4xl lg:text-5xl font-black text-primary tracking-tighter">
              {formattedPrice}
            </p>
          </div>

          {/* Elegant Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-background rounded-2xl p-5 border border-border-soft hover:border-primary/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Stok Saat Ini</span>
              </div>
              <span className="text-2xl font-black text-text-primary ml-13">{product.stock} <span className="text-sm text-text-muted font-medium">Unit</span></span>
            </div>
            
            <div className="bg-background rounded-2xl p-5 border border-border-soft hover:border-info/30 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center text-info group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Tgl Masuk</span>
              </div>
              <span className="text-lg font-black text-text-primary ml-13">{addedDate}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="flex-1">
            <h3 className="flex items-center gap-2 text-sm font-black text-text-primary mb-4 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Informasi Produk
            </h3>
            <div className="prose prose-sm prose-gray max-w-none">
              <p className="text-base text-text-secondary leading-relaxed whitespace-pre-wrap">
                {product.description || "Deskripsi lengkap mengenai produk ini belum ditambahkan oleh Kasir. Silakan klik tombol Edit Produk untuk melengkapi informasi."}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <EditProductModal 
        isOpen={isEditModalOpen}
        productId={productId}
        initialData={{
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
          imageUrl: product.image_url,
        }}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => {
          loadProductDetail();
        }}
      />

      <DeleteProductDialog 
        isOpen={isDeleteDialogOpen}
        productId={productId}
        productName={product.name}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={() => {
          router.push('/products');
        }}
      />

    </div>
  );
}
