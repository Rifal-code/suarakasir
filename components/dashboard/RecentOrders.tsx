type Order = {
  id: string;
  product: string;
  date: string;
  payment: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: string;
};

type RecentOrdersProps = {
  orders?: Order[];
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  // Fallback data if orders are missing
  const data = orders && orders.length > 0 ? orders : [
    { id: "#202523", product: "Data Kosong/Error API", date: "-", payment: "-", amount: "Rp 0", status: "Error", statusColor: "danger", icon: "error" },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 border border-border-soft shadow-sm h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Pesanan Terbaru</h3>
          <p className="text-xs text-text-secondary mt-1">Lacak data pesanan terbaru dan informasi lainnya.</p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 bg-background border border-border-default rounded-full text-xs font-semibold hover:bg-border-soft transition-colors text-text-primary">
          Lihat Semua
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[11px] text-text-muted border-b border-border-soft">
              <th className="pb-4 font-semibold font-sans">Order ID</th>
              <th className="pb-4 font-semibold font-sans">Nama Produk</th>
              <th className="pb-4 font-semibold font-sans">Tanggal</th>
              <th className="pb-4 font-semibold font-sans">Jumlah</th>
              <th className="pb-4 font-semibold font-sans">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, idx) => (
              <tr key={idx} className="border-b border-border-soft/50 last:border-0 hover:bg-background/30 transition-colors">
                <td className="py-4 text-xs font-bold text-text-primary">{order.id}</td>
                <td className="py-4 text-xs font-bold text-text-primary flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center border border-border-soft">
                     <span className="material-symbols-outlined text-[16px] text-primary">{order.icon}</span>
                  </div>
                  <span className="line-clamp-1">{order.product}</span>
                </td>
                <td className="py-4 text-xs font-semibold text-text-secondary">{order.date}</td>
                <td className="py-4 text-xs font-bold text-text-primary">{order.amount}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    order.statusColor === 'info' ? 'bg-info/10 text-info' :
                    order.statusColor === 'success' ? 'bg-success/10 text-success' :
                    'bg-danger/10 text-danger'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
