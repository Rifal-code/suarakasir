"use client";

import { useEffect, useState } from "react";
import CategoryFilter from "@/components/product/CategoryFilter";
import ProductCard from "@/components/product/ProductCard";
import AddProductModal from "@/components/product/AddProductModal";
import EditProductModal from "@/components/product/EditProductModal";
import DeleteProductDialog from "@/components/product/DeleteProductDialog";
import { fetchApi } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  price: string;
  stock: number;
  imageUrl: string;
  description?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // State for Edit/Delete Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { response, data } = await fetchApi("/api/products");
      if (response.ok && data.success) {
        // Adapt format to ProductCard props
        const mappedProducts = data.data.map((p: any) => ({
          id: p.id || p.product_id,
          name: p.name,
          price: `Rp ${Number(p.price).toLocaleString('id-ID')}`,
          stock: p.stock || 0,
          imageUrl: p.image_url || "https://placehold.co/400x400?text=No+Image",
          description: p.description,
        }));
        setProducts(mappedProducts);
      } else {
        console.error("Gagal memuat produk:", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEditClick = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if(p) {
      setSelectedProduct(p);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if(p) {
      setSelectedProduct(p);
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1440px] mx-auto pb-8">
      {/* Header Area with Filter and Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
          <CategoryFilter />
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 active:scale-95 transition-all hover:bg-primary-hover w-full md:w-auto"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_box</span>
          Tambah Produk
        </button>
      </div>
      
      {/* Content Area */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh] text-text-secondary flex-col gap-3">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
          <p className="font-semibold text-sm">Memuat Katalog Produk...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center min-h-[40vh] bg-card rounded-3xl border border-border-default flex-col gap-4 text-center p-8 shadow-sm">
          <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center border border-border-soft mb-2">
             <span className="material-symbols-outlined text-3xl text-text-muted">inventory_2</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-1">Katalog Masih Kosong</h3>
            <p className="text-sm text-text-secondary max-w-sm">Anda belum menambahkan produk apapun. Silakan tambah produk pertama Anda untuk mulai berjualan.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2 px-6 py-2.5 bg-background border border-border-default rounded-xl font-bold text-sm hover:bg-border-soft transition-colors"
          >
            Tambah Produk Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={loadProducts}
      />

      <EditProductModal 
        isOpen={isEditModalOpen}
        productId={selectedProduct?.id || ""}
        initialData={selectedProduct ? {
          name: selectedProduct.name,
          price: selectedProduct.price,
          stock: selectedProduct.stock,
          description: selectedProduct.description,
          imageUrl: selectedProduct.imageUrl,
        } : null}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadProducts}
      />

      <DeleteProductDialog 
        isOpen={isDeleteDialogOpen}
        productId={selectedProduct?.id || ""}
        productName={selectedProduct?.name || ""}
        onClose={() => setIsDeleteDialogOpen(false)}
        onSuccess={loadProducts}
      />
    </div>
  );
}
