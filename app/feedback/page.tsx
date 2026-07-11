"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  submitFeedback,
  getUserFeedbacks,
  updateFeedback,
  deleteFeedback,
} from "@/lib/api";
import { useToast } from "@/components/ui/ToastContext";

export default function FeedbackPage() {
  const router = useRouter();
  const toast = useToast();

  // Form state
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Feedback list state
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const fetcher = async ([_, p]: [string, number]) => {
    const { response, data } = await getUserFeedbacks(p, LIMIT);
    if (!response.ok) throw new Error(data?.message || "Gagal memuat feedback");
    return data;
  };

  const {
    data: feedbackData,
    error,
    isLoading: isLoadingList,
    mutate,
  } = useSWR(["user_feedbacks", page], fetcher, {
    onError: (err) => toast.error(err.message),
  });

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<any>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<string | null>(
    null
  );

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
        setMessage("");
        setIsPublic(true);
        mutate();
      } else {
        toast.error(
          data.message || "Gagal mengirim masukan. Silakan coba lagi."
        );
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Pastikan koneksi internet stabil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (feedback: any) => {
    setEditingFeedback(feedback);
    setEditMessage(feedback.message);
    setEditIsPublic(feedback.is_public ?? false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingFeedbackId(id);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingFeedback || !editMessage.trim()) return;
    try {
      setIsSubmitting(true);
      const { response, data } = await updateFeedback(
        editingFeedback.id,
        editMessage,
        editIsPublic
      );
      if (response.ok && data.success) {
        toast.success("Feedback berhasil diperbarui");
        setIsEditModalOpen(false);
        mutate();
      } else {
        toast.error(data?.message || "Gagal memperbarui feedback");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingFeedbackId) return;
    try {
      setIsSubmitting(true);
      const { response, data } = await deleteFeedback(deletingFeedbackId);
      if (response.ok && data.success) {
        toast.success("Feedback berhasil dihapus");
        setIsDeleteModalOpen(false);
        mutate();
      } else {
        toast.error(data?.message || "Gagal menghapus feedback");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = feedbackData
    ? Math.ceil(feedbackData.total / LIMIT)
    : 0;

  return (
    <div className="px-4 py-6 md:p-10 max-w-4xl mx-auto mb-20 md:mb-0">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary mb-2">
          Beri Masukan
        </h1>
        <p className="text-text-secondary text-sm md:text-base">
          Sampaikan kritik, saran, atau pengalaman Anda menggunakan Suara Kasir.
          Masukan Anda sangat berarti bagi kami untuk terus berkembang.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-border-soft p-5 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="space-y-2.5">
            <label
              htmlFor="message"
              className="block text-sm font-bold text-text-primary"
            >
              Masukan Anda
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text-primary text-sm md:text-base resize-y"
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
            <label
              htmlFor="isPublic"
              className="text-sm text-text-secondary cursor-pointer select-none leading-tight"
            >
              <span className="font-bold text-text-primary block mb-0.5">
                Tampilkan ke Publik
              </span>
              Izinkan Suara Kasir menampilkan masukan ini sebagai testimoni di
              halaman utama.
            </label>
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
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
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    sync
                  </span>
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Masukan
                  <span className="material-symbols-outlined text-[18px]">
                    send
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Divider */}
      <div className="my-8 md:my-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-border-soft"></div>
        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
          Masukan Saya
        </span>
        <div className="h-px flex-1 bg-border-soft"></div>
      </div>

      {/* Feedback List */}
      <div className="space-y-3 md:space-y-4">
        {isLoadingList ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white animate-pulse rounded-2xl w-full border border-border-soft"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
            <span className="material-symbols-outlined text-red-300 text-4xl mb-2 block">
              error
            </span>
            <p className="text-text-secondary text-sm">
              Gagal memuat data masukan.
            </p>
            <button
              onClick={() => mutate()}
              className="mt-3 text-sm text-primary font-bold hover:underline"
            >
              Coba lagi
            </button>
          </div>
        ) : feedbackData?.data?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border-soft p-10 md:p-16 text-center">
            <span className="material-symbols-outlined text-gray-200 text-[56px] block mb-3">
              forum
            </span>
            <p className="text-text-secondary text-sm">
              Anda belum pernah memberikan masukan.
            </p>
          </div>
        ) : (
          <>
            {feedbackData?.data?.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-border-soft p-4 md:p-5 hover:border-primary/20 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-muted font-medium mb-2">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-text-primary text-sm md:text-base leading-relaxed break-words">
                      &quot;{item.message}&quot;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Hapus"
                    >
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 mt-2">
                <p className="text-xs md:text-sm text-text-secondary">
                  Hal{" "}
                  <span className="font-bold text-text-primary">{page}</span>{" "}
                  dari{" "}
                  <span className="font-bold text-text-primary">
                    {totalPages}
                  </span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-border-default flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      chevron_left
                    </span>
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * LIMIT >= (feedbackData?.total ?? 0)}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white border border-border-default flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-lg shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">
                Edit Masukan
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-text-secondary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  close
                </span>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">
                  Pesan Anda
                </label>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-border-default rounded-xl p-4 text-text-primary text-sm md:text-base outline-none focus:border-primary focus:ring-2 ring-primary/10 transition-all min-h-[120px] md:min-h-[150px] resize-none"
                  placeholder="Ceritakan pengalaman Anda..."
                ></textarea>
              </div>

              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-border-soft">
                <input
                  type="checkbox"
                  id="isPublicEdit"
                  checked={editIsPublic}
                  onChange={(e) => setEditIsPublic(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary accent-primary mt-0.5 shrink-0"
                />
                <label
                  htmlFor="isPublicEdit"
                  className="text-sm text-text-secondary cursor-pointer select-none leading-tight"
                >
                  <span className="font-bold text-text-primary block mb-0.5">
                    Tampilkan ke Publik
                  </span>
                  Izinkan Suara Kasir menampilkan masukan ini sebagai testimoni
                  di halaman utama.
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full sm:w-auto flex-1 sm:flex-none px-6 py-3.5 sm:py-3 rounded-full text-sm font-bold text-text-secondary hover:bg-gray-100 transition-colors text-center"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={
                    isSubmitting ||
                    !editMessage.trim() ||
                    (editMessage === editingFeedback?.message &&
                      editIsPublic === editingFeedback?.is_public)
                  }
                  className="w-full sm:flex-1 bg-primary text-white font-bold py-3.5 sm:py-3 rounded-full shadow-lg shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[20px]">
                        sync
                      </span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Simpan Perubahan
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-sm shadow-2xl p-6 md:p-8 text-center animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-[28px] md:text-3xl">
                delete_forever
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
              Hapus Masukan?
            </h2>
            <p className="text-text-secondary text-sm mb-6 md:mb-8">
              Tindakan ini tidak dapat dibatalkan. Masukan Anda akan dihapus
              secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 md:py-3.5 bg-gray-100 hover:bg-gray-200 text-text-primary font-bold rounded-full transition-colors text-sm"
                disabled={isSubmitting}
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 py-3 md:py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg shadow-red-500/20 transition-all flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    sync
                  </span>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
