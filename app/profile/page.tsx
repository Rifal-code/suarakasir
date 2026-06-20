"use client";

import { useEffect, useState } from "react";
import { fetchApi, logoutBackend, setUserName } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";
import { SkeletonProfileHeader, SkeletonProfileForm } from "@/components/ui/SkeletonCards";
import useSWR, { mutate } from "swr";
import { swrFetcher } from "@/lib/api";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    address: "",
    contact: "",
    password: ""
  });

  const { data: userData, isLoading: loading } = useSWR("/api/auth/me", swrFetcher, {
    onSuccess: (data) => {
      if (data?.data) {
        setFormData({
          name: data.data.name || "",
          email: data.data.email || "",
          description: data.data.description || "",
          address: data.data.address || "",
          contact: data.data.contact || "",
          password: ""
        });
      }
    },
    onError: () => toast.error("Gagal memuat profil.")
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload: any = { ...formData };
    if (!payload.password) {
      delete payload.password;
    }
    
    try {
      const { response, data } = await fetchApi("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify(payload)
      });
      
      if (response.ok && data.success) {
        toast.success("Profil berhasil diperbarui!");
        setUserName(payload.name);
        // Refresh profile cache
        mutate("/api/auth/me");
        setFormData({ ...formData, password: "" }); 
      } else {
        toast.error(data.message || "Gagal memperbarui profil.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan saat menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutBackend();
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-120px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card rounded-[32px] md:rounded-[40px] shadow-sm border border-border-soft flex-1 flex flex-col mb-6 overflow-hidden">
          <SkeletonProfileHeader />
          <SkeletonProfileForm />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-8">
      
      {/* Header Section (Dark Mode Design) */}
      <div className="bg-sidebar rounded-t-[32px] p-8 md:p-12 relative overflow-hidden shadow-xl">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-sidebar shrink-0">
            <span className="material-symbols-outlined text-[48px]">person</span>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">{formData.name || "Nama Pengguna"}</h1>
            <p className="text-white/60 mt-1 font-medium">{formData.email}</p>
          </div>
          <div className="shrink-0 mt-4 md:mt-0">
             <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-bold text-sm border border-red-500/20 hover:border-red-500/30 transition-all flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">logout</span>
              Keluar Akun
            </button>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-card border-x border-b border-border-soft rounded-b-[32px] p-6 md:p-10 shadow-sm relative -top-6 z-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2.5 group">
              <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-muted group-focus-within:text-primary transition-colors">badge</span>
                Nama Lengkap
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Misal: Budi Santoso"
                className="px-5 py-3.5 bg-background border border-border-default rounded-2xl text-[15px] font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                required
              />
            </div>

            <div className="flex flex-col gap-2.5 group">
              <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-muted group-focus-within:text-primary transition-colors">mail</span>
                Email Akses
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Misal: budi@example.com"
                className="px-5 py-3.5 bg-background border border-border-default rounded-2xl text-[15px] font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2.5 group">
              <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-muted group-focus-within:text-primary transition-colors">call</span>
                Nomor Kontak (WA)
              </label>
              <input 
                type="text" 
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Misal: 08123456789"
                className="px-5 py-3.5 bg-background border border-border-default rounded-2xl text-[15px] font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-2.5 group">
              <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-muted group-focus-within:text-primary transition-colors">lock</span>
                Ganti Kata Sandi (Opsional)
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ingin diubah"
                className="px-5 py-3.5 bg-background border border-border-default rounded-2xl text-[15px] font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner"
                minLength={6}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 group">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-text-muted group-focus-within:text-primary transition-colors">storefront</span>
              Tentang Bisnis Anda
            </label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan sedikit tentang toko atau layanan yang Anda sediakan..."
              rows={3}
              className="px-5 py-3.5 bg-background border border-border-default rounded-2xl text-[15px] font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner resize-none"
            />
          </div>

          <div className="flex flex-col gap-2.5 group">
            <label className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-text-muted group-focus-within:text-primary transition-colors">location_on</span>
              Alamat Lengkap (Ditampilkan di PDF)
            </label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Alamat lengkap toko Anda untuk nota laporan PDF"
              rows={3}
              className="px-5 py-3.5 bg-background border border-border-default rounded-2xl text-[15px] font-medium text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-inner resize-none"
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-4 bg-sidebar text-white rounded-2xl font-bold text-[15px] shadow-lg hover:bg-black hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  Sedang Menyimpan...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Simpan Profil Sekarang
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
