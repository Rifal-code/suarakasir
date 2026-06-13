"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";

type OrderItem = {
  product_name: string;
  quantity: number;
};

type Order = {
  id: string;
  product: string;
  items?: OrderItem[];
  date: string;
  payment: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: string;
};

export default function HistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await fetchApi("/api/orders?limit=100");
        if (data && data.success) {
          const mapped = data.data.map((o: any) => ({
            id: `#${o.id?.substring(0,6) || 'XXXX'}`,
            product: o.items?.[0]?.product_name || "Produk",
            items: o.items || [],
            date: new Date(o.created_at || Date.now()).toLocaleDateString('id-ID'),
            payment: "Kasir",
            amount: `Rp ${Number(o.total_amount).toLocaleString('id-ID')}`,
            status: "Selesai",
            statusColor: "success",
            icon: "receipt_long"
          }));
          setOrders(mapped);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (o.items && o.items.some(i => i.product_name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto w-full">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Riwayat Transaksi</h2>
          <p className="text-sm text-text-secondary mt-1">Daftar lengkap riwayat pesanan dan transaksi Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
            <input 
              type="text" 
              placeholder="Cari ID atau nama produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-10 pr-4 py-2 rounded-full border border-border-default focus:outline-none focus:border-primary text-sm shadow-sm"
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
          <div className="flex flex-col items-center justify-center h-full text-text-muted">
            <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">receipt_long</span>
            <p>Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-[12px] text-text-muted border-b border-border-soft">
                  <th className="pb-4 font-semibold font-sans">Order ID</th>
                  <th className="pb-4 font-semibold font-sans w-1/3">Nama Produk</th>
                  <th className="pb-4 font-semibold font-sans">Tanggal</th>
                  <th className="pb-4 font-semibold font-sans">Pembayaran</th>
                  <th className="pb-4 font-semibold font-sans">Jumlah</th>
                  <th className="pb-4 font-semibold font-sans">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={idx} className="border-b border-border-soft/50 last:border-0 hover:bg-background/30 transition-colors">
                    <td className="py-4 text-sm font-bold text-text-primary align-top">{order.id}</td>
                    <td className="py-4 text-sm font-bold text-text-primary align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex shrink-0 items-center justify-center border border-border-soft">
                           <span className="material-symbols-outlined text-[20px] text-primary">{order.icon}</span>
                        </div>
                        <div className="flex flex-col w-full mt-1">
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
                              <span className={`material-symbols-outlined text-[18px] text-text-muted transition-transform duration-200 group-hover:text-primary ${expandedId === order.id ? 'rotate-180' : ''}`}>
                                keyboard_arrow_down
                              </span>
                            )}
                          </div>
                          
                          {/* Expanded Items */}
                          {expandedId === order.id && order.items && order.items.length > 1 && (
                            <div className="mt-2 pl-3 border-l-2 border-border-soft flex flex-col gap-1.5 animate-in slide-in-from-top-1 duration-200">
                              {order.items.slice(1).map((item, i) => (
                                <div key={i} className="text-xs font-medium text-text-secondary flex justify-between">
                                  <span className="line-clamp-1">{item.product_name}</span>
                                  <span className="text-text-muted shrink-0 ml-2">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-semibold text-text-secondary align-top mt-1 block">{order.date}</td>
                    <td className="py-4 text-sm font-semibold text-text-secondary align-top pt-5">{order.payment}</td>
                    <td className="py-4 text-sm font-bold text-text-primary align-top pt-5">{order.amount}</td>
                    <td className="py-4 align-top pt-5">
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                        order.statusColor === 'info' ? 'bg-info/10 text-info' :
                        order.statusColor === 'success' ? 'bg-success/10 text-success' :
                        'bg-danger/10 text-danger'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
