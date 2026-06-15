import { Download, FileSpreadsheet, FileText, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, Button, Badge, Input, Label, SectionHeader, StatCard } from '../ui';
import { monthlyTrend, transactions, formatIDR } from '../data';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

export function ReportsScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Laporan Keuangan"
        desc="Generate laporan lengkap dengan periode yang dapat disesuaikan."
        action={
          <div className="flex gap-2">
            <Button variant="outline" icon={<FileSpreadsheet className="w-4 h-4" />}>Export Excel</Button>
            <Button icon={<FileText className="w-4 h-4" />}>Export PDF</Button>
          </div>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Periode</Label>
            <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
              <option>Bulan Ini</option><option>Bulan Lalu</option><option>3 Bulan Terakhir</option><option>Tahun Ini</option><option>Custom</option>
            </select>
          </div>
          <div>
            <Label>Dari Tanggal</Label>
            <Input type="date" defaultValue="2026-05-01" />
          </div>
          <div>
            <Label>Sampai Tanggal</Label>
            <Input type="date" defaultValue="2026-05-31" />
          </div>
          <div>
            <Label>Tipe</Label>
            <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
              <option>Semua</option><option>Pemasukan</option><option>Pengeluaran</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>Reset</Button>
          <Button>Generate Laporan</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Pemasukan" value={formatIDR(18980000)} icon={<TrendingUp className="w-5 h-5" />} accent="success" />
        <StatCard label="Total Pengeluaran" value={formatIDR(3381000)} icon={<TrendingDown className="w-5 h-5" />} accent="danger" />
        <StatCard label="Net Saldo" value={formatIDR(15599000)} icon={<Wallet className="w-5 h-5" />} accent="primary" />
        <StatCard label="Tingkat Tabungan" value="82%" icon={<PiggyBank className="w-5 h-5" />} accent="warning" />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3>Ringkasan Bulanan</h3>
            <p className="text-xs text-muted-foreground mt-1">Perbandingan 6 bulan</p>
          </div>
          <Badge variant="info">PDF Ready</Badge>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis key="x" dataKey="month" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} />
            <YAxis key="y" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
            <Tooltip key="tip" formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            <Legend key="legend" wrapperStyle={{ fontSize: 12 }} />
            <Bar key="income" dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar key="expense" dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3>Detail Transaksi Periode</h3>
          <p className="text-xs text-muted-foreground mt-1">Semua transaksi dalam rentang yang dipilih</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Tanggal</th>
              <th className="py-3 px-2 text-left font-semibold">Deskripsi</th>
              <th className="py-3 px-2 text-left font-semibold">Kategori</th>
              <th className="py-3 px-2 text-left font-semibold">Tipe</th>
              <th className="py-3 px-6 text-right font-semibold">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 8).map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="py-3 px-6 text-xs">{t.date}</td>
                <td className="py-3 px-2 font-semibold">{t.note}</td>
                <td className="py-3 px-2"><Badge variant="outline">{t.category}</Badge></td>
                <td className="py-3 px-2"><Badge variant={t.type === 'income' ? 'success' : 'danger'}>{t.type}</Badge></td>
                <td className={`py-3 px-6 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
