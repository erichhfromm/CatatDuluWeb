import { useState, useEffect, useCallback } from 'react';
import { Plus, Target, TrendingUp, TrendingDown, Lightbulb, AlertCircle, Sparkles, Loader2, Trash2, Calendar } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Card, Button, Badge, Modal, Input, Label, SectionHeader, StatCard } from '../ui';
import { formatIDR, budgetsApi, analyticsApi, categoriesApi, type ApiBudget, type ApiMonthlyTrend, type ApiCategoryBreakdown, type ApiCategory } from '../api';
import { toast } from 'sonner';

export function BudgetScreen() {
  const [open, setOpen] = useState(false);
  const [budgets, setBudgets] = useState<ApiBudget[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<ApiCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [period, setPeriod] = useState<'daily'|'weekly'|'monthly'|'quarterly'|'yearly'>('monthly');
  const [selectedColor, setSelectedColor] = useState('#1E3A8A');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchBudgets = useCallback(async (fDate = fromDate, tDate = toDate) => {
    setLoading(true);
    try {
      const data = await budgetsApi.list({
        from_date: fDate || undefined,
        to_date: tDate || undefined,
      });
      setBudgets(data.data ?? []);
    } catch {
      toast.error('Gagal memuat daftar budget.');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBudgets(fromDate, toDate);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fromDate, toDate, fetchBudgets]);

  useEffect(() => {
    categoriesApi.list()
      .then((data) => setCategoryOptions(data.data ?? []))
      .catch(() => toast.error('Gagal memuat opsi kategori.'));
  }, []);

  const totalAlloc = budgets.reduce((a, b) => a + Number(b.amount ?? 0), 0);
  const totalSpent = budgets.reduce((a, b) => a + Number(b.spent_amount ?? 0), 0);
  const totalRemaining = budgets.reduce((a, b) => a + Number(b.remaining_amount ?? 0), 0);
  const overallPercentage = totalAlloc > 0 ? Math.min(100, Math.round((totalSpent / totalAlloc) * 100)) : 0;

  const handleSaveBudget = async () => {
    if (!budgetName.trim() || !allocatedAmount) return;
    const amountNum = parseFloat(allocatedAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Nominal anggaran tidak valid.');
      return;
    }
    if (selectedCategoryIds.length === 0) {
      toast.error('Pilih minimal satu kategori untuk budget ini.');
      return;
    }
    setSaving(true);
    try {
      const now = new Date();
      
      let startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
      let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      if (period === 'weekly') {
        const day = now.getDay() || 7; 
        if (day !== 1) now.setHours(-24 * (day - 1));
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        endDate.setHours(23, 59, 59);
      } else if (period === 'daily') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      } else if (period === 'yearly') {
        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      }

      // Format pad function to avoid UTC issues
      const pad = (n: number) => n.toString().padStart(2, '0');
      const fmtLocal = (d: Date) => 
        `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      
      const categoriesPayload = selectedCategoryIds.map((catId) => ({
        category_id: catId,
        allocated_amount: amountNum / selectedCategoryIds.length,
      }));

      await budgetsApi.create({
        name: budgetName.trim(),
        amount: amountNum,
        period,
        start_date: fmtLocal(startDate),
        end_date: fmtLocal(endDate),
        color: selectedColor,
        categories: categoriesPayload,
      });
      toast.success('Budget berhasil dibuat!');
      setBudgetName(''); setAllocatedAmount(''); setPeriod('monthly'); setSelectedColor('#1E3A8A');
      setSelectedCategoryIds([]);
      setOpen(false);
      fetchBudgets();
    } catch (e: any) {
      toast.error(e.message ?? 'Gagal membuat budget.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (id: number) => {
    if (!confirm('Hapus budget ini?')) return;
    try {
      await budgetsApi.delete(id);
      toast.success('Budget dihapus.');
      fetchBudgets();
    } catch {
      toast.error('Gagal menghapus budget.');
    }
  };

  if (loading && budgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm">Memuat data budget...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Budget Planning"
        desc="Atur anggaran bulanan untuk setiap kategori pengeluaran Anda."
        action={<Button icon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>Buat Budget</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Anggaran" value={formatIDR(totalAlloc)} icon={<Target className="w-5 h-5" />} accent="primary" />
        <StatCard label="Sudah Terpakai" value={formatIDR(totalSpent)} delta={`${overallPercentage}%`} icon={<TrendingDown className="w-5 h-5" />} accent="warning" />
        <StatCard label="Sisa Anggaran" value={formatIDR(totalRemaining)} icon={<TrendingUp className="w-5 h-5" />} accent="success" />
      </div>

      <Card className="p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter Tanggal:</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Dari:</span>
          <Input 
            type="date" 
            className="w-36 h-10 text-xs" 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sampai:</span>
          <Input 
            type="date" 
            className="w-36 h-10 text-xs" 
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)} 
          />
        </div>
        {(fromDate || toDate) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setFromDate(''); setToDate(''); }}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Reset
          </Button>
        )}
      </Card>

      {budgets.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="mb-1">Belum ada budget</h3>
            <p className="text-muted-foreground text-sm">Mulai rencanakan anggaran bulanan Anda.</p>
          </div>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>Buat Budget Pertama</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const color = b.color ?? '#3B82F6';
            const spent = b.spent_amount ?? 0;
            const pct = Math.min(100, b.percentage_used ?? 0);
            return (
              <Card key={b.id} hover className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, color }}>
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-[11px] text-muted-foreground capitalize">{b.period}</div>
                    </div>
                  </div>
                  <Badge variant="success">Aktif</Badge>
                </div>

                <div className="mb-3">
                  <div className="text-2xl font-bold">{formatIDR(b.amount)}</div>
                  <div className="text-xs text-muted-foreground">Total anggaran</div>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>

                <div className="flex justify-between items-center text-[11px] text-muted-foreground mb-4">
                  <span>Terpakai: <b>{formatIDR(spent)}</b> ({pct}%)</span>
                  <span>Sisa: <b>{formatIDR(b.remaining_amount ?? 0)}</b></span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex-1 truncate mr-2">Periode: <b className="text-foreground">{b.start_date?.slice(0, 10)} – {b.end_date?.slice(0, 10)}</b></span>
                  <button onClick={() => handleDeleteBudget(b.id)} className="flex items-center gap-1 text-red-500 font-semibold hover:underline flex-shrink-0">
                    <Trash2 className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Buat Budget Baru"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={handleSaveBudget} disabled={saving || !budgetName.trim() || !allocatedAmount}>
              {saving ? 'Menyimpan...' : 'Simpan Budget'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label required>Nama Budget</Label>
            <Input placeholder="Contoh: Anggaran Makanan & Minuman" value={budgetName} onChange={(e) => setBudgetName(e.target.value)} />
          </div>
          <div>
            <Label required>Total Anggaran (Rp)</Label>
            <Input type="number" placeholder="2000000" value={allocatedAmount} onChange={(e) => setAllocatedAmount(e.target.value)} />
          </div>
          <div>
            <Label required>Kategori yang Dipantau</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-border rounded-lg bg-muted/20">
              {categoryOptions.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);
                return (
                  <label key={cat.id} className="flex items-center gap-2 text-xs cursor-pointer p-1.5 hover:bg-muted rounded transition-colors">
                    <input
                      type="checkbox"
                      className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                      checked={isSelected}
                      onChange={() => {
                        setSelectedCategoryIds(prev => 
                          isSelected 
                            ? prev.filter(id => id !== cat.id) 
                            : [...prev, cat.id]
                        );
                      }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </label>
                );
              })}
            </div>
            {categoryOptions.length === 0 && (
              <p className="text-[11px] text-muted-foreground mt-1">Belum ada kategori pengeluaran tersedia.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Periode</Label>
              <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" value={period} onChange={(e) => setPeriod(e.target.value as any)}>
                <option value="daily">Harian</option>
                <option value="weekly">Mingguan</option>
                <option value="monthly">Bulanan</option>
                <option value="quarterly">Kuartalan</option>
                <option value="yearly">Tahunan</option>
              </select>
            </div>
            <div>
              <Label>Warna</Label>
              <div className="flex gap-2 h-10 items-center">
                {['#1E3A8A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((c) => (
                  <button
                    key={c}
                    className={`w-7 h-7 rounded-full border-2 shadow transition-all ${selectedColor === c ? 'border-primary scale-110' : 'border-white hover:scale-105'}`}
                    style={{ background: c }}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function AnalyticsScreen() {
  const [trendData, setTrendData] = useState<ApiMonthlyTrend[]>([]);
  const [categoryData, setCategoryData] = useState<ApiCategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.monthlyTrend(6),
      analyticsApi.categoryBreakdown('expense'),
    ])
      .then(([trend, cats]) => {
        setTrendData(trend ?? []);
        setCategoryData(cats ?? []);
      })
      .catch(() => toast.error('Gagal memuat data analitik.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm">Memuat analitik...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Financial Analytics" desc="Pahami arus kas dan pola keuangan Anda dengan visualisasi mendalam." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="mb-1">Tren Bulanan</h3>
          <p className="text-xs text-muted-foreground mb-4">Pemasukan vs pengeluaran dalam 6 bulan terakhir</p>
          {trendData.length === 0 ? (
            <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
              Belum ada data transaksi untuk ditampilkan.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trendData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis key="x" dataKey="month" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} />
                <YAxis key="y" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
                <Tooltip key="tip" contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => formatIDR(v)} />
                <Legend key="legend" wrapperStyle={{ fontSize: 12 }} />
                <Bar key="income" dataKey="income" name="Income" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                <Bar key="expense" dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-1">Kategori Pengeluaran</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribusi bulan ini</p>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
              Belum ada data pengeluaran.
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie key="pie" data={categoryData} dataKey="total" nameKey="category_name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {categoryData.map((e) => <Cell key={e.category_name} fill={e.color ?? '#6B7280'} />)}
                  </Pie>
                  <Tooltip key="tip" formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {categoryData.slice(0, 5).map((c) => (
                  <div key={c.category_name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: c.color ?? '#6B7280' }} /> {c.category_name}</div>
                    <span className="font-semibold">{formatIDR(c.total)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-1">Pertumbuhan Pemasukan</h3>
          <p className="text-xs text-muted-foreground mb-4">Tren 6 bulan</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="growth-income" x1="0" y1="0" x2="0" y2="1">
                  <stop key="s0" offset="0%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop key="s1" offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis key="x" dataKey="month" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} />
              <YAxis key="y" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip key="tip" formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Area key="income" type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2.5} fill="url(#growth-income)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-1">Cash Flow Analysis</h3>
          <p className="text-xs text-muted-foreground mb-4">Net cash flow per bulan</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData.map((m) => ({ ...m, net: m.income - m.expense }))}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis key="x" dataKey="month" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} />
              <YAxis key="y" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip key="tip" formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Line key="net" type="monotone" dataKey="net" name="Net Flow" stroke="#1E3A8A" strokeWidth={3} dot={{ r: 4, fill: '#1E3A8A' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3>Financial Insights</h3>
        </div>
        {trendData.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-4">
            Tambahkan transaksi untuk melihat insights keuangan Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, color: 'emerald', t: 'Data dari API', d: 'Grafik di atas menampilkan data transaksi nyata dari akun Anda.' },
              { icon: AlertCircle, color: 'amber', t: 'Pantau pengeluaran', d: 'Cek kategori dengan persentase terbesar di grafik pie di atas.' },
              { icon: Lightbulb, color: 'blue', t: 'Peluang menabung', d: `Net cashflow bulan ini: ${formatIDR((trendData[trendData.length - 1]?.income ?? 0) - (trendData[trendData.length - 1]?.expense ?? 0))}.` },
            ].map((i) => (
              <div key={i.t} className={`p-4 rounded-xl border bg-${i.color}-50 border-${i.color}-100`}>
                <div className={`w-9 h-9 rounded-lg bg-${i.color}-100 text-${i.color}-700 flex items-center justify-center mb-3`}>
                  <i.icon className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm mb-1">{i.t}</div>
                <div className="text-xs text-muted-foreground">{i.d}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
