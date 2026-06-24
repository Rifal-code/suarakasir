"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchApi } from "@/lib/api";
import EditProductModal from "@/components/product/EditProductModal";
import DeleteProductDialog from "@/components/product/DeleteProductDialog";
import ProductDetailSkeleton from "@/components/product/ProductDetailSkeleton";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

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

  // — Loading —
  if (loading) return <ProductDetailSkeleton />;

  // — Error —
  if (error || !product) {
    return (
      <div className="max-w-md mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-3xl text-danger">error</span>
        </div>
        <h2 className="text-lg font-bold text-text-primary mb-1">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-text-secondary mb-6">{error}</p>
        <button 
          onClick={() => router.push('/products')}
          className="px-6 py-2.5 bg-surface-dark text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-95 transition-all"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // — Derived —
  const imageUrl = product.image_url || "https://placehold.co/600x600?text=No+Image";
  const formattedPrice = `Rp ${Number(product.price).toLocaleString('id-ID')}`;
  const addedDate = new Date(product.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  
  const stock = product.stock ?? 0;
  const stockLevel: 'high' | 'low' | 'out' = stock > 10 ? 'high' : stock > 0 ? 'low' : 'out';
  const stockLabel = { high: 'Tersedia', low: 'Stok Menipis', out: 'Habis' }[stockLevel];
  const stockColor = { 
    high: 'text-text-primary', 
    low: 'text-warning', 
    out: 'text-danger' 
  }[stockLevel];
  const stockBadgeBg = { 
    high: 'bg-surface-dark/80', 
    low: 'bg-warning/90', 
    out: 'bg-danger/90' 
  }[stockLevel];

  const description = product.description || "";
  const hasLongDesc = description.length > 160;

  // ═══════════════════════════════════
  // MOBILE LAYOUT  (< lg)
  // ═══════════════════════════════════
  const MobileLayout = () => (
    <div className="lg:hidden animate-in fade-in duration-500">
      {/* Full-bleed Image */}
      <div className="relative aspect-[4/3] w-full bg-background overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-border-default animate-pulse"></div>
        )}
        <img 
          src={imageUrl} 
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Back button overlay */}
        <button
          onClick={() => router.push('/products')}
          className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        {/* Stock badge overlay */}
        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide text-white backdrop-blur-md ${stockBadgeBg}`}>
          {stockLabel.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-28">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
            #{productId.substring(0, 8)}
          </span>
          <span className="w-1 h-1 rounded-full bg-border-default"></span>
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            Katalog Utama
          </span>
        </div>

        {/* Name */}
        <h1 className="text-xl font-bold text-text-primary leading-snug mb-1.5">
          {product.name}
        </h1>

        {/* Price */}
        <p className="text-2xl font-black text-primary tracking-tight mb-4">
          {formattedPrice}
        </p>

        {/* Info rows — compact list style */}
        <div className="border-t border-b border-border-soft py-3 mb-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Stok saat ini</span>
            <span className={`text-sm font-bold ${stockColor}`}>
              {stock} unit
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Tanggal masuk</span>
            <span className="text-sm font-medium text-text-primary">{addedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Status</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              stockLevel === 'high' ? 'bg-surface-dark/5 text-text-primary' :
              stockLevel === 'low'  ? 'bg-warning/10 text-warning' :
                                      'bg-danger/10 text-danger'
            }`}>
              {stockLabel}
            </span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Deskripsi Produk
          </h3>
          {description ? (
            <div className="relative">
              <p className={`text-sm text-text-secondary leading-relaxed whitespace-pre-wrap ${
                !descExpanded && hasLongDesc ? 'max-h-[80px] overflow-hidden' : ''
              }`}>
                {description}
              </p>
              {hasLongDesc && !descExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent"></div>
              )}
              {hasLongDesc && (
                <button
                  onClick={() => setDescExpanded(!descExpanded)}
                  className="text-xs font-bold text-primary mt-1"
                >
                  {descExpanded ? 'Sembunyikan' : 'Lihat selengkapnya'}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-muted italic">Belum ada deskripsi.</p>
          )}
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border-soft px-4 py-3 flex items-center gap-2.5 lg:hidden">
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-surface-dark text-white rounded-xl text-sm font-bold active:scale-[0.97] transition-transform"
        >
          <span className="material-symbols-outlined text-[16px]">edit_square</span>
          Edit Produk
        </button>
        <button 
          onClick={() => setIsDeleteDialogOpen(true)}
          className="py-2.5 px-4 border border-border-default text-text-secondary rounded-xl text-sm font-bold active:scale-[0.97] transition-transform"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
    </div>
  );

  // ═══════════════════════════════════
  // DESKTOP LAYOUT  (≥ lg)
  // ═══════════════════════════════════
  const DesktopLayout = () => (
    <div className="hidden lg:block animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[960px] mx-auto pb-10 px-6">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push('/products')}
        className="group flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors mb-5"
      >
        <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        <span className="font-medium">Kembali ke Katalog</span>
      </button>

      {/* Main Card */}
      <div className="bg-card rounded-2xl border border-border-soft shadow-sm overflow-hidden flex">
        
        {/* Left: Image */}
        <div className="w-[380px] shrink-0 bg-background/60 p-6 flex items-start">
          <div className="w-full sticky top-24">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-border-soft group">
              {!imgLoaded && (
                <div className="absolute inset-0 bg-border-default animate-pulse"></div>
              )}
              <img 
                src={imageUrl} 
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Stock badge */}
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide text-white backdrop-blur-md shadow ${stockBadgeBg}`}>
                {stockLabel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 p-6 flex flex-col min-h-0">
          
          {/* Meta */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              #{productId.substring(0, 8)}
            </span>
            <span className="w-1 h-1 rounded-full bg-border-default"></span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Katalog Utama
            </span>
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold text-text-primary leading-snug mb-2 tracking-tight">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-black text-primary tracking-tight mb-5">
            {formattedPrice}
          </p>

          {/* Divider + Info rows */}
          <div className="border-t border-b border-border-soft py-4 mb-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                Stok saat ini
              </span>
              <span className={`text-sm font-bold ${stockColor}`}>
                {stock} unit
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                Tanggal masuk
              </span>
              <span className="text-sm font-medium text-text-primary">{addedDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                Status
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                stockLevel === 'high' ? 'bg-surface-dark/5 text-text-primary' :
                stockLevel === 'low'  ? 'bg-warning/10 text-warning' :
                                        'bg-danger/10 text-danger'
              }`}>
                {stockLabel}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 mb-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5">
              Deskripsi Produk
            </h3>
            {description ? (
              <div className="relative">
                <p className={`text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap ${
                  !descExpanded && hasLongDesc ? 'max-h-[100px] overflow-hidden' : ''
                }`}>
                  {description}
                </p>
                {hasLongDesc && !descExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent"></div>
                )}
                {hasLongDesc && (
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="text-xs font-bold text-primary hover:text-primary-hover mt-1.5 transition-colors"
                  >
                    {descExpanded ? 'Sembunyikan' : 'Lihat selengkapnya'}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-text-muted italic">Belum ada deskripsi produk.</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-5 border-t border-border-soft">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-surface-dark text-white rounded-xl text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">edit_square</span>
              Edit Produk
            </button>
            <button 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 border border-border-default text-text-secondary rounded-xl text-sm font-medium hover:border-danger hover:text-danger active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Hapus
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileLayout />
      <DesktopLayout />

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
    </>
  );
}
