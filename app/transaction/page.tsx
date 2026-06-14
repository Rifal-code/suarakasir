"use client";

import { useState, useEffect } from "react";
import OrderPanel, { CartItemType } from "@/components/transaction/OrderPanel";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";

interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image_url: string | null;
  stock: number;
}

export default function TransactionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await fetchApi("/api/products?limit=100");
        if (data && data.success) {
          setProducts(data.data);
        } else {
          toast.error("Gagal memuat katalog produk");
        }
      } catch (error) {
        toast.error("Terjadi kesalahan saat memuat produk");
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  // Handle voice order items
  useEffect(() => {
    const handleVoiceOrder = () => {
      const pendingStr = sessionStorage.getItem("pending_voice_order");
      if (pendingStr && products.length > 0) {
        try {
          const items = JSON.parse(pendingStr);
          
          const newCartItems: CartItemType[] = items.map((item: any) => {
            const product = products.find(p => p.id === item.product_id);
            return {
              id: product ? product.id : item.product_id || Math.random().toString(),
              product_id: item.product_id,
              name: product ? product.name : item.name,
              price: product ? parseFloat(product.price) : parseFloat(item.unit_price || "0"),
              imageUrl: product ? (product.image_url || undefined) : undefined,
              qty: item.quantity,
              needsConfirmation: item.needs_confirmation
            };
          });

          setCart(prev => {
             const merged = [...prev];
             newCartItems.forEach(newItem => {
                const existing = merged.find(i => i.product_id === newItem.product_id);
                if (existing) { existing.qty += newItem.qty; }
                else { merged.push(newItem); }
             });
             return merged;
          });
          
          sessionStorage.removeItem("pending_voice_order");
          setShowPanel(true);
        } catch (e) {
          console.error("Failed to parse pending voice order", e);
        }
      }
    };

    // Run on initial load if products are ready
    handleVoiceOrder();
    
    // Also listen for event from ClientLayout
    window.addEventListener("voiceOrderReady", handleVoiceOrder);
    return () => window.removeEventListener("voiceOrderReady", handleVoiceOrder);
  }, [products]);

  const filteredProducts = products.filter(p => {
    // Currently, API doesn't seem to have a category field. We'll ignore category filter for now or mock it if needed.
    // Assuming we just filter by search query.
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          toast.error(`Stok ${product.name} tidak mencukupi (Tersedia: ${product.stock})`);
          return prev;
        }
        return prev.map(item =>
          item.product_id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        if (product.stock <= 0) {
          toast.error(`Stok ${product.name} habis`);
          return prev;
        }
        return [...prev, {
          id: product.id,
          product_id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          imageUrl: product.image_url || undefined,
          qty: 1
        }];
      }
    });
  };

  const updateCartQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeCartItem(id);
      return;
    }

    // Check stock limit
    const product = products.find(p => p.id === id);
    if (product && newQty > product.stock) {
      toast.error(`Stok ${product.name} tidak mencukupi (Tersedia: ${product.stock})`);
      return;
    }

    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeCartItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.qty
        }))
      };

      const { response, data } = await fetchApi("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (response.ok && data.success) {
        toast.success("Pesanan berhasil dibuat!");
        setCart([]);
        setShowPanel(false);
        // Refresh products to update stock
        const { data: updatedData } = await fetchApi("/api/products?limit=100");
        if (updatedData && updatedData.success) {
          setProducts(updatedData.data);
        }
      } else {
        toast.error(data.message || "Gagal membuat pesanan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan saat membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="flex gap-4 md:gap-6 h-[calc(100vh-100px)] w-full">
      {/* Left: Product Catalog */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">search</span>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card pl-12 pr-4 py-3 rounded-2xl border border-border-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-text-muted">
              <span className="material-symbols-outlined animate-spin text-[32px] mb-2">autorenew</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">inventory_2</span>
              <p>Produk tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0">
              {filteredProducts.map(product => {
                const cartItem = cart.find(item => item.product_id === product.id);
                const isInCart = !!cartItem;

                return (
                <div
                  key={product.id}
                  onClick={() => {
                    if (product.stock > 0) addToCart(product);
                  }}
                  className={`bg-white rounded-2xl flex flex-col group transition-all duration-300 hover:shadow-xl relative overflow-hidden ${product.stock <= 0
                    ? 'opacity-60 cursor-not-allowed border-2 border-border-default'
                    : isInCart
                      ? 'cursor-pointer border-2 border-primary shadow-lg shadow-primary/10'
                      : 'cursor-pointer border border-border-soft hover:border-primary/50'
                    }`}
                >
                  {/* In-Cart Badge + Remove */}
                  {isInCart && (
                    <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-bold shadow-md shadow-primary/30">
                        {cartItem.qty}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCartItem(product.id);
                        }}
                        className="w-6 h-6 bg-white/90 backdrop-blur-sm text-gray-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 active:scale-90"
                        title="Hapus dari keranjang"
                      >
                        <span className="material-symbols-outlined text-[14px] font-bold">close</span>
                      </button>
                    </div>
                  )}

                  {/* Image Area */}
                  <div className="relative aspect-[4/3] w-full bg-white border-b border-border-soft flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[48px] text-border-default">
                        inventory_2
                      </span>
                    )}

                    {/* Stock Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm leading-none bg-white text-text-primary`}>
                        {product.stock} stok
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-3 bg-sidebar flex flex-col flex-1 relative">
                    <h3 className="text-sm font-medium text-text-white line-clamp-2 leading-tight mb-2 pr-6">{product.name}</h3>

                    <div className="mt-auto flex items-end pt-1 pb-1">
                      <span className="text-base font-semibold text-text-white leading-none">{formatRupiah(parseFloat(product.price))}</span>
                    </div>

                    {/* Action Button (+) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock <= 0}
                      className={`absolute bottom-2 right-2 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10 ${product.stock <= 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-primary"
                        }`}
                    >
                      <span className="material-symbols-outlined text-[24px] font-bold">
                        {product.stock <= 0 ? 'block' : 'add'}
                      </span>
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Order Panel (Desktop) */}
      <div className="hidden xl:flex pb-4">
        <OrderPanel
          cart={cart}
          onUpdateQty={updateCartQty}
          onRemoveItem={removeCartItem}
          onCheckout={handleCheckout}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Mobile: Floating Cart Button */}
      <div className="xl:hidden fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all relative"
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            shopping_cart
          </span>
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile: Slide-up Order Panel */}
      {showPanel && (
        <div className="xl:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPanel(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 h-[85vh] animate-in slide-in-from-bottom duration-300">
            <div className="relative h-full bg-card rounded-t-3xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setShowPanel(false)}
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10 text-gray-800"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <OrderPanel
                cart={cart}
                onUpdateQty={updateCartQty}
                onRemoveItem={removeCartItem}
                onCheckout={handleCheckout}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
