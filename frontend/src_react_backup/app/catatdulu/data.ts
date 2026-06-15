export type TxType = 'income' | 'expense';
export interface Transaction {
  id: string;
  type: TxType;
  category: string;
  amount: number;
  date: string;
  note: string;
  account: string;
  status: 'completed' | 'pending';
}

export const formatIDR = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export const transactions: Transaction[] = [
  { id: 'TX-1001', type: 'income', category: 'Gaji', amount: 12500000, date: '2026-05-28', note: 'Gaji bulanan Mei', account: 'BCA', status: 'completed' },
  { id: 'TX-1002', type: 'expense', category: 'Makanan', amount: 185000, date: '2026-05-28', note: 'Makan siang tim', account: 'Cash', status: 'completed' },
  { id: 'TX-1003', type: 'expense', category: 'Transportasi', amount: 75000, date: '2026-05-27', note: 'Gojek ke kantor', account: 'GoPay', status: 'completed' },
  { id: 'TX-1004', type: 'income', category: 'Freelance', amount: 3500000, date: '2026-05-25', note: 'Project landing page', account: 'BCA', status: 'completed' },
  { id: 'TX-1005', type: 'expense', category: 'Belanja', amount: 420000, date: '2026-05-24', note: 'Groceries Tokopedia', account: 'BCA', status: 'completed' },
  { id: 'TX-1006', type: 'expense', category: 'Hiburan', amount: 159000, date: '2026-05-22', note: 'Netflix + Spotify', account: 'Mandiri', status: 'completed' },
  { id: 'TX-1007', type: 'expense', category: 'Tagihan', amount: 850000, date: '2026-05-20', note: 'Listrik & Internet', account: 'BCA', status: 'completed' },
  { id: 'TX-1008', type: 'income', category: 'Investasi', amount: 980000, date: '2026-05-18', note: 'Dividen reksadana', account: 'BCA', status: 'pending' },
  { id: 'TX-1009', type: 'expense', category: 'Kesehatan', amount: 350000, date: '2026-05-15', note: 'Vitamin & checkup', account: 'BCA', status: 'completed' },
  { id: 'TX-1010', type: 'expense', category: 'Makanan', amount: 92000, date: '2026-05-14', note: 'Kopi & sarapan', account: 'OVO', status: 'completed' },
  { id: 'TX-1011', type: 'expense', category: 'Pendidikan', amount: 1250000, date: '2026-05-10', note: 'Kursus online UX', account: 'BCA', status: 'completed' },
  { id: 'TX-1012', type: 'income', category: 'Bonus', amount: 2000000, date: '2026-05-05', note: 'Bonus Q1', account: 'BCA', status: 'completed' },
];

export const monthlyTrend = [
  { month: 'Des', income: 14000000, expense: 8200000 },
  { month: 'Jan', income: 14500000, expense: 9100000 },
  { month: 'Feb', income: 13800000, expense: 7800000 },
  { month: 'Mar', income: 15200000, expense: 8900000 },
  { month: 'Apr', income: 16100000, expense: 9400000 },
  { month: 'Mei', income: 18980000, expense: 3381000 },
];

export const expenseByCategory = [
  { name: 'Tagihan', value: 850000, color: '#1E3A8A' },
  { name: 'Belanja', value: 420000, color: '#3B82F6' },
  { name: 'Pendidikan', value: 1250000, color: '#10B981' },
  { name: 'Makanan', value: 277000, color: '#F59E0B' },
  { name: 'Kesehatan', value: 350000, color: '#EF4444' },
  { name: 'Hiburan', value: 159000, color: '#8B5CF6' },
  { name: 'Transportasi', value: 75000, color: '#06B6D4' },
];

export const budgets = [
  { id: 'b1', category: 'Makanan', allocated: 2000000, spent: 1240000, color: '#F59E0B' },
  { id: 'b2', category: 'Transportasi', allocated: 800000, spent: 620000, color: '#06B6D4' },
  { id: 'b3', category: 'Belanja', allocated: 1500000, spent: 1380000, color: '#3B82F6' },
  { id: 'b4', category: 'Hiburan', allocated: 500000, spent: 159000, color: '#8B5CF6' },
  { id: 'b5', category: 'Tagihan', allocated: 1000000, spent: 850000, color: '#1E3A8A' },
  { id: 'b6', category: 'Kesehatan', allocated: 600000, spent: 350000, color: '#EF4444' },
];

export const notifications = [
  { id: 'n1', title: 'Budget Makanan hampir habis', desc: 'Anda telah menggunakan 92% dari budget Belanja bulan ini.', time: '5 menit lalu', read: false, type: 'warning' as const },
  { id: 'n2', title: 'Pemasukan baru tercatat', desc: 'Gaji bulanan sebesar Rp 12.500.000 berhasil masuk.', time: '2 jam lalu', read: false, type: 'success' as const },
  { id: 'n3', title: 'Laporan Mei siap diunduh', desc: 'Laporan keuangan bulanan Anda telah selesai dirangkum.', time: 'Kemarin', read: true, type: 'info' as const },
  { id: 'n4', title: 'Pengingat tagihan listrik', desc: 'Tagihan jatuh tempo dalam 3 hari (Rp 450.000).', time: '2 hari lalu', read: true, type: 'warning' as const },
  { id: 'n5', title: 'Target tabungan tercapai 60%', desc: 'Anda satu langkah lebih dekat ke goal "Liburan Bali".', time: '3 hari lalu', read: true, type: 'success' as const },
];
