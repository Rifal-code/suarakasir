"use client";
import { useState } from "react";
import Link from "next/link";

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price?: number;
};

type Order = {
  id: string;
  product: string;
  items?: OrderItem[];
  date: string;
  price: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: string;
};

type RecentOrdersProps = {
  orders?: Order[];
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Fallback data if orders are missing
  const data = orders && orders.length > 0 ? orders : [
    { id: "#202523", product: "Data Kosong/Error API", items: [], date: "-", price: "Rp 0", amount: "Rp 0", status: "Error", statusColor: "danger", icon: "error" },
  ];

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm h-full">
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Pesanan Terbaru</h3>
          <p className="text-xs text-text-secondary mt-1">Lacak data pesanan terbaru dan informasi lainnya.</p>
        </div>
        <Link href="/history" className="flex shrink-0 items-center gap-1 px-4 py-2 bg-background border border-border-default rounded-full text-xs font-semibold hover:bg-border-soft transition-colors text-text-primary">
          Lihat Semua
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      <div className="md:hidden flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full w-fit mb-3 animate-pulse">
        <span className="material-symbols-outlined text-[14px]">swipe</span>
        Geser tabel untuk melihat detail
      </div>

      <div className="overflow-x-auto pb-2">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <thead>
            <tr className="text-[11px] text-text-muted border-b border-border-soft">
              <th className="pb-4 font-semibold font-sans">Order ID</th>
              <th className="pb-4 font-semibold font-sans">Nama Produk</th>
              <th className="pb-4 font-semibold font-sans">Tanggal</th>
              <th className="pb-4 font-semibold font-sans">Harga</th>
              <th className="pb-4 font-semibold font-sans">Total</th>
              <th className="pb-4 font-semibold font-sans">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, idx) => (
              <tr key={idx} className="border-b border-border-soft/50 last:border-0 hover:bg-background/30 transition-colors">
                <td className="py-4 text-xs font-bold text-text-primary align-top">{order.id}</td>
                <td className="py-4 text-xs font-bold text-text-primary align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-background flex shrink-0 items-center justify-center border border-border-soft">
                      <span className="material-symbols-outlined text-[16px] text-primary">{order.icon}</span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div
                        className={`flex items-center gap-1 cursor-pointer select-none group ${(order.items && order.items.length > 1) ? 'hover:text-primary' : ''}`}
                        onClick={() => {
                          if (order.items && order.items.length > 1) {
                            toggleExpand(order.id);
                          }
                        }}
                      >
                        <span className="line-clamp-1">{order.product}</span>
                        {order.items && order.items.length > 1 && (
                          <span className={`material-symbols-outlined text-[16px] text-text-muted transition-transform duration-200 group-hover:text-primary ${expandedId === order.id ? 'rotate-180' : ''}`}>
                            keyboard_arrow_down
                          </span>
                        )}
                      </div>

                      {/* Expanded Items Name */}
                      {expandedId === order.id && order.items && order.items.length > 1 && (
                        <div className="mt-2 pl-2 border-l-2 border-border-soft flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-200">
                          {order.items.slice(1).map((item, i) => (
                            <div key={i} className="text-[11px] font-medium text-text-secondary flex justify-between h-[16px] items-center">
                              <span className="line-clamp-1">{item.product_name}</span>
                              <span className="text-text-muted shrink-0 ml-2">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 text-xs font-semibold text-text-secondary align-top">{order.date}</td>
                <td className="py-4 text-xs font-bold text-text-primary align-top">
                  <div className="flex items-center h-[20px]">{order.price}</div>
                  {/* Expanded Items Price */}
                  {expandedId === order.id && order.items && order.items.length > 1 && (
                    <div className="mt-2 flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-200">
                      {order.items.slice(1).map((item, i) => (
                        <div key={i} className="text-[11px] font-medium text-text-secondary h-[16px] flex items-center">
                          Rp {Number(item.unit_price || 0).toLocaleString('id-ID')}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="py-4 text-xs font-bold text-text-primary align-top">
                  <div className="flex items-center h-[20px]">{order.amount}</div>
                </td>
                <td className="py-4 align-top">
                  <div className="flex items-center h-[20px]">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.statusColor === 'info' ? 'bg-info/10 text-info' :
                        order.statusColor === 'success' ? 'bg-success/10 text-success' :
                          'bg-danger/10 text-danger'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
