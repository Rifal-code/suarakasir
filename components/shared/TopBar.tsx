"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserName, fetchApi } from "@/lib/api";

export default function TopBar() {
  const pathname = usePathname();
  const [userName, setUserNameState] = useState("Loading...");
  const [userEmail, setUserEmailState] = useState("Memuat data...");
  
  useEffect(() => {
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
    <header className="sticky top-0 z-40 bg-white border-b border-border-soft shadow-sm px-6 md:px-10 py-4 flex items-center justify-between">
      {/* Left Area - Mobile Logo Only */}
      <div className="flex items-center gap-4">
        {/* Mobile Title / Logo area when Sidebar is hidden */}
        <div className="flex lg:hidden items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-white text-lg">bolt</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight">Suara Kasir</h1>
        </div>
      </div>

      {/* Right Actions Area */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-card px-2 py-1.5 rounded-full border border-border-soft shadow-sm cursor-pointer hover:bg-background transition-colors hover:shadow-md">
          <div className="text-right hidden sm:block pl-3">
            <p className="text-sm font-bold text-text-primary">{userName}</p>
            <p className="text-[10px] text-text-secondary font-medium">{userEmail}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </div>
          <span className="material-symbols-outlined text-sm text-text-muted pr-1">expand_more</span>
        </div>
      </div>
    </header>
  );
}
