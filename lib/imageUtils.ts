/**
 * Utility untuk mengkonversi URL gambar eksternal menjadi URL proxy lokal.
 * Ini mengatasi masalah hotlink protection dari ImgBB (i.ibb.co)
 * yang menyebabkan gambar gagal dimuat di beberapa browser/perangkat
 * karena Referer header dari cross-site request.
 */

const PROXY_DOMAINS = ["i.ibb.co"];

/**
 * Mengecek apakah URL perlu di-proxy dan mengembalikan URL yang sesuai.
 * - URL dari domain yang di-proxy (i.ibb.co) → `/api/image-proxy?url=<encoded>`
 * - URL lokal atau non-proxy → dikembalikan apa adanya
 * - URL kosong/falsy → dikembalikan apa adanya
 */
export function getProxiedImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (PROXY_DOMAINS.includes(parsed.hostname)) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
    }
  } catch {
    // URL tidak valid (misalnya relative path atau placeholder), kembalikan apa adanya
  }

  return url;
}
