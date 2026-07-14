"use client";

import React, { useState } from "react";
import { fetchApi, swrFetcher } from "@/lib/api";
import { mapApiOrder, type MappedOrder, type OrderItem } from "@/lib/orderUtils";
import useSWR, { mutate } from "swr";
import { useToast } from "@/components/ui/ToastContext";
import OrderDetailModal from "@/components/history/OrderDetailModal";
import EditOrderModal from "@/components/history/EditOrderModal";
import OrderFilter, { type FilterState } from "@/components/history/OrderFilter";
import Pagination from "@/components/ui/Pagination";

import { SkeletonTable } from "@/components/ui/SkeletonCards";

export default function HistoryPage() {
  const toast = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    dateRange: "all",
    product: "all",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const hasActiveLocalFilters = searchQuery !== "" || filters.product !== "all" || filters.status !== "all" || filters.dateRange !== "all";

  // Build query string for SWR API request
  const queryParams = new URLSearchParams();
  
  if (hasActiveLocalFilters) {
    // If filtering locally, get a larger batch so we can filter and paginate on client-side
    queryParams.append("page", "1");
    queryParams.append("limit", "200");
  } else {
    // Server-side pagination
    queryParams.append("page", currentPage.toString());
    queryParams.append("limit", itemsPerPage.toString());
  }

  const { data: swrData, isLoading: loading, mutate: mutateCurrent } = useSWR(
    `/api/orders?${queryParams.toString()}`,
    swrFetcher,
    {
      keepPreviousData: true,
      onError: () => toast.error("Gagal memuat riwayat transaksi.")
    }
  );

  const { data: productsData } = useSWR("/api/products", swrFetcher);

  const handleRefresh = () => {
    mutateCurrent();
    mutate("/api/dashboard");
  };

  const handleMarkComplete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (updatingOrderId) return;
    setUpdatingOrderId(id);
    try {
      // Fetch order detail to get items (PUT requires items)
      const { response: detailRes, data: detailData } = await fetchApi(`/api/orders/${id}`);
      if (!detailRes.ok || !detailData.success) {
        toast.error("Gagal memuat detail pesanan.");
        return;
      }
      const itemsPayload = (detailData.data.items || []).map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));
      const { response, data } = await fetchApi(`/api/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ items: itemsPayload, status: 1 })
      });
      if (response.ok && data.success) {
        toast.success("Pesanan berhasil ditandai lunas.");
        handleRefresh();
      } else {
        toast.error(data.message || "Gagal mengubah status pesanan.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const orders: MappedOrder[] = swrData
    ? swrData.data.map((o: any) => mapApiOrder(o, 'full'))
    : [];
    
  // Extract products from database catalog for filter dropdown
  const availableProducts = productsData?.data
    ? productsData.data.map((p: any) => p.name).filter(Boolean).sort()
    : [];

  // Apply all filters client-side
  const filteredOrders = orders.filter(o => {
    // Status Filter
    if (filters.status !== "all") {
      const expectedRawStatus = filters.status === "selesai" ? 1 : 0;
      if (o.rawStatus !== expectedRawStatus) return false;
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchSearch = o.id.toLowerCase().includes(query) || 
                          (o.items && o.items.some(i => i.product_name.toLowerCase().includes(query)));
      if (!matchSearch) return false;
    }
    
    // Product Filter
    if (filters.product !== "all" && !o.items.some(i => i.product_name === filters.product)) return false;

    // Date Range Filter
    if (filters.dateRange !== "all") {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filters.dateRange === "today") {
        if (orderDate < todayStart) return false;
      } else if (filters.dateRange === "7d") {
        const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (orderDate < sevenDaysAgo) return false;
      } else if (filters.dateRange === "30d") {
        const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (orderDate < thirtyDaysAgo) return false;
      }
    }
    
    return true;
  });

  // Calculate pages and slices
  const totalPages = hasActiveLocalFilters
    ? Math.ceil(filteredOrders.length / itemsPerPage)
    : Math.ceil((swrData?.total || 0) / itemsPerPage);

  const paginatedOrders = hasActiveLocalFilters
    ? filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredOrders; // Already filtered and paginated by server

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto w-full">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Riwayat Transaksi</h2>
          <p className="text-sm text-text-secondary mt-1">Daftar lengkap riwayat pesanan dan transaksi Anda.</p>
        </div>
        
        <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-3">
          <div className="w-full md:w-auto">
            <OrderFilter 
              filters={filters} 
              onChange={setFilters} 
              availableProducts={availableProducts} 
            />
          </div>
          <div className="relative w-full md:w-64 shrink-0">
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

      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border-soft shadow-sm min-h-[50vh] flex flex-col">
        {loading ? (
          <SkeletonTable />
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
                  <th className="pb-4 font-semibold font-sans whitespace-nowrap">Tanggal</th>
                  <th className="pb-4 font-semibold font-sans whitespace-nowrap">Total Tagihan</th>
                  <th className="pb-4 font-semibold font-sans">Status</th>
                  <th className="pb-4 font-semibold font-sans text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, idx) => (
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
                    <td className="py-4 text-xs font-semibold text-text-secondary align-middle whitespace-nowrap">{order.date}</td>
                    <td className="py-4 text-sm font-bold text-primary align-middle whitespace-nowrap">
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
                      <div className="flex items-center justify-end gap-2">
                        {order.rawStatus === 0 && (
                          <button
                            onClick={(e) => handleMarkComplete(e, order.rawId)}
                            disabled={updatingOrderId === order.rawId}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              updatingOrderId === order.rawId
                                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                : "bg-green-50 text-green-600 hover:bg-green-500 hover:text-white border border-green-200 hover:border-green-500"
                            }`}
                            title="Tandai Lunas"
                          >
                            {updatingOrderId === order.rawId ? (
                              <span className="material-symbols-outlined text-[18px] block animate-spin">progress_activity</span>
                            ) : (
                              <span className="material-symbols-outlined text-[18px] block">check</span>
                            )}
                          </button>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderId(order.rawId);
                          }}
                          className="p-1.5 rounded-lg bg-background hover:bg-primary hover:text-white border border-border-soft hover:border-primary transition-colors text-text-secondary cursor-pointer"
                          title="Detail Pesanan"
                        >
                          <span className="material-symbols-outlined text-[18px] block">chevron_right</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
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
          onRefresh={handleRefresh}
        />
      )}

      {editingOrder && (
        <EditOrderModal 
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onRefresh={handleRefresh}
        />
      )}

    </div>
  );
}
