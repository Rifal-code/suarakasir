"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", icon: "dashboard", href: "/" },
  { name: "Produk", icon: "inventory_2", href: "/products" },
  { name: "Transaksi", icon: "receipt_long", href: "/transaction" },
  { name: "Pelanggan", icon: "group", href: "/customers" },
  { name: "Analitik", icon: "analytics", href: "/analytics" },
  { name: "Pengaturan", icon: "settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[280px] h-full bg-sidebar py-8 px-6 fixed left-0 top-0 z-50 text-white border-r border-border-default/10">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          Suara Kasir
        </h1>
        <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest">
          AI POS System
        </p>
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
                className={`material-symbols-outlined ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}
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
        <button className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-text-muted hover:bg-white/10 hover:text-white transition-all">
          <span className="material-symbols-outlined opacity-70">logout</span>
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
