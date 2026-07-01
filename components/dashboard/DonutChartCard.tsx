import React from "react";

type Product = {
  product_id?: string;
  product_name: string;
  total_quantity: number;
  total_revenue: string | number;
};

interface DonutChartCardProps {
  products?: Product[];
}

export default function DonutChartCard({ products }: DonutChartCardProps) {
  const formatRp = (amount: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  const top4 = (products || []).slice(0, 4);
  const totalQty = top4.reduce((sum, p) => sum + Number(p.total_quantity), 0);
  const totalSalesTop4 = top4.reduce((sum, p) => sum + Number(p.total_revenue), 0);

  const colors = ["#ff3f1a", "#1a1a1a", "#f59e0b", "#10b981"]; // Primary, Sidebar, Amber, Emerald
  const bgClasses = ["bg-primary", "bg-sidebar", "bg-amber-500", "bg-emerald-500"];

  let currentPercentage = 0;
  const gradientStops = top4.map((p, i) => {
    const percentage = totalQty > 0 ? (Number(p.total_quantity) / totalQty) * 100 : 0;
    const stop = `${colors[i]} ${currentPercentage}% ${currentPercentage + percentage}%`;
    currentPercentage += percentage;
    return stop;
  }).join(", ");

  const conicGradient = totalQty > 0 ? `conic-gradient(${gradientStops})` : 'conic-gradient(#e5e7eb 0% 100%)';

  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm h-full flex flex-col relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Proporsi Produk Terlaris</h3>
        <span className="material-symbols-outlined text-text-muted text-[18px]">pie_chart</span>
      </div>

      {top4.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-text-muted text-sm font-medium">
          Belum ada data penjualan
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-between gap-6 mt-2">
          {/* Donut Chart using Conic Gradient */}
          <div 
            className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 hover:scale-105"
            style={{ background: conicGradient }}
          >
            {/* Inner Content (Hole) */}
            <div className="text-center z-10 bg-white w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-inner">
              <p className="text-xs text-text-secondary mb-0.5">Total Qty</p>
              <p className="text-xl font-black text-text-primary">{totalQty}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-3 mt-4">
            {top4.map((p, i) => {
              const percentage = Math.round((Number(p.total_quantity) / totalQty) * 100);
              return (
                <div key={i} className="flex flex-col gap-1 group">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${bgClasses[i]} shadow-sm group-hover:scale-125 transition-transform`}></div>
                    <span className="text-[11px] text-text-secondary font-semibold truncate" title={p.product_name}>
                      {p.product_name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 pl-4">
                    <span className="text-[13px] font-bold text-text-primary">{percentage}%</span>
                    <span className="text-[9px] text-text-muted">({p.total_quantity})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
