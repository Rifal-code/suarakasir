"use client";

import { useState } from "react";
import OrderPanel from "@/components/transaction/OrderPanel";

const categories = [
  { name: "Semua", icon: "category" },
  { name: "Makanan", icon: "restaurant" },
  { name: "Minuman", icon: "local_cafe" },
  { name: "Snack", icon: "cookie" },
  { name: "Dessert", icon: "cake" },
];

const products = [
  { id: 1, name: "Ayam Bakar Madu", price: 35000, category: "Makanan", stock: 24 },
  { id: 2, name: "Nasi Goreng Spesial", price: 28000, category: "Makanan", stock: 18 },
  { id: 3, name: "Es Kopi Susu Gula Aren", price: 18000, category: "Minuman", stock: 50 },
  { id: 4, name: "Salad Buah Segar", price: 25000, category: "Makanan", stock: 12 },
  { id: 5, name: "Thai Tea", price: 15000, category: "Minuman", stock: 30 },
  { id: 6, name: "Roti Bakar Coklat", price: 22000, category: "Snack", stock: 15 },
  { id: 7, name: "Mie Goreng Jawa", price: 26000, category: "Makanan", stock: 20 },
  { id: 8, name: "Matcha Latte", price: 22000, category: "Minuman", stock: 25 },
  { id: 9, name: "Pisang Goreng Keju", price: 18000, category: "Snack", stock: 35 },
  { id: 10, name: "Puding Caramel", price: 20000, category: "Dessert", stock: 10 },
  { id: 11, name: "Es Jeruk Segar", price: 12000, category: "Minuman", stock: 40 },
  { id: 12, name: "Sate Ayam 10 Tusuk", price: 32000, category: "Makanan", stock: 16 },
];

export default function TransactionPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === "Semua" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)] -mx-6 md:-mx-10">
      
      {/* Left: Product Catalog */}
      <div className="flex-1 flex flex-col px-6 md:px-10 overflow-hidden">
        
        {/* Mobile Search */}
        <div className="md:hidden mb-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">search</span>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card pl-12 pr-4 py-3 rounded-2xl border border-border-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat.name
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-card text-text-secondary border border-border-soft hover:border-primary/30 hover:text-primary"
              }`}
            >
              <span 
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: activeCategory === cat.name ? "'FILL' 1" : "'FILL' 0" }}
              >
                {cat.icon}
              </span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                className="bg-card rounded-2xl p-4 border border-border-soft hover:border-primary/30 hover:shadow-md transition-all duration-200 text-left group active:scale-[0.97] flex flex-col"
              >
                <div className="bg-background rounded-xl aspect-square flex items-center justify-center mb-3 relative overflow-hidden">
                  <span className="material-symbols-outlined text-[48px] text-border-default group-hover:text-primary/30 transition-colors">
                    {product.category === "Makanan" ? "restaurant" : 
                     product.category === "Minuman" ? "local_cafe" : 
                     product.category === "Snack" ? "cookie" : "cake"}
                  </span>
                  <span className="absolute top-2 right-2 text-[9px] bg-white/90 backdrop-blur px-1.5 py-0.5 rounded-md font-bold text-text-secondary shadow-sm">
                    {product.stock}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-text-primary line-clamp-2 leading-snug">{product.name}</h3>
                <p className="text-[10px] text-text-muted mt-1">{product.category}</p>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <span className="text-sm font-bold text-primary">{formatRupiah(product.price)}</span>
                  <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Order Panel (Desktop) */}
      <div className="hidden xl:flex">
        <OrderPanel />
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
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      {/* Mobile: Slide-up Order Panel */}
      {showPanel && (
        <div className="xl:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPanel(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 h-[85vh] animate-in slide-in-from-bottom duration-300">
            <div className="relative h-full">
              <button 
                onClick={() => setShowPanel(false)} 
                className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <OrderPanel />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
