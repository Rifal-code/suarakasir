"use client";

import React, { useState, useRef, useEffect } from "react";

export type FilterState = {
  status: string; // "all" | "pending" | "selesai"
  dateRange: string; // "all" | "today" | "7d" | "30d"
  product: string; // "all" | "product_name"
};

type OrderFilterProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableProducts: string[];
};

export default function OrderFilter({ filters, onChange, availableProducts }: OrderFilterProps) {
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        // Only trigger on desktop views (width >= 768px) to prevent conflicts with mobile portal/touch
        if (window.innerWidth >= 768) {
          setOpen(false);
          setProductOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.status !== "all" || filters.dateRange !== "all" || filters.product !== "all";

  const activeFilterCount = [
    filters.status !== "all",
    filters.dateRange !== "all",
    filters.product !== "all"
  ].filter(Boolean).length;

  const resetFilters = () => {
    onChange({ status: "all", dateRange: "all", product: "all" });
    setOpen(false);
    setProductOpen(false);
  };

  const filterContent = (isMobile: boolean) => {
    return (
      <>
        {/* Visual Drag Cue / Handle bar for mobile bottom sheet */}
        {isMobile && <div className="w-12 h-1 bg-border-default rounded-full mx-auto mb-5 shrink-0" />}

        <div className="flex justify-between items-center mb-5 shrink-0">
          <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-text-muted">tune</span>
            Filter Pesanan
          </h4>
          {hasActiveFilters && (
            <button 
              onClick={resetFilters}
              className="text-[11px] font-bold text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border-0"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              Reset Semua
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5 block">
              Status Transaksi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "all", label: "Semua", icon: "grid_view", iconColor: "text-text-muted" },
                { id: "selesai", label: "Selesai", icon: "check_circle", iconColor: "text-success" },
                { id: "pending", label: "Pending", icon: "schedule", iconColor: "text-amber-500" }
              ].map((s) => {
                const isActive = filters.status === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => updateFilter("status", s.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive 
                        ? "bg-secondary text-text-primary border-primary/50 shadow-sm" 
                        : "bg-background text-text-secondary border-border-default hover:border-primary/30 hover:bg-white"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[16px] ${s.iconColor}`}>
                      {s.icon}
                    </span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5 block">
              Rentang Waktu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "all", label: "Semua Waktu", icon: "calendar_today" },
                { id: "today", label: "Hari Ini", icon: "today" },
                { id: "7d", label: "7 Hari Terakhir", icon: "date_range" },
                { id: "30d", label: "Bulan Ini", icon: "calendar_month" },
              ].map((d) => {
                const isActive = filters.dateRange === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => updateFilter("dateRange", d.id)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive 
                        ? "bg-secondary text-text-primary border-primary/50 shadow-sm" 
                        : "bg-background text-text-secondary border-border-default hover:border-primary/30 hover:bg-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-text-muted">
                      {d.icon}
                    </span>
                    <span className="truncate">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Filter */}
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5 block">
              Produk Spesifik
            </label>
            <div className="relative">
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setProductOpen(!productOpen);
                }}
                className="w-full bg-background border border-border-default text-text-primary text-sm font-semibold rounded-xl pl-9 pr-4 py-2.5 flex items-center justify-between hover:border-primary/40 hover:bg-white transition-colors focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="material-symbols-outlined text-[16px] text-text-muted absolute left-3">inventory_2</span>
                  <span className="truncate">{filters.product === "all" ? "Semua Produk" : filters.product}</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-text-muted transition-transform duration-200" style={{ transform: productOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              </button>

              {/* Mobile Inline Product List (Accordion style) */}
              {isMobile && productOpen && (
                <div className="mt-1.5 max-h-40 overflow-y-auto bg-background/50 border border-border-soft rounded-xl p-1.5 flex flex-col gap-0.5 custom-scrollbar">
                  <button
                    onClick={() => {
                      updateFilter("product", "all");
                      setProductOpen(false);
                    }}
                    className={`w-full shrink-0 text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer border-0 ${
                      filters.product === "all" ? "bg-secondary text-text-primary font-bold border border-primary/20" : "text-text-secondary hover:bg-background hover:text-text-primary font-medium"
                    }`}
                  >
                    Semua Produk
                  </button>
                  {availableProducts.map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        updateFilter("product", p);
                        setProductOpen(false);
                      }}
                      className={`w-full shrink-0 text-left px-3 py-2 text-xs rounded-lg transition-colors truncate cursor-pointer border-0 ${
                        filters.product === p ? "bg-secondary text-text-primary font-bold border border-primary/20" : "text-text-secondary hover:bg-background hover:text-text-primary font-medium"
                      }`}
                      title={p}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Desktop Absolute Dropdown Product List */}
              {!isMobile && productOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-border-soft rounded-xl shadow-lg z-[110] p-1.5 flex flex-col gap-0.5 custom-scrollbar">
                  <button
                    onClick={() => {
                      updateFilter("product", "all");
                      setProductOpen(false);
                    }}
                    className={`w-full shrink-0 text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer border-0 ${
                      filters.product === "all" ? "bg-secondary text-text-primary font-bold border border-primary/20" : "text-text-secondary hover:bg-background hover:text-text-primary font-medium"
                    }`}
                  >
                    Semua Produk
                  </button>
                  {availableProducts.map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        updateFilter("product", p);
                        setProductOpen(false);
                      }}
                      className={`w-full shrink-0 text-left px-3 py-2 text-xs rounded-lg transition-colors truncate cursor-pointer border-0 ${
                        filters.product === p ? "bg-secondary text-text-primary font-bold border border-primary/20" : "text-text-secondary hover:bg-background hover:text-text-primary font-medium"
                      }`}
                      title={p}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 shrink-0">
          <button 
            onClick={() => setOpen(false)}
            className="w-full py-2.5 bg-text-primary text-white text-sm font-bold rounded-xl hover:bg-text-secondary active:scale-[0.98] transition-all cursor-pointer shadow-sm border-0"
          >
            Terapkan Filter
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="relative shrink-0" ref={filterRef}>
      
      {/* Trigger Button */}
      <button 
        onClick={() => setOpen(!open)}
        className={`relative flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full border text-sm font-bold transition-all w-full md:w-auto cursor-pointer ${
          hasActiveFilters 
            ? "bg-secondary text-text-primary border-primary/40 shadow-sm" 
            : "bg-white text-text-primary border-border-default hover:border-border-soft hover:bg-gray-50 shadow-sm"
        }`}
      >
        <span className={`material-symbols-outlined text-[18px] transition-colors ${hasActiveFilters ? "text-primary animate-pulse" : "text-text-secondary"}`}>
          {hasActiveFilters ? "filter_alt" : "tune"}
        </span>
        <span>Filter</span>
        {hasActiveFilters && (
          <span className="flex items-center justify-center w-5 h-5 bg-primary text-white rounded-full text-[10px] font-extrabold shadow-sm shadow-primary/30">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Drawer (Bottom Sheet) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/45 z-[100] flex items-end justify-center md:hidden animate-in fade-in duration-200"
          onClick={() => {
            setOpen(false);
            setProductOpen(false);
          }}
        >
          <div 
            className="w-full bg-white rounded-t-[28px] p-6 pb-10 max-h-[85vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {filterContent(true)}
          </div>
        </div>
      )}

      {/* Desktop Popover Panel */}
      {open && (
        <div className="hidden md:block absolute top-full right-0 mt-2 w-80 bg-white rounded-3xl shadow-xl border border-border-soft p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {filterContent(false)}
        </div>
      )}
    </div>
  );
}
