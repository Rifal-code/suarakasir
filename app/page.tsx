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
  const [range, setRange] = useState("7d");

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [dashboardRes, trendsRes, salesRes, ordersRes, topRes] = await Promise.all([
          fetchApi("/api/dashboard"),
          fetchApi(`/api/dashboard/trends?range=${range}`),
          fetchApi(`/api/dashboard/sales?range=${range}`),
          fetchApi("/api/orders?limit=5"),
          fetchApi(`/api/dashboard/top-products?range=${range}`)
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
  }, [range]);

  if (loading && !data) {
    return <div className="flex items-center justify-center min-h-[50vh]">Loading Dashboard Data...</div>;
  }

  // Format currency
  const formatRp = (val: string | number) => `Rp ${Number(val || 0).toLocaleString('id-ID')}`;

  // 1. Bar Chart Data
  const rawSalesData = data?.sales?.data || [];
  const maxSales = rawSalesData.reduce((max: number, item: any) => Math.max(max, Number(item.total_sales)), 0) || 1; // avoid division by 0

  const chartData = rawSalesData.map((item: any) => {
    const d = new Date(item.label || Date.now());
    let labelText = '';
    
    if (range === '7d') {
      labelText = d.toLocaleDateString('id-ID', { weekday: 'short' });
    } else if (range === '30d') {
      labelText = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } else {
      labelText = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    }

    return {
      label: labelText,
      solid: Math.max(10, (Number(item.total_sales) / maxSales) * 100), 
      striped: 100
    };
  });

  // 2. Recent Orders
  const recentOrders = Array.isArray(data?.orders) ? data.orders.map((o: any) => ({
    id: `#${o.id?.substring(0,6) || 'XXXX'}`,
    product: o.items?.[0]?.product_name || "Produk",
    items: o.items || [],
    date: new Date(o.created_at || Date.now()).toLocaleDateString('id-ID'),
    price: formatRp(o.items?.[0]?.unit_price || 0),
    amount: formatRp(o.total_amount),
    status: "Selesai", // Dummy
    statusColor: "success",
    icon: "receipt_long"
  })) : undefined;

  return (
    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-opacity`}>
      <DashboardHeader range={range} onRangeChange={setRange} />

      {/* Row 1: Stats and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 mb-6">
        
        {/* Column 1: Stacked Summary Cards */}
        <div className="flex flex-col gap-6 xl:col-span-4 h-full">
          <SummaryCard 
            title="Total Penjualan Produk" 
            value={formatRp(data?.trends?.current_sales || 0)}
            trend={`${data?.trends?.sales_growth_pct || 0}%`}
            trendType={data?.trends?.sales_trend === "up" ? "up" : "down"}
            icon="payments"
            linkText="Lihat Laporan"
            href="/history"
          />
          <SummaryCard 
            title="Total Transaksi" 
            value={`${data?.trends?.current_orders || 0} Trx`}
            trend={`${data?.trends?.order_growth_pct || 0}%`}
            trendType={data?.trends?.order_trend === "up" ? "up" : "down"}
            icon="receipt_long"
            linkText="Lihat Riwayat Transaksi"
            href="/history"
          />
        </div>

        {/* Column 2: Bar Chart */}
        <div className="xl:col-span-8 h-full min-h-[350px]">
          <BarChartCard 
            totalSales={formatRp(data?.trends?.current_sales || 0)}
            trend={`${data?.trends?.sales_growth_pct || 0}%`}
            isTrendUp={data?.trends?.sales_trend === "up"}
            chartData={chartData}
          />
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
