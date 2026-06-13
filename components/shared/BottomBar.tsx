"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomBarProps {
  onMicClick?: () => void;
}

export default function BottomBar({ onMicClick }: BottomBarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", icon: "home", href: "/" },
    { name: "Transaksi", icon: "receipt_long", href: "/transaction" },
    { name: "Produk", icon: "inventory_2", href: "/products" },
    { name: "Riwayat", icon: "history", href: "/history" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
      {/* Background with shadow, simulated cutout using CSS */}
      <div className="absolute inset-0 bg-sidebar shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"></div>
      
      <div className="relative flex justify-between items-center px-4 py-2">
        {/* Left items */}
        <div className="flex w-[40%] justify-around">
          {navItems.slice(0, 2).map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex flex-col items-center gap-1 transition-colors z-10 py-2 ${
                pathname === item.href ? "text-primary" : "text-text-muted hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: pathname === item.href ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Floating Action Button (Microphone) with simulated curve */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 flex justify-center z-20">
          <div className="bg-background rounded-full p-1.5 w-[76px] h-[76px] flex items-center justify-center">
            <button 
              onClick={onMicClick}
              className="w-full h-full bg-primary rounded-full flex flex-col items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all relative overflow-hidden group"
            >
              <span className="material-symbols-outlined text-white text-[32px] group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                mic
              </span>
              {/* Subtle animated ring around mic */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 scale-[0.8] group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </button>
          </div>
        </div>

        {/* Right items */}
        <div className="flex w-[40%] justify-around">
          {navItems.slice(2, 4).map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex flex-col items-center gap-1 transition-colors z-10 py-2 ${
                pathname === item.href ? "text-primary" : "text-text-muted hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: pathname === item.href ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Safe area padding for newer iPhones */}
      <div className="h-safe-area-bottom bg-sidebar relative z-10"></div>
    </div>
  );
}

