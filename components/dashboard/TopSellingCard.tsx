type TopProduct = {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_revenue: string;
};

type TopSellingCardProps = {
  products?: TopProduct[];
};

export default function TopSellingCard({ products }: TopSellingCardProps) {
  // Map API response to the required format, or use fallback
  const topProducts = products && products.length > 0 
    ? products.map((p, idx) => ({
        id: idx + 1,
        name: p.product_name,
        sales: `${p.total_quantity} items`,
        revenue: `Rp ${Number(p.total_revenue).toLocaleString('id-ID')}`,
        icon: "inventory_2"
      }))
    : [
        { id: 1, name: "Data Kosong", sales: "-", revenue: "-", icon: "error" },
      ];

  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-text-primary">Produk Terlaris</h3>
        <button className="text-text-secondary hover:text-text-primary text-xs font-semibold">Lihat Semua</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="flex flex-col gap-4">
          {topProducts.map((product) => (
            <div key={product.id} className="flex items-center gap-4 group cursor-pointer hover:bg-background/50 p-2 -mx-2 rounded-xl transition-colors">
              <div className="w-12 h-12 bg-background rounded-2xl flex items-center justify-center font-bold text-lg text-text-primary border border-border-soft group-hover:border-primary/30 transition-colors">
                <span className="material-symbols-outlined text-primary">{product.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-text-primary line-clamp-1">{product.name}</h4>
                <p className="text-[11px] font-semibold text-text-secondary mt-0.5">{product.sales}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">{product.revenue}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[12px] text-success">trending_up</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
