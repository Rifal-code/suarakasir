/**
 * Shared Order utilities.
 * Dipakai oleh Dashboard (RecentOrders) dan History page agar
 * mapping data & status selalu konsisten.
 */

export type OrderItem = {
  product_name: string;
  quantity: number;
  unit_price?: number;
};

export type MappedOrder = {
  id: string;
  rawId: string;
  product: string;
  items: OrderItem[];
  date: string;
  price: string;
  amount: string;
  status: string;
  statusColor: string;
  icon: string;
};

const formatRp = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

/**
 * Resolve status dari API (TINYINT) ke label & warna.
 * 0 = Pending (warning), 1 = Selesai (success)
 */
export function resolveOrderStatus(status: number): { label: string; color: string; icon: string } {
  switch (status) {
    case 1:
      return { label: "Selesai", color: "success", icon: "receipt_long" };
    case 0:
    default:
      return { label: "Pending", color: "warning", icon: "pending_actions" };
  }
}

/**
 * Map raw API order object ke MappedOrder yang siap dipakai komponen.
 * @param dateStyle - 'short' untuk dashboard (tanggal saja), 'full' untuk history (tanggal + jam)
 */
export function mapApiOrder(o: any, dateStyle: 'short' | 'full' = 'short'): MappedOrder {
  const { label, color, icon } = resolveOrderStatus(o.status);

  const dateOptions: Intl.DateTimeFormatOptions = dateStyle === 'full'
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : {};

  return {
    id: `#${o.id?.substring(0, 6) || 'XXXX'}`,
    rawId: o.id,
    product: o.items?.[0]?.product_name || "Produk",
    items: o.items || [],
    date: new Date(o.created_at || Date.now()).toLocaleDateString('id-ID', dateOptions),
    price: formatRp(o.items?.[0]?.unit_price || 0),
    amount: formatRp(Number(o.total_amount)),
    status: label,
    statusColor: color,
    icon,
  };
}
