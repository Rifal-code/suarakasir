import { NextRequest, NextResponse } from "next/server";

// Whitelist domain yang diperbolehkan untuk di-proxy
const ALLOWED_HOSTS = ["i.ibb.co"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  // Validasi: URL harus ada
  if (!imageUrl) {
    return NextResponse.json(
      { error: "Parameter 'url' wajib diisi" },
      { status: 400 }
    );
  }

  // Validasi: URL harus valid
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json(
      { error: "URL tidak valid" },
      { status: 400 }
    );
  }

  // Validasi: hanya domain yang di-whitelist
  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return NextResponse.json(
      { error: "Domain tidak diizinkan" },
      { status: 403 }
    );
  }

  try {
    // Fetch gambar dari sisi server — tanpa Referer header
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "Accept": "image/avif,image/webp,image/png,image/jpeg,*/*",
        "User-Agent": "Mozilla/5.0 (compatible; SuaraKasir/1.0)",
      },
      // @ts-ignore — Next.js extended fetch options
      cache: "force-cache",
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Gagal mengambil gambar: ${imageResponse.status}` },
        { status: imageResponse.status }
      );
    }

    // Ambil content type dari response asli
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await imageResponse.arrayBuffer();

    // Return gambar dengan cache header yang proper
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil gambar dari server sumber" },
      { status: 502 }
    );
  }
}
