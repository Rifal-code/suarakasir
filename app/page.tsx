"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCard from "@/components/dashboard/SummaryCard";
import BarChartCard from "@/components/dashboard/BarChartCard";
import DonutChartCard from "@/components/dashboard/DonutChartCard";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopSellingCard from "@/components/dashboard/TopSellingCard";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { mapApiOrder } from "@/lib/orderUtils";
import { useToast } from "@/components/ui/ToastContext";

import { SkeletonSummaryCard, SkeletonBarChart, SkeletonTable } from "@/components/ui/SkeletonCards";

export default function Dashboard() {
  const [range, setRange] = useState("7d");
  const toast = useToast();

  const dashboardFetcher = async ([_, r]: [string, string]) => {
    const [dashboardRes, trendsRes, salesRes, ordersRes, topRes] = await Promise.all([
      fetchApi("/api/dashboard"),
      fetchApi(`/api/dashboard/trends?range=${r}`),
      fetchApi(`/api/dashboard/sales?range=${r}`),
      fetchApi("/api/orders?limit=5"),
      fetchApi(`/api/dashboard/top-products?range=${r}`)
    ]);

    if (!dashboardRes.response.ok) throw new Error("Gagal memuat data dashboard.");

    return {
      overview: dashboardRes.data?.data || null,
      trends: trendsRes.data?.data || null,
      sales: salesRes.data?.data || null,
      orders: ordersRes.data?.data || [],
      topProducts: topRes.data?.data || []
    };
  };

  const { data, error, isLoading: loading, mutate } = useSWR(["dashboard_data", range], dashboardFetcher, {
    onError: () => toast.error("Gagal memuat data dashboard.")
  });

  if (loading && !data) {
    return (
      <div className="animate-in fade-in duration-500 w-full">
        <DashboardHeader range={range} onRangeChange={setRange} />
        
        {/* Row 1: Stats and Charts Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 mb-6">
          <div className="flex flex-col gap-6 xl:col-span-4 h-full">
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
          </div>
          <div className="xl:col-span-8 h-full min-h-[350px]">
            <SkeletonBarChart />
          </div>
        </div>

        {/* Row 2: Detail Data Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8">
            <SkeletonTable />
          </div>
          <div className="xl:col-span-4">
            {/* TopSellingCard Skeleton can just reuse a generic block or table skeleton */}
            <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm animate-pulse h-full min-h-[300px]">
              <div className="h-5 bg-border-default rounded w-40 mb-2"></div>
              <div className="h-3 bg-border-default rounded w-64 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-border-default rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-border-default rounded w-3/4"></div>
                      <div className="h-3 bg-border-default rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

    const sales = Number(item.total_sales) || 0;
    return {
      label: labelText,
      solid: sales === 0 ? 0 : Math.max(10, (sales / maxSales) * 100),
      striped: 100
    };
  });

  // 2. Recent Orders (using shared utility)
  const recentOrders = Array.isArray(data?.orders)
    ? data.orders.map((o: any) => mapApiOrder(o, 'short'))
    : undefined;

  return (
    <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-opacity`}>
      <DashboardHeader range={range} onRangeChange={setRange} />

      {/* Row 1: KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        
        {/* Left: Donut Chart (4/12) */}
        <div className="xl:col-span-4 h-full min-h-[350px]">
          <DonutChartCard products={data?.topProducts} />
        </div>

        {/* Right: Bar Chart (8/12) */}
        <div className="xl:col-span-8 h-full min-h-[350px]">
          <BarChartCard
            totalSales={formatRp(data?.trends?.current_sales || 0)}
            trend={`${data?.trends?.sales_growth_pct || 0}%`}
            isTrendUp={data?.trends?.sales_trend === "up"}
            chartData={chartData}
          />
        </div>

      </div>

      {/* Row 3: Detail Data */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left Column: Recent Orders (8/12) */}
        <div className="xl:col-span-8">
          <RecentOrders orders={recentOrders} onRefresh={() => mutate()} />
        </div>

        {/* Right Column: Top Selling (4/12) */}
        <div className="xl:col-span-4">
          <TopSellingCard products={data?.topProducts} />
        </div>
      </div>
    </div>
  );
}
