import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, audioBase64, mimeType } = body;

    console.log("=== GEMINI REQUEST ===");
    console.log("Transcript received:", transcript || "[EMPTY]");
    console.log("Audio received:", audioBase64 ? `YES (${mimeType})` : "NO");
    console.log("======================");

    if (!transcript && !audioBase64) {
      return NextResponse.json({ success: false, message: "Audio or transcript is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
       return NextResponse.json({ success: false, message: "Gemini API key is not configured" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            items: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  n: { type: SchemaType.STRING, description: "Nama produk" },
                  q: { type: SchemaType.INTEGER, description: "Jumlah pesanan" }
                },
                required: ["n", "q"]
              }
            }
          },
          required: ["items"]
        }
      }
    });

    const promptText = `Tugas Anda adalah mengekstrak daftar pesanan dari ucapan pelanggan ke dalam format JSON.
Aturan ketat:
1. Ekstrak nama produk (n) dan kuantitas (q).
2. Jika tidak ada kuantitas yang disebutkan, jadikan q = 1.
3. DILARANG KERAS mengarang pesanan, menebak angka, atau menambahkan produk yang tidak diucapkan. Jika Anda tidak mendengar pesanan yang jelas, kembalikan array kosong.
4. Gunakan Teks dari browser sebagai petunjuk utama. Dengarkan audio untuk mengoreksi teks tersebut jika ada yang salah tangkap.

Teks dari browser: "${transcript || 'Tidak ada teks'}"`;

    let parts: any[] = [];
    if (audioBase64 && mimeType) {
      parts.push({
        inlineData: {
          data: audioBase64,
          mimeType: mimeType
        }
      });
      parts.push({ text: promptText + "\n(Dengarkan audio terlampir untuk memastikan keakuratan ucapan)" });
    } else {
      parts.push({ text: promptText });
    }

    const result = await model.generateContent(parts);
    const responseText = result.response.text().trim();

    console.log("=== GEMINI RAW RESPONSE ===");
    console.log(responseText);
    console.log("===========================");

    // Remove any markdown block if AI still outputs it
    const cleanJsonString = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    let parsedJson;
    try {
      parsedJson = JSON.parse(cleanJsonString);
      console.log("=== PARSED JSON TO BACKEND ===");
      console.dir(parsedJson, { depth: null });
      console.log("==============================");
    } catch (e) {
      console.error("Failed to parse JSON string:", cleanJsonString);
      return NextResponse.json({ success: false, message: "Failed to parse AI output to JSON" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: parsedJson });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
