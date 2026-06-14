import Link from "next/link";

type SummaryCardProps = {
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down";
  icon: string;
  linkText: string;
  href?: string;
};

export default function SummaryCard({ title, value, trend, trendType, icon, linkText, href }: SummaryCardProps) {
  const isUp = trendType === "up";

  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-text-secondary">{title}</h3>
        <div className="w-10 h-10 rounded-2xl border border-border-default flex items-center justify-center">
          <span className="material-symbols-outlined text-text-primary text-[20px]">{icon}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <p className="text-3xl font-black text-text-primary tracking-tight">{value}</p>
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${isUp ? "bg-success/20 text-success" : "bg-danger/20 text-danger"
          }`}>
          {trend}
          <span className="material-symbols-outlined text-[12px]">{isUp ? "arrow_upward" : "arrow_downward"}</span>
        </span>
      </div>

      <div className="border-t border-border-soft pt-4 mt-auto">
        {href ? (
          <Link href={href} className="flex items-center justify-between w-full text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
            {linkText}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        ) : (
          <button className="flex items-center justify-between w-full text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors">
            {linkText}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
}
