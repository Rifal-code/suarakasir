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
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${isTrendUp ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
              }`}>
              {trend}
              <span className="material-symbols-outlined text-[12px]">{isTrendUp ? "arrow_upward" : "arrow_downward"}</span>
            </span>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-4 mt-1 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sidebar"></div>
          <span className="text-[10px] text-text-secondary font-medium">Penjualan Utama</span>
        </div>
      </div>

      {/* Custom Bar Chart */}
      <div className="flex-1 mt-1 relative min-h-[200px] sm:min-h-[220px] overflow-hidden">
        
        {/* Scrollable Container */}
        <div className={`flex items-end h-full overflow-x-auto pb-2 pt-14 px-2 custom-scrollbar w-full ${
          data.length <= 12 ? 'justify-around' : 'justify-start'
        } ${data.length > 20 ? 'gap-2' : 'gap-4 sm:gap-6'}`}>
          
          {data.map((item, idx) => {
            const isDense = data.length > 15;
            const isVeryDense = data.length > 20;
            
            // For 30 days, show about 6-7 labels (every 5 days). For 12 months, show all.
            const labelInterval = isDense ? Math.ceil(data.length / 6) : 1;
            const showLabel = !isDense || idx % labelInterval === 0 || idx === 0 || idx === data.length - 1;
            
            // Dynamic width based on density
            const barWidth = isVeryDense ? 'w-4 sm:w-5' : (isDense ? 'w-6 sm:w-8' : 'w-8 sm:w-12');

            return (
              <div key={idx} className={`flex flex-col items-center flex-shrink-0 ${barWidth} h-full justify-end group relative`}>
                
                {/* Desktop Tooltip on hover */}
                <div className="hidden sm:flex opacity-0 group-hover:opacity-100 absolute -top-12 bg-sidebar text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl transition-all transform translate-y-2 group-hover:translate-y-0 pointer-events-none whitespace-nowrap z-30 flex-col items-center">
                  <span>{item.label}</span>
                  <span className={item.solid === 0 ? 'text-gray-400' : 'text-primary-light'}>{item.solid === 0 ? 'Tidak ada data' : `${Math.round(item.solid)}%`}</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-sidebar"></div>
                </div>

                {/* Percentage label above bar - always visible, invisible placeholder when 0 */}
                <span className={`text-[8px] sm:text-[9px] font-bold mb-1 whitespace-nowrap ${
                  item.solid > 0 ? 'text-text-secondary' : 'invisible'
                }`}>
                  {item.solid > 0 ? `${Math.round(item.solid)}%` : '0%'}
                </span>

                {/* Bar Container */}
                <div className="w-full relative rounded-md overflow-hidden flex flex-col justify-end bg-gray-100/80 shadow-inner" style={{ height: '100%' }}>
                  {/* Solid Foreground */}
                  <div
                    className="w-full bg-sidebar absolute bottom-0 rounded-md z-10 transition-all duration-500 group-hover:bg-primary group-hover:shadow-[0_0_15px_rgba(255,63,26,0.3)]"
                    style={{ height: `${item.solid}%` }}
                  ></div>
                </div>
                
                {/* Label */}
                <span className={`text-[9px] sm:text-[10px] font-semibold text-text-secondary mt-2.5 transition-colors whitespace-nowrap text-center ${
                  showLabel ? 'opacity-100' : 'opacity-0 invisible'
                } group-hover:text-primary group-hover:opacity-100 group-hover:visible`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
