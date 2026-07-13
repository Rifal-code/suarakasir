"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { fetchApi, setAuthToken, setUserName, getAuthToken } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (getAuthToken()) {
      router.replace("/dashboard");
    }
  }, [router]);

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
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Login gagal, silakan periksa email dan password Anda.");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan. Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6 group">
            <Logo className="w-12 h-12 group-hover:scale-105 transition-transform drop-shadow-md" />
            <span className="text-xl font-bold tracking-tight text-text-primary">Suara Kasir</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Selamat Datang Kembali</h1>
          <p className="text-sm text-text-secondary mt-2">Masuk ke akun Anda untuk mengelola kasir</p>
        </div>

        {/* Card */}
        <div className="bg-card p-8 rounded-[2rem] border border-border-soft shadow-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full bg-background border border-border-default rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-text-primary placeholder:text-text-secondary/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-background border border-border-default rounded-xl pl-12 pr-12 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-text-primary placeholder:text-text-secondary/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-bold rounded-xl py-3.5 mt-2 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-sm text-text-secondary">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
