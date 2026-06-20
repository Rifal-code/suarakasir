"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchApi } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";
import OrderDetailModal from "@/components/history/OrderDetailModal";
import EditOrderModal from "@/components/history/EditOrderModal";

type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price?: number;
};

type Order = {
  id: string;
  rawId: string;
  product: string;
  items?: OrderItem[];
  date: string;
  price: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: string;
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchApi("/api/orders?limit=100");
      if (data && data.success) {
        const mapped = data.data.map((o: any) => ({
          id: `#${o.id?.substring(0,6) || 'XXXX'}`,
          rawId: o.id,
          product: o.items?.[0]?.product_name || "Produk",
          items: o.items || [],
          date: new Date(o.created_at || Date.now()).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          price: `Rp ${Number(o.items?.[0]?.unit_price || 0).toLocaleString('id-ID')}`,
          amount: `Rp ${Number(o.total_amount).toLocaleString('id-ID')}`,
          status: "Selesai",
          statusColor: "success",
          icon: "receipt_long"
        }));
        setOrders(mapped);
      }
    } catch (error) {
      console.error("Gagal memuat riwayat", error);
      toast.error("Gagal memuat riwayat transaksi.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (o.items && o.items.some(i => i.product_name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto w-full">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Riwayat Transaksi</h2>
          <p className="text-sm text-text-secondary mt-1">Daftar lengkap riwayat pesanan dan transaksi Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
            <input 
              type="text" 
              placeholder="Cari ID atau nama produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2.5 rounded-full border border-border-soft focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border-soft shadow-sm min-h-[50vh]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-text-muted flex-col gap-2">
            <span className="material-symbols-outlined animate-spin text-[32px]">autorenew</span>
            <span className="text-sm">Memuat data transaksi...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[40vh] text-text-muted">
            <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">receipt_long</span>
            <p>Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="md:hidden flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full w-fit mb-3 animate-pulse">
              <span className="material-symbols-outlined text-[14px]">swipe</span>
              Geser tabel untuk melihat detail
            </div>
            
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-[12px] text-text-muted border-b border-border-soft">
                  <th className="pb-4 font-semibold font-sans w-24">Order ID</th>
                  <th className="pb-4 font-semibold font-sans w-1/3">Nama Produk</th>
                  <th className="pb-4 font-semibold font-sans">Tanggal</th>
                  <th className="pb-4 font-semibold font-sans">Total Tagihan</th>
                  <th className="pb-4 font-semibold font-sans">Status</th>
                  <th className="pb-4 font-semibold font-sans text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-border-soft/50 last:border-0 hover:bg-background/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrderId(order.rawId)}
                  >
                    <td className="py-4 text-xs font-bold text-text-primary align-middle">
                      <span className="bg-background border border-border-soft px-2 py-1 rounded-md">{order.id}</span>
                    </td>
                    <td className="py-4 text-xs font-bold text-text-primary align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-background flex shrink-0 items-center justify-center border border-border-soft">
                           <span className="material-symbols-outlined text-[18px] text-primary">{order.icon}</span>
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
                        'bg-danger/10 text-danger'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 align-middle text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrderId(order.rawId);
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
        </div>
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailModal 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
          onEdit={(order) => {
            setSelectedOrderId(null);
            setEditingOrder(order);
          }}
          onRefresh={loadOrders}
        />
      )}

      {editingOrder && (
        <EditOrderModal 
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onRefresh={loadOrders}
        />
      )}

    </div>
  );
}
