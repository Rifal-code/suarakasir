"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeAuthToken } from "@/lib/api";

const menuItems = [
  { name: "Dashboard", icon: "dashboard", href: "/" },
  { name: "Produk", icon: "inventory_2", href: "/products" },
  { name: "Transaksi", icon: "receipt_long", href: "/transaction" },
  { name: "Riwayat", icon: "history", href: "/history" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/login");
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 bg-[#111111] py-8 px-6 z-50 text-white border-r border-border-default/10 shadow-2xl">
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-xl">bolt</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Suara Kasir</h1>
          <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-widest">
            AI POS System
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-text-muted hover:bg-white/10 hover:text-white"
              }`}
            >
              <span
                className={`material-symbols-outlined transition-transform duration-200 ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-text-muted hover:bg-[#ff4b4b]/10 hover:text-[#ff4b4b] transition-all group"
        >
          <span className="material-symbols-outlined opacity-70 group-hover:opacity-100 rotate-180">logout</span>
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
