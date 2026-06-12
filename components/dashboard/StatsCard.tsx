export default function StatsCard({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon, 
  color = "primary" 
}: { 
  title: string; 
  value: string; 
  trend: "up" | "down"; 
  trendValue: string; 
  icon?: string;
  color?: "primary" | "success" | "warning" | "info" 
}) {
  const isUp = trend === "up";
  
  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border-soft hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">{title}</h3>
        {icon && (
          <div className={`w-10 h-10 rounded-full bg-${color}/10 flex items-center justify-center text-${color}`}>
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-text-primary">{value}</p>
        
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
          isUp ? "text-success bg-success/10" : "text-danger bg-danger/10"
        }`}>
          <span className="material-symbols-outlined text-[14px]">
            {isUp ? "trending_up" : "trending_down"}
          </span>
          {trendValue}
        </div>
      </div>
    </div>
  );
}
