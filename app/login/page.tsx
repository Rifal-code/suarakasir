"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi, setAuthToken, setUserName } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { response, data } = await fetchApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok && data.success && data.data?.token) {
        setAuthToken(data.data.token);
        const name = data.data.user?.name || email.split("@")[0] || "Admin";
        setUserName(name);
        toast.success(`Selamat datang, ${name}!`);
        router.push("/");
      } else {
        toast.error(data.message || "Login gagal, silakan periksa email dan password Anda.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan jaringan. Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative z-50">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl border border-border-default shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-white text-2xl">bolt</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Masuk ke Suara Kasir</h1>
          <p className="text-sm text-text-secondary mt-1">Sistem POS Cerdas Berbasis AI</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border-default rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-text-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border-default rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-text-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold rounded-xl py-3 mt-4 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            {loading ? "Memproses..." : "Masuk"}
            {!loading && <span className="material-symbols-outlined text-[18px]">login</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
