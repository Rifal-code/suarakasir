export default function SalesChart() {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border-soft flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Statistik Penjualan</h3>
          <p className="text-xs text-text-secondary mt-1">Total seluruh penjualan</p>
        </div>
        <button className="text-xs font-semibold text-text-secondary bg-background px-3 py-1.5 rounded-full border border-border-default hover:bg-border-soft transition-colors">
          Bulanan
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[200px]">
        {/* Placeholder for Donut Chart */}
        <div className="relative w-48 h-48 rounded-full border-[16px] border-border-default flex items-center justify-center">
          {/* Simulated chart segments using pseudo elements or multiple divs would go here in a real chart lib */}
          <div className="absolute inset-[-16px] rounded-full border-[16px] border-primary border-t-transparent border-r-transparent rotate-45"></div>
          <div className="absolute inset-[-16px] rounded-full border-[16px] border-sidebar border-b-transparent border-l-transparent rotate-12"></div>
          
          <div className="text-center z-10">
            <p className="text-2xl font-bold text-text-primary">23,324</p>
            <p className="text-[10px] text-success font-semibold flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[12px]">arrow_upward</span> +8%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sidebar"></div>
          <p className="text-xs font-semibold text-text-primary">Makanan <span className="text-text-muted font-normal ml-1">89.532</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <p className="text-xs font-semibold text-text-primary">Minuman <span className="text-text-muted font-normal ml-1">40.221</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-text-secondary"></div>
          <p className="text-xs font-semibold text-text-primary">Snack <span className="text-text-muted font-normal ml-1">38.500</span></p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-border-default"></div>
          <p className="text-xs font-semibold text-text-primary">Lainnya <span className="text-text-muted font-normal ml-1">20.885</span></p>
        </div>
      </div>
    </div>
  );
}
