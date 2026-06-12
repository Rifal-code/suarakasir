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
      className="bg-card rounded-xl border border-border-default flex flex-col overflow-hidden group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-md relative"
    >
      {/* Image Area */}
      <div className="relative aspect-square w-full bg-background overflow-hidden border-b border-border-soft">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Stock Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm leading-none backdrop-blur-md ${
            stock > 10 ? 'bg-success/90 text-white' : 'bg-danger/90 text-white'
          }`}>
            Stok: {stock}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 sm:p-3 flex flex-col flex-1 relative">
        <h3 className="text-[11px] sm:text-xs font-semibold text-text-primary line-clamp-2 leading-snug mb-1.5 pr-6">{name}</h3>
        
        <div className="mt-auto flex items-end pt-1">
          <p className="text-sm sm:text-base font-bold text-text-primary leading-none">{price}</p>
        </div>

        {/* 3-Dot Menu Button */}
        <button 
          onClick={handleMenuClick}
          className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-border-soft transition-colors z-10"
        >
          <span className="material-symbols-outlined text-[16px]">more_horiz</span>
        </button>

        {/* Popup Menu */}
        {showMenu && (
          <div className="absolute bottom-9 right-2 w-32 bg-card rounded-xl border border-border-default shadow-lg overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-150">
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
