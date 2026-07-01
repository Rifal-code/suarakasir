"use client";

import { useState, useRef, useEffect } from "react";
import { fetchApi } from "@/lib/api";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Halo! Saya Asisten Suara Kasir. Ada yang bisa saya bantu terkait penggunaan aplikasi ini?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", text: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessages(prev => [...prev, { role: "ai", text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "ai", text: "Maaf, terjadi kesalahan saat menghubungi server." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "Maaf, koneksi terputus. Silakan coba lagi." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((item, key) => {
      // Basic bold parsing: **text**
      const parts = item.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={key}>
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
          <br />
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-[80] right-4 lg:right-8 transition-all duration-300 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        } bottom-24 lg:bottom-8 w-14 h-14 bg-sidebar rounded-full flex items-center justify-center text-white shadow-xl shadow-sidebar/30 hover:scale-110 active:scale-95 group`}
      >
        <span className="material-symbols-outlined text-[28px] group-hover:animate-pulse">smart_toy</span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed z-[90] transition-all duration-300 transform origin-bottom-right flex flex-col bg-card shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-border-default/50 overflow-hidden
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
        
        /* Mobile specific styling */
        bottom-0 right-0 w-full h-[85vh] rounded-t-3xl 
        
        /* Desktop specific styling */
        lg:bottom-6 lg:right-6 lg:w-[380px] lg:h-[550px] lg:max-h-[80vh] lg:rounded-2xl
        `}
      >
        {/* Header */}
        <div className="bg-sidebar p-4 flex items-center justify-between text-white shrink-0 z-10 border-b border-white/5 relative overflow-hidden">
          {/* Subtle gradient overlay for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg relative border border-white/10">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-sidebar rounded-full shadow-sm"></div>
            </div>
            <div>
              <h3 className="font-bold text-[15px] leading-tight tracking-wide">Asisten Suara Kasir</h3>
              <p className="text-[11px] text-white/80 font-medium mt-0.5">Online • Siap membantu</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition-all relative z-10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Tutup Chat"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#f8f9fa] custom-scrollbar">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white text-text-primary rounded-2xl rounded-tl-sm border border-border-soft'
                }`}
              >
                {formatText(msg.text)}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white px-4 py-3.5 rounded-2xl rounded-tl-sm border border-border-soft shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-border-soft shrink-0 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-10">
          <form onSubmit={handleSend} className="relative flex items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Tanya sesuatu tentang aplikasi..."
              className="w-full bg-[#f4f6f8] text-text-primary rounded-2xl pl-4 pr-12 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none overflow-y-auto custom-scrollbar transition-shadow duration-200"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-1.5 bottom-1.5 w-9 h-9 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary-hover active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-primary shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px] ml-0.5">send</span>
            </button>
          </form>
          <div className="text-center mt-2.5">
            <span className="text-[10px] text-text-muted font-medium flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[12px]">bolt</span>
              AI Support System - Suara Kasir
            </span>
          </div>
        </div>
      </div>
      
      {/* Mobile Backdrop when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[85] lg:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
