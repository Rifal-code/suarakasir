"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserName, fetchApi } from "@/lib/api";

interface TopBarProps {
  onMicClick?: () => void;
}

export default function TopBar({ onMicClick }: TopBarProps) {
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

        {/* Desktop Voice Action (Hidden on mobile as it's in BottomBar) */}
        <button
          onClick={onMicClick}
          className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full font-bold text-sm shadow-md shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">mic</span>
          Order Suara
        </button>

        {/* Profile Link Widget */}
        <Link
          href="/profile"
          className="flex items-center gap-3 p-1.5 sm:pr-5 bg-white text-text-primary rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 active:scale-95 transition-all group border border-border-default"
        >
          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden border border-gray-200">
            <img 
              src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(userName)}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-bold leading-tight text-text-primary">{userName}</p>
            <p className="text-[10px] text-text-muted font-medium leading-tight truncate max-w-[120px]">{userEmail}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
