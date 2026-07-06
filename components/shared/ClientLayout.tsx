"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import TopBar from "@/components/shared/TopBar";
import BottomBar from "@/components/shared/BottomBar";
import Sidebar from "@/components/shared/Sidebar";
import VoiceSheet from "@/components/voice/VoiceSheet";

import AIChatWidget from "@/components/ai/AIChatWidget";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showVoiceSheet, setShowVoiceSheet] = useState(false);

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isLandingPage = pathname === "/";
  const isPublicPage = isLoginPage || isRegisterPage || isLandingPage;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token && !isPublicPage) {
      router.replace("/");
    } else if (token && (isLoginPage || isRegisterPage)) {
      router.replace("/dashboard");
    }
  }, [pathname, isPublicPage, router]);

  // Prevent hydration mismatch by not rendering anything until client mounts
  if (!mounted) {
    return null;
  }

  if (isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Sidebar (Desktop only) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden relative">
        <TopBar onMicClick={() => setShowVoiceSheet(true)} />
        <main className="flex-1 px-4 sm:px-2 md:px-2 py-6 pb-24 md:pb-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomBar onMicClick={() => setShowVoiceSheet(true)} />
      </div>

      {/* AI Chat Widget - Global Floating Action */}
      <AIChatWidget isTransactionPage={pathname === "/transaction"} />

      {/* Voice Order Overlay */}
      {showVoiceSheet && (
        <VoiceSheet 
          onClose={() => setShowVoiceSheet(false)}
          onParsedItems={(items) => {
            setShowVoiceSheet(false);
            if (items.length > 0) {
              sessionStorage.setItem("pending_voice_order", JSON.stringify(items));
              if (pathname !== "/transaction") {
                router.push("/transaction");
              } else {
                // If already on transaction page, trigger a custom event
                window.dispatchEvent(new Event("voiceOrderReady"));
              }
            }
          }}
        />
      )}
    </div>
  );
}
