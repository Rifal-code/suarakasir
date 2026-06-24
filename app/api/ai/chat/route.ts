import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body; // Array of { role: 'user' | 'model', parts: [{ text: '...' }] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, message: "Pesan tidak valid." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return NextResponse.json({ success: false, message: "Gemini API key is not configured" }, { status: 500 });
    }

    // Read the instructions file
    let instructions = "";
    try {
      const filePath = path.join(process.cwd(), "docs", "suarakasir-instructions.md");
      instructions = fs.readFileSync(filePath, "utf-8");
    } catch (e) {
      console.warn("Could not read instructions file, proceeding without it.");
      instructions = "Anda adalah AI Asisten untuk aplikasi Point of Sale 'Suara Kasir'. Jawablah pertanyaan seputar cara penggunaan aplikasi kasir ini dengan bahasa Indonesia yang ramah dan profesional. Tolak pertanyaan di luar konteks.";
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: `Anda adalah "Asisten Suara Kasir", sebuah AI ramah pembantu pengguna aplikasi Suara Kasir.
Panduan Aplikasi:
${instructions}

ATURAN KETAT:
1. SELALU jawab dalam bahasa Indonesia.
2. Jawab secara ringkas, jelas, dan mudah dimengerti. Gunakan formatting Markdown jika perlu (bullet points, bold).
3. JIKA PENGGUNA BERTANYA HAL DI LUAR APLIKASI SUARA KASIR (seperti politik, resep makanan umum, koding, pelajaran sekolah, dsb), TOLAK dengan ramah dan katakan bahwa Anda hanya bisa membantu seputar penggunaan Suara Kasir.`,
    });

    let historyEntries = messages.slice(0, -1).map((msg: any) => ({
      role: (msg.role === 'ai' ? 'model' : 'user') as 'model' | 'user',
      parts: [{ text: msg.text }],
    }));

    // Gemini API requires the first message in history to be from 'user'
    while (historyEntries.length > 0 && historyEntries[0].role === 'model') {
      historyEntries.shift();
    }

    const chat = model.startChat({
      history: historyEntries,
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ success: true, text: responseText });
  } catch (error) {
    console.error("Gemini AI Chat Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
