"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();
  
  const navLinks = [
    { name: "Dashboard", href: "/", icon: "dashboard" },
    { name: "Produk", href: "/products", icon: "inventory_2" },
    { name: "Transaksi", href: "/transaction", icon: "receipt_long" },
    { name: "Riwayat", href: "/history", icon: "history" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border-soft px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Logo Area */}
      <div className="flex items-center gap-2 pr-8">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-lg">bolt</span>
        </div>
        <h1 className="text-xl font-bold text-text-primary">Suara Kasir</h1>
      </div>

      {/* Horizontal Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 py-2 border-b-2 transition-colors ${
                isActive
                  ? "border-primary text-text-primary font-bold"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${isActive ? "text-primary" : ""}`}>
                {link.icon}
              </span>
              <span className="text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Actions Area */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-text-primary">Kasir Utama</p>
            <p className="text-[10px] text-text-secondary">Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <button className="text-text-secondary hover:text-primary">
             <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
        </div>
      </div>
    </header>
  );
}
