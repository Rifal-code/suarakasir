type BarChartCardProps = {
  totalSales: string;
  trend: string;
  isTrendUp: boolean;
  chartData: { label: string; solid: number; striped: number }[];
};

export default function BarChartCard({ totalSales, trend, isTrendUp, chartData }: BarChartCardProps) {
  // If no chart data, provide a fallback
  const data = chartData && chartData.length > 0 ? chartData : [
    { label: "Sen", solid: 45, striped: 55 },
    { label: "Sel", solid: 35, striped: 65 },
    { label: "Rab", solid: 60, striped: 40 },
    { label: "Kam", solid: 40, striped: 60 },
    { label: "Jum", solid: 75, striped: 25 },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary mb-2">Total Penjualan</h3>
          <div className="flex items-center gap-3">
            <p className="text-3xl font-black text-text-primary tracking-tight">{totalSales}</p>
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
              isTrendUp ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
            }`}>
              {trend}
              <span className="material-symbols-outlined text-[12px]">{isTrendUp ? "arrow_upward" : "arrow_downward"}</span>
            </span>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-border-soft transition-colors">
          <span className="material-symbols-outlined text-text-secondary text-sm">more_horiz</span>
        </button>
      </div>

      <div className="flex justify-end gap-4 mt-2 mb-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sidebar"></div>
          <span className="text-[10px] text-text-secondary font-medium">Penjualan Utama</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-border-default"></div>
          <span className="text-[10px] text-text-secondary font-medium">Lainnya</span>
        </div>
      </div>

      {/* Custom Bar Chart */}
      <div className="flex-1 flex items-end gap-2 sm:gap-4 lg:gap-6 mt-4 relative min-h-[150px]">
        
        {/* Chart Bars */}
        <div className="flex-1 flex justify-between items-end pl-2 h-full">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center w-[12%] max-w-[40px] h-full justify-end group">
              <div className="w-full relative rounded-t-xl overflow-hidden flex flex-col justify-end" style={{ height: '100%' }}>
                {/* Striped Background */}
                <div 
                  className="w-full absolute bottom-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZjFmNWY5Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wLDggTDgsMCBMMCwwIEw4LDhaIiBmaWxsPSIjZTVlN2ViIiBmaWxsLW9wYWNpdHk9IjAuNSI+PC9wYXRoPgo8L3N2Zz4=')] rounded-t-xl transition-all duration-300"
                  style={{ height: '100%' }}
                ></div>
                {/* Solid Foreground */}
                <div 
                  className="w-full bg-sidebar absolute bottom-0 rounded-xl z-10 transition-all duration-500 group-hover:bg-primary"
                  style={{ height: `${item.solid}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-text-primary mt-3 bg-text-primary text-white px-2 py-0.5 rounded-full z-20 -mt-3 shadow-sm group-hover:bg-primary transition-colors">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
