export default function DonutChartCard() {
  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm h-full flex flex-col relative">
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-sm font-semibold text-text-primary">Statistik Penjualan</h3>
        <button className="flex items-center gap-1 text-xs font-semibold text-text-secondary bg-background px-3 py-1.5 rounded-full border border-border-default hover:bg-border-soft transition-colors">
          Bulanan
          <span className="material-symbols-outlined text-[14px]">expand_more</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Decorative Lines and Legends around Donut */}
        <div className="absolute w-full h-full pointer-events-none">
          {/* Furniture Legend (Left top) */}
          <div className="absolute top-[10%] left-0">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-border-default"></div>
              <span className="text-[10px] text-text-secondary font-medium">Furniture</span>
            </div>
            <p className="text-sm font-bold text-text-primary">89.532</p>
          </div>
          
          {/* Electronics Legend (Left bottom) */}
          <div className="absolute bottom-[20%] left-0">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-border-default"></div>
              <span className="text-[10px] text-text-secondary font-medium">Electronics</span>
            </div>
            <p className="text-sm font-bold text-text-primary">90.231</p>
          </div>

          {/* Shoes Legend (Right top) */}
          <div className="absolute top-[10%] right-0 text-right">
            <div className="flex items-center justify-end gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-sidebar"></div>
              <span className="text-[10px] text-text-secondary font-medium">Shoes</span>
            </div>
            <p className="text-sm font-bold text-text-primary">188.500</p>
          </div>

          {/* Clothes Legend (Right bottom) */}
          <div className="absolute bottom-[20%] right-0 text-right">
            <div className="flex items-center justify-end gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-border-default"></div>
              <span className="text-[10px] text-text-secondary font-medium">Clothes</span>
            </div>
            <p className="text-sm font-bold text-text-primary">88.865</p>
          </div>
        </div>

        {/* Donut Chart placeholder using CSS */}
        <div className="relative w-40 h-40 mt-4 rounded-full border-[18px] border-border-soft flex items-center justify-center">
          <div className="absolute inset-[-18px] rounded-full border-[18px] border-sidebar border-b-transparent border-l-transparent rotate-45"></div>
          
          {/* Inner Content */}
          <div className="text-center z-10 bg-white w-full h-full rounded-full flex flex-col items-center justify-center shadow-inner">
            <p className="text-xl font-bold text-text-primary">23.324</p>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-success/20 text-success flex items-center gap-0.5 mt-1">
              +45%
              <span className="material-symbols-outlined text-[10px]">arrow_upward</span>
            </span>
          </div>
        </div>

      </div>
      
      <div className="text-center mt-6">
        <p className="text-xs text-text-secondary mb-1">Total Jumlah Penjualan</p>
        <p className="text-2xl font-black text-text-primary">344.003</p>
      </div>
    </div>
  );
}
