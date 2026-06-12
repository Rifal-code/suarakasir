import React from "react";

export default function HistoryPage() {
  const orders = [
    { id: "#202523", product: "Airpods Pro Max", date: "28 Mar 2025", payment: "Mastercard", amount: "Rp 1.230.000", status: "In Progress", statusColor: "info", icon: "headphones" },
    { id: "#202522", product: "Summer Clothes", date: "27 Mar 2025", payment: "Paypal", amount: "Rp 3.112.000", status: "Complete", statusColor: "success", icon: "checkroom" },
    { id: "#202521", product: "Nike Shoes", date: "26 Mar 2025", payment: "Mastercard", amount: "Rp 1.211.000", status: "Waiting", statusColor: "danger", icon: "steps" },
    { id: "#202520", product: "Front Table CSS", date: "25 Mar 2025", payment: "Visa", amount: "Rp 42.121.000", status: "In Progress", statusColor: "info", icon: "table_restaurant" },
    { id: "#202519", product: "Nasi Goreng Spesial", date: "25 Mar 2025", payment: "QRIS", amount: "Rp 28.000", status: "Complete", statusColor: "success", icon: "restaurant" },
    { id: "#202518", product: "Es Kopi Susu Gula Aren", date: "25 Mar 2025", payment: "Tunai", amount: "Rp 18.000", status: "Complete", statusColor: "success", icon: "local_cafe" },
  ];

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto w-full">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Riwayat Transaksi</h2>
          <p className="text-sm text-text-secondary mt-1">Daftar lengkap riwayat pesanan dan transaksi Anda.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64 hidden sm:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              className="w-full bg-white pl-10 pr-4 py-2 rounded-full border border-border-default focus:outline-none focus:border-primary text-sm shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-default rounded-full text-sm font-semibold hover:bg-background transition-colors text-text-primary">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 md:p-8 border border-border-soft shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="text-[12px] text-text-muted border-b border-border-soft">
                <th className="pb-4 font-semibold font-sans">Order ID</th>
                <th className="pb-4 font-semibold font-sans">Nama Produk</th>
                <th className="pb-4 font-semibold font-sans">Tanggal</th>
                <th className="pb-4 font-semibold font-sans">Pembayaran</th>
                <th className="pb-4 font-semibold font-sans">Jumlah</th>
                <th className="pb-4 font-semibold font-sans">Status</th>
                <th className="pb-4 font-semibold font-sans text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-b border-border-soft/50 last:border-0 hover:bg-background/30 transition-colors">
                  <td className="py-4 text-sm font-bold text-text-primary">{order.id}</td>
                  <td className="py-4 text-sm font-bold text-text-primary flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border-soft">
                       <span className="material-symbols-outlined text-[20px] text-primary">{order.icon}</span>
                    </div>
                    {order.product}
                  </td>
                  <td className="py-4 text-sm font-semibold text-text-secondary">{order.date}</td>
                  <td className="py-4 text-sm font-semibold text-text-secondary">{order.payment}</td>
                  <td className="py-4 text-sm font-bold text-text-primary">{order.amount}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${
                      order.statusColor === 'info' ? 'bg-info/10 text-info' :
                      order.statusColor === 'success' ? 'bg-success/10 text-success' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-text-muted hover:text-text-primary bg-background rounded-full p-2 border border-border-soft">
                      <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
