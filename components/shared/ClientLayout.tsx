"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import TopBar from "@/components/shared/TopBar";
import BottomBar from "@/components/shared/BottomBar";
import Sidebar from "@/components/shared/Sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    setMounted(true);
    const token = getAuthToken();
    if (!token && !isLoginPage) {
      router.replace("/login");
    } else if (token && isLoginPage) {
      router.replace("/");
    }
  }, [pathname, isLoginPage, router]);

  // Prevent hydration mismatch by not rendering anything until client mounts
  if (!mounted) {
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar (Desktop only) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden relative">
        <TopBar />
        <main className="flex-1 px-4 sm:px-2 md:px-2 py-6 pb-24 md:pb-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomBar />
      </div>
    </div>
  );
}
