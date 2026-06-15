import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, ArrowUpRight, ArrowDownRight, FileText, Target, Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card, Badge, Button, StatCard, SectionHeader } from '../ui';
import { formatIDR } from '../api';
import { dashboardApi, budgetsApi, type ApiTransaction, type DashboardStats, type ApiBudget } from '../api';
import type { Route } from '../Layout';

export function Dashboard({ setRoute }: { setRoute: (r: Route) => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<ApiTransaction[]>([]);
  const [budgets, setBudgets] = useState<ApiBudget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardApi.stats(),
      dashboardApi.recentTransactions(5),
      budgetsApi.list(),
    ])
      .then(([statsData, recentData, budgetData]) => {
        setStats(statsData);
        setRecent(recentData.transactions ?? []);
        setBudgets(budgetData.data ?? []);
      })
      .catch(() => setError('Gagal memuat data dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-sm">Memuat dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3 text-destructive">
        <span className="text-sm font-semibold">{error}</span>
        <Button variant="outline" onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    );
  }

  const userName = stats?.user?.name?.split(' ')[0] ?? 'Pengguna';
  const totalBalance = stats?.balance?.total ?? 0;
  const monthlyIncome = stats?.balance?.monthly_income ?? 0;
  const monthlyExpense = stats?.balance?.monthly_expense ?? 0;
  const savings = monthlyIncome - monthlyExpense;

  // Build chart data: last 6 months labels (placeholder karena butuh endpoint analytics)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
  const chartData = months.map((month) => ({
    month,
    income: monthlyIncome,
    expense: monthlyExpense,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title={`Halo, ${userName} 👋`}
        desc={`Berikut ringkasan keuangan Anda.`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" icon={<FileText className="w-4 h-4" />} onClick={() => setRoute('reports')}>Laporan</Button>
            <Button icon={<Plus className="w-4 h-4" />} onClick={() => setRoute('income')}>Tambah Transaksi</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Saldo" value={formatIDR(totalBalance)} icon={<Wallet className="w-5 h-5" />} accent="primary" />
        <StatCard label="Pemasukan Bulan Ini" value={formatIDR(monthlyIncome)} icon={<TrendingUp className="w-5 h-5" />} accent="success" />
        <StatCard label="Pengeluaran Bulan Ini" value={formatIDR(monthlyExpense)} icon={<TrendingDown className="w-5 h-5" />} accent="danger" />
        <StatCard label="Tabungan Bersih" value={formatIDR(savings)} icon={<PiggyBank className="w-5 h-5" />} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Cash Flow</h3>
              <p className="text-xs text-muted-foreground mt-1">Pemasukan vs pengeluaran bulan ini</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cf-income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cf-expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} formatter={(v: number) => formatIDR(v)} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#3B82F6" strokeWidth={2.5} fill="url(#cf-income)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" strokeWidth={2.5} fill="url(#cf-expense)" />
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
            <h4 className="mb-3">Ringkasan</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <div className="font-semibold">Total Transaksi</div>
                  <div className="text-muted-foreground">{stats?.summary?.transactions_count ?? 0} transaksi tercatat</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                <div className="flex-1">
                  <div className="font-semibold">Budget Aktif</div>
                  <div className="text-muted-foreground">{stats?.summary?.budgets_active ?? 0} anggaran berjalan</div>
                </div>
              </div>
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
          {recent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Belum ada transaksi. <button className="text-primary font-semibold hover:underline" onClick={() => setRoute('income')}>Tambah sekarang →</button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted-foreground border-b border-border">
                    <th className="py-2 px-6 font-medium">Transaksi</th>
                    <th className="py-2 px-2 font-medium">Kategori</th>
                    <th className="py-2 px-2 font-medium">Tanggal</th>
                    <th className="py-2 px-6 font-medium text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {t.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{t.description}</div>
                            <div className="text-[11px] text-muted-foreground">{t.payment_method}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-xs">{t.category?.name ?? '-'}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{t.transaction_date?.slice(0, 10)}</td>
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
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3>Budget Progress</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setRoute('budget')}>Detail →</Button>
          </div>
          {budgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Belum ada budget. <button className="text-primary font-semibold hover:underline" onClick={() => setRoute('budget')}>Buat sekarang →</button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.slice(0, 5).map((b) => {
                const spent = 0; // budget belum punya spent field di API, tampilkan allocated
                const pct = 0;
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: b.color ?? '#3B82F6' }} />
                        <span className="font-semibold">{b.name}</span>
                      </div>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: b.color ?? '#3B82F6' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Rp 0</span>
                      <span>dari {formatIDR(b.amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
