export default function RecentTransactions() {
  const transactions = [
    { id: "#202523", product: "Ayam Bakar Madu", date: "28 Mar 2025", method: "QRIS / Dana", total: "Rp 45.000", status: "Diproses", statusColor: "warning" },
    { id: "#202522", product: "Salad Buah Segar", date: "27 Mar 2025", method: "Tunai", total: "Rp 25.000", status: "Berhasil", statusColor: "success" },
    { id: "#202521", product: "Es Kopi Susu Gula Aren", date: "26 Mar 2025", method: "Gopay", total: "Rp 18.000", status: "Dibatalkan", statusColor: "danger" },
  ];

  return (
    <div className="bg-card rounded-3xl p-6 shadow-sm border border-border-soft">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Transaksi Terbaru</h3>
          <p className="text-xs text-text-secondary mt-1">Daftar transaksi real-time hari ini.</p>
        </div>
        <button className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-1">
          Lihat Semua <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-text-secondary border-b border-border-default">
              <th className="pb-3 font-semibold">ID Transaksi</th>
              <th className="pb-3 font-semibold">Produk</th>
              <th className="pb-3 font-semibold">Tanggal</th>
              <th className="pb-3 font-semibold">Metode</th>
              <th className="pb-3 font-semibold">Total</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="border-b border-border-soft/50 last:border-0 hover:bg-background/50 transition-colors">
                <td className="py-4 text-sm font-medium text-text-muted">{tx.id}</td>
                <td className="py-4 text-sm font-semibold text-text-primary flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-background border border-border-default"></div>
                  {tx.product}
                </td>
                <td className="py-4 text-sm text-text-secondary">{tx.date}</td>
                <td className="py-4 text-sm text-text-secondary font-medium">{tx.method}</td>
                <td className="py-4 text-sm font-bold text-text-primary">{tx.total}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-${tx.statusColor} bg-${tx.statusColor}/10`}>
                    {tx.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-text-muted hover:text-text-primary">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
