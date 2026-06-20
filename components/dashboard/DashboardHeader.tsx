"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/components/ui/ToastContext";
import { getAuthToken } from "@/lib/api";

interface DashboardHeaderProps {
  range: string;
  onRangeChange: (range: string) => void;
}

export default function DashboardHeader({ range, onRangeChange }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: "7d", label: "7 Hari Terakhir", icon: "today" },
    { value: "30d", label: "30 Hari Terakhir", icon: "date_range" },
    { value: "1y", label: "1 Tahun Terakhir", icon: "calendar_month" },
  ];

  const selectedOption = options.find(opt => opt.value === range) || options[0];

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    toast.info("Sedang menyiapkan laporan...");

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/reports/sales/pdf?range=${range}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh laporan");
      }

      // Convert to blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-penjualan-${range}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Laporan berhasil diunduh!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengunduh laporan.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>

      <div className="flex items-center gap-3">


        {/* Custom Range Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-4 pr-3 py-2 bg-white hover:bg-background border-1 rounded-full text-sm font-bold text-sidebar transition-all shadow-sm hover:shadow "
          >
            <span className="material-symbols-outlined text-[18px]">{selectedOption.icon}</span>
            {selectedOption.label}
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onRangeChange(opt.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-orange-50/80 ${range === opt.value ? 'bg-orange-50/50 text-primary font-bold' : 'text-gray-600 font-medium'
                    }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${range === opt.value ? 'text-primary' : 'text-gray-400'}`}>
                    {opt.icon}
                  </span>
                  {opt.label}
                  {range === opt.value && (
                    <span className="material-symbols-outlined text-[18px] text-primary ml-auto">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>


        <button
          onClick={handleDownloadReport}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-white border-1 rounded-full text-sm font-semibold hover:bg-background transition-colors text-text-primary disabled:opacity-50"
        >
          {isDownloading ? (
            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-sm">download</span>
          )}
          Download Report
        </button>
      </div>
    </div>
  );
}
