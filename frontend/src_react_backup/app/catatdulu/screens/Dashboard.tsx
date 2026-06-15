import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, ArrowUpRight, ArrowDownRight, MoreHorizontal, FileText, CreditCard, Target } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { Card, Badge, Button, StatCard, SectionHeader, Avatar } from '../ui';
import { transactions, monthlyTrend, budgets, formatIDR } from '../data';
import type { Route } from '../Layout';

export function Dashboard({ setRoute }: { setRoute: (r: Route) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Halo, Ariana 👋"
        desc="Berikut ringkasan keuangan Anda untuk bulan Mei 2026."
        action={
          <div className="flex gap-2">
            <Button variant="outline" icon={<FileText className="w-4 h-4" />} onClick={() => setRoute('reports')}>Laporan</Button>
            <Button icon={<Plus className="w-4 h-4" />} onClick={() => setRoute('income')}>Tambah Transaksi</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Saldo" value={formatIDR(28450000)} delta="+12.4%" icon={<Wallet className="w-5 h-5" />} accent="primary" />
        <StatCard label="Pemasukan Bulan Ini" value={formatIDR(18980000)} delta="+8.2%" icon={<TrendingUp className="w-5 h-5" />} accent="success" />
        <StatCard label="Pengeluaran Bulan Ini" value={formatIDR(3381000)} delta="-15.3%" icon={<TrendingDown className="w-5 h-5" />} accent="danger" />
        <StatCard label="Tabungan" value={formatIDR(15600000)} delta="+22.1%" icon={<PiggyBank className="w-5 h-5" />} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Cash Flow</h3>
              <p className="text-xs text-muted-foreground mt-1">Pemasukan vs pengeluaran 6 bulan terakhir</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="info">Income</Badge>
              <Badge variant="danger">Expense</Badge>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="cf-income" x1="0" y1="0" x2="0" y2="1">
                  <stop key="s0" offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop key="s1" offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cf-expense" x1="0" y1="0" x2="0" y2="1">
                  <stop key="s0" offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop key="s1" offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis key="x" dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis key="y" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip key="tip" contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} formatter={(v: number) => formatIDR(v)} />
              <Area key="income" type="monotone" dataKey="income" name="Income" stroke="#3B82F6" strokeWidth={2.5} fill="url(#cf-income)" />
              <Area key="expense" type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2.5} fill="url(#cf-expense)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: TrendingUp, label: 'Income', color: 'bg-emerald-50 text-emerald-700', route: 'income' as Route },
              { icon: TrendingDown, label: 'Expense', color: 'bg-red-50 text-red-700', route: 'expense' as Route },
              { icon: Target, label: 'Budget', color: 'bg-amber-50 text-amber-700', route: 'budget' as Route },
              { icon: FileText, label: 'Reports', color: 'bg-blue-50 text-blue-700', route: 'reports' as Route },
            ].map((q) => (
              <button key={q.label} onClick={() => setRoute(q.route)} className="flex flex-col items-start gap-2 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition">
                <div className={`w-9 h-9 rounded-lg ${q.color} flex items-center justify-center`}>
                  <q.icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold">{q.label}</div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="mb-3">Notifikasi Terbaru</h4>
            <div className="space-y-3">
              {[
                { t: 'Budget Belanja 92%', desc: 'Sisa Rp 120.000', dot: 'bg-amber-500' },
                { t: 'Gaji masuk', desc: '+Rp 12.500.000', dot: 'bg-emerald-500' },
              ].map((n) => (
                <div key={n.t} className="flex items-start gap-3">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${n.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{n.t}</div>
                    <div className="text-[11px] text-muted-foreground">{n.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3>Transaksi Terbaru</h3>
              <p className="text-xs text-muted-foreground mt-1">5 transaksi terakhir</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setRoute('expense')}>Lihat semua →</Button>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="py-2 px-6 font-medium">Transaksi</th>
                  <th className="py-2 px-2 font-medium">Kategori</th>
                  <th className="py-2 px-2 font-medium">Tanggal</th>
                  <th className="py-2 px-2 font-medium">Status</th>
                  <th className="py-2 px-6 font-medium text-right">Nominal</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} onClick={() => setRoute('transaction-detail')} className="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {t.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{t.note}</div>
                          <div className="text-[11px] text-muted-foreground">{t.id} · {t.account}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-xs">{t.category}</td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{t.date}</td>
                    <td className="py-3 px-2">
                      <Badge variant={t.status === 'completed' ? 'success' : 'warning'}>{t.status}</Badge>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3>Budget Progress</h3>
              <p className="text-xs text-muted-foreground mt-1">Mei 2026</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setRoute('budget')}>Detail →</Button>
          </div>
          <div className="space-y-4">
            {budgets.slice(0, 5).map((b) => {
              const pct = Math.round((b.spent / b.allocated) * 100);
              return (
                <div key={b.id}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                      <span className="font-semibold">{b.category}</span>
                    </div>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: pct > 90 ? '#EF4444' : b.color }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{formatIDR(b.spent)}</span>
                    <span>dari {formatIDR(b.allocated)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
