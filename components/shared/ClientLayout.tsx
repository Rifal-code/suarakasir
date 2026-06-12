"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import TopBar from "@/components/shared/TopBar";
import BottomBar from "@/components/shared/BottomBar";

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
    <>
      <TopBar />
      <div className="flex flex-col flex-1 pb-24 md:pb-0 max-w-[1440px] mx-auto w-full">
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-6">
          {children}
        </main>
      </div>
      <BottomBar />
    </>
  );
}
