"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitFeedback } from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";

export default function FeedbackPage() {
  const router = useRouter();
  const toast = useToast();
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Masukan tidak boleh kosong.");
      return;
    }

    setIsLoading(true);
    try {
      const { response, data } = await submitFeedback(message, isPublic);
      if (response.ok && data.success) {
        toast.success("Terima kasih atas masukan Anda!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Gagal mengirim masukan. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Pastikan koneksi internet stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 md:p-10 max-w-4xl mx-auto mb-20 md:mb-0">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2">Beri Masukan</h1>
        <p className="text-text-secondary text-sm md:text-base">
          Sampaikan kritik, saran, atau pengalaman Anda menggunakan Suara Kasir. Masukan Anda sangat berarti bagi kami untuk terus berkembang.
        </p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-border-soft p-5 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="message" className="block text-sm font-bold text-text-primary">
              Masukan Anda
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary resize-y"
              placeholder="Ceritakan pengalaman Anda di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-border-soft">
            <input
              type="checkbox"
              id="isPublic"
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary mt-0.5 shrink-0"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="isPublic" className="text-sm text-text-secondary cursor-pointer select-none leading-tight">
              <span className="font-bold text-text-primary block mb-0.5">Tampilkan ke Publik</span>
              Izinkan Suara Kasir menampilkan masukan ini sebagai testimoni di halaman utama.
            </label>
          </div>

          <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 rounded-full text-sm font-bold text-text-secondary hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Masukan
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
