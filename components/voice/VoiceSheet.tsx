"use client";

import { useEffect, useState } from "react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { parseVoiceOrder } from "@/lib/api";

interface VoiceSheetProps {
  onClose: () => void;
  onParsedItems: (items: any[]) => void;
}

export default function VoiceSheet({ onClose, onParsedItems }: VoiceSheetProps) {
  const { isRecording, error, startRecording, stopRecording } = useVoiceRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Automatically start recording when sheet opens
  useEffect(() => {
    // Timeout prevents React StrictMode from instantly stopping the recording
    const t = setTimeout(() => {
      startRecording();
    }, 100);
    return () => clearTimeout(t);
  }, [startRecording]);

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob) setAudioBlob(blob);
  };

  const handleSend = async () => {
    let finalBlob = audioBlob;
    if (isRecording) {
      finalBlob = await stopRecording();
      if (finalBlob) setAudioBlob(finalBlob);
    }

    setIsProcessing(true);
    setLocalError(null);

    if (!finalBlob) {
      setLocalError("Tidak ada suara terdeteksi. Silakan coba lagi.");
      setIsProcessing(false);
      return;
    }

    try {
      let audioBase64 = null;
      let mimeType = null;
      
      if (finalBlob) {
        audioBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(finalBlob!);
          reader.onloadend = () => {
            const base64data = reader.result?.toString().split(',')[1];
            resolve(base64data);
          };
        });
        mimeType = finalBlob.type;
      }

      // 1. Send to Gemini route for parsing
      const aiResponse = await fetch("/api/ai/parse-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          audioBase64,
          mimeType
        }),
      });
      
      const aiData = await aiResponse.json();
      
      if (!aiResponse.ok || !aiData.success) {
        setLocalError(aiData.message || "Gagal memproses suara. Coba lagi.");
        setIsProcessing(false);
        return;
      }

      // 2. We have { items: [{n, q}] } from AI
      const parsedItems = aiData.data?.items || [];
      if (parsedItems.length === 0) {
        setLocalError("Tidak ada produk yang dikenali.");
        setIsProcessing(false);
        return;
      }

      // 3. Send to Backend for Fuzzy Match
      const { response: beResponse, data: beData } = await parseVoiceOrder(parsedItems);
      
      if (beResponse.ok && beData.success) {
        // Pass matched items to parent
        onParsedItems(beData.data.items || []);
      } else {
        setLocalError(beData.message || "Gagal mencocokkan produk.");
      }
    } catch (err: any) {
      console.error(err);
      setLocalError("Terjadi kesalahan jaringan.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end sm:justify-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => !isProcessing && onClose()}
      />

      {/* Sheet Content */}
      <div className="relative bg-white w-full sm:max-w-md mx-auto rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 pb-8 sm:pb-8 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Handle bar (Mobile Only) */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isRecording ? 'mic' : 'mic_none'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {isRecording ? 'Merekam Pesanan...' : 'Pesanan Suara'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Status / Animation Area */}
        <div className="flex flex-col items-center justify-center min-h-[140px] bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-sidebar border-t-primary rounded-full animate-spin" />
              <p className="text-gray-600 font-medium animate-pulse">AI sedang memproses pesanan...</p>
            </div>
          ) : isRecording ? (
            <div className="flex flex-col items-center gap-6">
              {/* Animated Equalizer */}
              <div className="flex items-center gap-1.5 h-12">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 bg-sidebar rounded-full animate-pulse" 
                    style={{ 
                      height: `${Math.max(20, Math.random() * 100)}%`,
                      animationDuration: `${0.5 + Math.random() * 0.5}s`,
                      animationDelay: `${i * 0.1}s`
                    }} 
                  />
                ))}
              </div>
              <p className="text-gray-800 font-medium">Mendengarkan suara...</p>
            </div>
          ) : (
            <div className="w-full text-center">
                <p className="text-gray-400 italic">Audio siap dikirim atau coba rekam lagi.</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <p className="text-sm font-medium">{error || localError}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isRecording ? (
            <button
              onClick={handleStopRecording}
              className="flex-1 py-4 bg-sidebar text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <div className="w-4 h-4 bg-red-500 rounded-[3px] animate-pulse" />
              Berhenti
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={isProcessing}
              className="flex-1 py-4 bg-gray-100 text-gray-800 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <span className="material-symbols-outlined">replay</span>
              Ulangi
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={isProcessing || (!isRecording && !audioBlob)}
            className="flex-[1.5] py-4 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <span className="material-symbols-outlined">send</span>
            {isProcessing ? 'Memproses...' : 'Kirim Pesanan'}
          </button>
        </div>

      </div>
    </div>
  );
}
