"use client";
import { useState } from "react";
import Link from "next/link";
import OrderDetailModal from "@/components/history/OrderDetailModal";
import EditOrderModal from "@/components/history/EditOrderModal";
import { type MappedOrder } from "@/lib/orderUtils";

type RecentOrdersProps = {
  orders?: MappedOrder[];
  onRefresh?: () => void;
};

export default function RecentOrders({ orders, onRefresh }: RecentOrdersProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  // Fallback data if orders are missing
  const data = orders && orders.length > 0 ? orders : [];

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

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-text-muted">
          <span className="material-symbols-outlined text-[40px] mb-2 opacity-30">receipt_long</span>
          <p className="text-sm">Belum ada pesanan terbaru</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead>
              <tr className="text-[11px] text-text-muted border-b border-border-soft">
                <th className="pb-4 font-semibold font-sans w-20">Order ID</th>
                <th className="pb-4 font-semibold font-sans w-1/3">Nama Produk</th>
                <th className="pb-4 font-semibold font-sans">Tanggal</th>
                <th className="pb-4 font-semibold font-sans">Total Tagihan</th>
                <th className="pb-4 font-semibold font-sans">Status</th>
                <th className="pb-4 font-semibold font-sans text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order, idx) => (
                <tr 
                  key={idx} 
                  className="border-b border-border-soft/50 last:border-0 hover:bg-background/50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (order.rawId) setSelectedOrderId(order.rawId);
                  }}
                >
                  <td className="py-4 text-xs font-bold text-text-primary align-middle">
                    <span className="bg-background border border-border-soft px-2 py-1 rounded-md">{order.id}</span>
                  </td>
                  <td className="py-4 text-xs font-bold text-text-primary align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-background flex shrink-0 items-center justify-center border border-border-soft">
                        <span className="material-symbols-outlined text-[16px] text-primary">{order.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="line-clamp-1 text-sm">{order.product}</span>
                        {order.items && order.items.length > 1 && (
                          <span className="text-[10px] text-text-muted font-medium mt-0.5">
                            + {order.items.length - 1} produk lainnya
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-semibold text-text-secondary align-middle">{order.date}</td>
                  <td className="py-4 text-sm font-bold text-primary align-middle">
                    {order.amount}
                  </td>
                  <td className="py-4 align-middle">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      order.statusColor === 'info' ? 'bg-info/10 text-info' :
                      order.statusColor === 'success' ? 'bg-success/10 text-success' :
                      order.statusColor === 'warning' ? 'bg-amber-100 text-amber-600' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 align-middle text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (order.rawId) setSelectedOrderId(order.rawId);
                      }}
                      className="p-1.5 rounded-lg bg-background hover:bg-primary hover:text-white border border-border-soft hover:border-primary transition-colors text-text-secondary"
                    >
                      <span className="material-symbols-outlined text-[18px] block">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrderId && (
        <OrderDetailModal 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
          onEdit={(order) => {
            setSelectedOrderId(null);
            setEditingOrder(order);
          }}
          onRefresh={onRefresh ? onRefresh : () => {}}
        />
      )}

      {editingOrder && (
        <EditOrderModal 
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onRefresh={onRefresh ? onRefresh : () => {}}
        />
      )}
    </div>
  );
}
