"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserName, fetchApi } from "@/lib/api";

export default function TopBar() {
  const pathname = usePathname();
  const [userName, setUserNameState] = useState("Loading...");
  const [userEmail, setUserEmailState] = useState("Memuat data...");
  const [currentDate, setCurrentDate] = useState("");
  
  useEffect(() => {
    // Set formatted date
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('id-ID', dateOptions));

    const fetchProfile = async () => {
      try {
        const { response, data } = await fetchApi("/api/auth/me");
        if (response.ok && data.success && data.data) {
          setUserNameState(data.data.name || "Kasir");
          setUserEmailState(data.data.email || "kasir@suarakasir.com");
        } else {
          setUserNameState(getUserName());
          setUserEmailState("kasir@suarakasir.com");
        }
      } catch (error) {
        setUserNameState(getUserName());
        setUserEmailState("kasir@suarakasir.com");
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border-soft shadow-sm px-6 md:px-10 py-4 flex items-center justify-between">
      {/* Left Area */}
      <div className="flex items-center gap-4">
        {/* Mobile Title / Logo area when Sidebar is hidden */}
        <div className="flex lg:hidden items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-lg">bolt</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Suara Kasir</h1>
        </div>

        {/* Desktop Date Display */}
        <div className="hidden lg:flex flex-col">
          <h2 className="text-sm font-bold text-text-primary tracking-tight">Ringkasan Hari Ini</h2>
          <p className="text-[11px] font-medium text-text-secondary mt-0.5">{currentDate}</p>
        </div>
      </div>

      {/* Right Actions Area */}
      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* Profile Link Widget */}
        <Link 
          href="/profile" 
          className="flex items-center gap-3 p-1.5 sm:pr-5 bg-sidebar text-white rounded-full shadow-md hover:bg-black hover:shadow-xl active:scale-95 transition-all group border border-sidebar hover:border-gray-800"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-[20px]">person</span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold leading-tight">{userName}</p>
            <p className="text-[10px] text-white/60 font-medium leading-tight">{userEmail}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
