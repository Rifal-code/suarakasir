"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCard from "@/components/dashboard/SummaryCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import DonutChartCard from "@/components/dashboard/DonutChartCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopSellingCard from "@/components/dashboard/TopSellingCard";
import { fetchApi } from "@/lib/api";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [dashboardRes, trendsRes, salesRes, ordersRes, topRes] = await Promise.all([
          fetchApi("/api/dashboard"),
          fetchApi("/api/dashboard/trends?range=7d"),
          fetchApi("/api/dashboard/sales?range=7d"),
          fetchApi("/api/orders?limit=5"),
          fetchApi("/api/dashboard/top-products?range=30d")
        ]);

        setData({
          overview: dashboardRes.data?.data || null,
          trends: trendsRes.data?.data || null,
          sales: salesRes.data?.data || null,
          orders: ordersRes.data?.data || [],
          topProducts: topRes.data?.data || []
        });
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[50vh]">Loading Dashboard Data...</div>;
  }

  // Format currency
  const formatRp = (val: string | number) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

  // Mapping API response to Component props
  // 1. Bar Chart Data
  const chartData = data?.sales?.data?.map((item: any) => ({
    label: new Date(item.label).toLocaleDateString('id-ID', { weekday: 'short' }),
    solid: Math.min(100, Math.max(10, (Number(item.total_sales) / 5000000) * 100)), // dummy scale calculation
    striped: 100
  })) || [];

  // 2. Recent Orders
  const recentOrders = Array.isArray(data?.orders) ? data.orders.map((o: any) => ({
    id: `#${o.id?.substring(0,6) || 'XXXX'}`,
    product: o.items?.[0]?.product_name || "Produk",
    date: new Date(o.created_at || Date.now()).toLocaleDateString('id-ID'),
    payment: "Kasir",
    amount: formatRp(o.total_amount),
    status: "Selesai", // Dummy
    statusColor: "success",
    icon: "receipt_long"
  })) : undefined;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DashboardHeader />

      {/* Row 1: Stats and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 mb-6">
        
        {/* Column 1: Stacked Summary Cards */}
        <div className="flex flex-col gap-6 xl:col-span-3 h-full">
          <SummaryCard 
            title="Total Penjualan Produk" 
            value={formatRp(data?.trends?.current_sales || 0)}
            trend={`${data?.trends?.sales_growth_pct || 0}%`}
            trendType={data?.trends?.sales_trend === "up" ? "up" : "down"}
            icon="payments"
            linkText="Lihat Laporan"
          />
          <SummaryCard 
            title="Total Volume Produk" 
            value={`${data?.trends?.current_orders || 0} Trx`}
            trend={`${data?.trends?.order_growth_pct || 0}%`}
            trendType={data?.trends?.order_trend === "up" ? "up" : "down"}
            icon="inventory_2"
            linkText="Lihat Stok Produk"
          />
        </div>

        {/* Column 2: Bar Chart */}
        <div className="xl:col-span-5 h-full min-h-[350px]">
          <BarChartCard 
            totalSales={formatRp(data?.trends?.current_sales || 0)}
            trend={`${data?.trends?.sales_growth_pct || 0}%`}
            isTrendUp={data?.trends?.sales_trend === "up"}
            chartData={chartData}
          />
        </div>
        
        {/* Column 3: Donut Chart */}
        <div className="xl:col-span-4 h-full min-h-[350px]">
          <DonutChartCard />
        </div>
        
      </div>

      {/* Row 2: Detail Data */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column (65%) */}
        <div className="xl:col-span-8">
          <RecentOrders orders={recentOrders} />
        </div>

        {/* Right Column (35%) */}
        <div className="xl:col-span-4">
          <TopSellingCard products={data?.topProducts} />
        </div>
        
      </div>
    </div>
  );
}
