"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductCardProps = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  stock: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function ProductCard({ id, name, price, imageUrl, stock, onEdit, onDelete }: ProductCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    router.push(`/products/${id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit) onEdit(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) onDelete(id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-border-soft flex flex-col overflow-hidden group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-xl relative"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full bg-white border-b border-border-soft flex items-center justify-center overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Stock Badge */}
        <div className="absolute top-0 left-0 z-10">
          <span className="flex items-center text-[10px] md:text-[11px] font-bold px-3 py-1.5 bg-[#1a1a1a] text-white rounded-tl-2xl rounded-br-2xl shadow-sm tracking-wide">
            {stock} Stock
          </span>
        </div>
      </div>

      {/* Content Area - dark bg like transaction */}
      <div className="p-3 bg-sidebar flex flex-col flex-1 relative">
        <h3 className="text-sm font-medium text-text-white line-clamp-2 leading-tight mb-2 pr-6">{name}</h3>
        
        <div className="mt-auto flex items-end pt-1 pb-1">
          <p className="text-base font-semibold text-text-white leading-none">{price}</p>
        </div>

        {/* 3-Dot Menu Button - orange color */}
        <button 
          onClick={handleMenuClick}
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-primary hover:text-primary-hover hover:bg-white/10 transition-colors z-10"
        >
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>

        {/* Popup Menu */}
        {showMenu && (
          <div className="absolute bottom-10 right-2 w-32 bg-card rounded-xl border border-border-default shadow-lg overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={handleEditClick}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-text-primary hover:bg-background flex items-center gap-2 transition-colors border-b border-border-soft"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Edit
            </button>
            <button 
              onClick={handleDeleteClick}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-danger hover:bg-danger/10 flex items-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              Hapus
            </button>
          </div>
        )}
      </div>

      {/* Invisible backdrop to close menu when clicking outside but inside the card */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(false);
          }}
        />
      )}
    </div>
  );
}
