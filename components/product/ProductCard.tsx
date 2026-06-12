"use client";

type ProductCardProps = {
  name: string;
  price: string;
  imageUrl: string;
  stock: number;
};

export default function ProductCard({ name, price, imageUrl, stock }: ProductCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border-default flex flex-col overflow-hidden group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-md relative">
      {/* Image Area */}
      <div className="relative aspect-square w-full bg-background overflow-hidden border-b border-border-soft">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Edit Button overlay on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
           <button className="bg-white/90 backdrop-blur-sm text-text-primary hover:text-primary hover:bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-border-soft active:scale-95 transition-all pointer-events-auto">
             <span className="material-symbols-outlined text-[16px]">edit</span>
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <h3 className="text-[11px] sm:text-xs font-semibold text-text-primary line-clamp-2 leading-snug mb-1.5">{name}</h3>
        
        <div className="mt-auto flex items-end justify-between pt-1">
          <p className="text-sm sm:text-base font-bold text-text-primary leading-none">{price}</p>
          <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded leading-none ${
            stock > 10 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}>
            Stok: {stock}
          </span>
        </div>
      </div>
    </div>
  );
}
