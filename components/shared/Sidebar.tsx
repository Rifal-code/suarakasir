"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeAuthToken } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";
import { useState } from "react";
import AlertDialog from "@/components/ui/AlertDialog";
import Logo from "@/components/shared/Logo";

const menuItems = [
  { name: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { name: "Produk", icon: "inventory_2", href: "/products" },
  { name: "Transaksi", icon: "receipt_long", href: "/transaction" },
  { name: "Riwayat", icon: "history", href: "/history" },
  { name: "Masukan", icon: "rate_review", href: "/feedback" },
  { name: "Profil", icon: "person", href: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    toast.info("Anda telah keluar dari akun.");
    router.push("/");
  };

  return (
    <>
      <aside className="hidden md:flex flex-col sticky top-0 bg-[#111111] py-6 z-50 text-white border-r border-border-default/10 shadow-2xl transition-all duration-300 md:w-[80px] lg:w-[200px] md:px-3 lg:px-4 h-screen md:items-center lg:items-stretch">
        <div className="mb-8 flex items-center justify-center lg:justify-start gap-2.5 w-full lg:px-1">
          <Logo className="w-8 h-8 flex-shrink-0 drop-shadow-md" />
          <div className="min-w-0 hidden lg:block">
            <h1 className="text-base font-bold text-white tracking-tight truncate">Suara Kasir</h1>
            <p className="text-[9px] text-text-muted mt-0.5 uppercase tracking-widest">
              AI POS System
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 flex-grow w-full">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center md:justify-center lg:justify-start gap-3 md:p-3 lg:px-3 lg:py-2.5 rounded-xl transition-all duration-200 group w-full ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-text-muted hover:bg-white/10 hover:text-white"
                }`}
                title={item.name}
              >
                <span
                  className={`material-symbols-outlined transition-transform duration-200 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-medium text-sm hidden lg:block">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 w-full flex justify-center lg:justify-start">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center md:justify-center lg:justify-start gap-3 md:p-3 lg:px-3 lg:py-2.5 w-full rounded-xl text-text-muted hover:bg-[#ff4b4b]/10 hover:text-[#ff4b4b] transition-all group"
            title="Keluar"
          >
            <span className="material-symbols-outlined opacity-70 group-hover:opacity-100 rotate-180">logout</span>
            <span className="font-medium text-sm hidden lg:block">Keluar</span>
          </button>
        </div>
      </aside>

      <AlertDialog
        isOpen={showLogoutConfirm}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun? Anda perlu masuk kembali untuk mengakses sistem."
        confirmText="Ya, Keluar"
        cancelText="Batal"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        isDestructive={true}
      />
    </>
  );
}
