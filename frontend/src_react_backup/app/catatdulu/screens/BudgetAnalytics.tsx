import { useState } from 'react';
import { Plus, Target, TrendingUp, TrendingDown, Lightbulb, AlertCircle, Sparkles } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Card, Button, Badge, Modal, Input, Label, SectionHeader, StatCard } from '../ui';
import { budgets, expenseByCategory, monthlyTrend, formatIDR } from '../data';

export function BudgetScreen() {
  const [open, setOpen] = useState(false);
  const totalAlloc = budgets.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = budgets.reduce((a, b) => a + b.spent, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Budget Planning"
        desc="Atur anggaran bulanan untuk setiap kategori pengeluaran Anda."
        action={<Button icon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>Buat Budget</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Anggaran" value={formatIDR(totalAlloc)} icon={<Target className="w-5 h-5" />} accent="primary" />
        <StatCard label="Sudah Terpakai" value={formatIDR(totalSpent)} delta={`${Math.round((totalSpent / totalAlloc) * 100)}%`} icon={<TrendingDown className="w-5 h-5" />} accent="warning" />
        <StatCard label="Sisa Anggaran" value={formatIDR(totalAlloc - totalSpent)} delta="+22%" icon={<TrendingUp className="w-5 h-5" />} accent="success" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.allocated) * 100);
          const status = pct > 90 ? 'danger' : pct > 70 ? 'warning' : 'success';
          return (
            <Card key={b.id} hover className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${b.color}15`, color: b.color }}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{b.category}</div>
                    <div className="text-[11px] text-muted-foreground">Bulanan</div>
                  </div>
                </div>
                <Badge variant={status as any}>{pct}%</Badge>
              </div>

              <div className="mb-3">
                <div className="text-2xl font-bold">{formatIDR(b.spent)}</div>
                <div className="text-xs text-muted-foreground">dari {formatIDR(b.allocated)}</div>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: pct > 90 ? '#EF4444' : b.color }} />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Sisa: <b className="text-foreground">{formatIDR(b.allocated - b.spent)}</b></span>
                <button className="text-primary font-semibold hover:underline">Detail</button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Buat Budget Baru"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={() => setOpen(false)}>Simpan Budget</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label required>Nama Kategori</Label>
            <Input placeholder="Contoh: Makanan & Minuman" />
          </div>
          <div>
            <Label required>Anggaran Bulanan</Label>
            <Input type="number" placeholder="2000000" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Periode</Label>
              <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
                <option>Bulanan</option><option>Mingguan</option><option>Tahunan</option>
              </select>
            </div>
            <div>
              <Label>Warna</Label>
              <div className="flex gap-2 h-10 items-center">
                {['#1E3A8A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((c) => (
                  <button key={c} className="w-7 h-7 rounded-full border-2 border-white shadow" style={{ background: c }} />
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
  return (
    <div className="space-y-6">
      <SectionHeader title="Financial Analytics" desc="Pahami arus kas dan pola keuangan Anda dengan visualisasi mendalam." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="mb-1">Tren Bulanan</h3>
          <p className="text-xs text-muted-foreground mb-4">Pemasukan vs pengeluaran dalam 6 bulan terakhir</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis key="x" dataKey="month" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} />
              <YAxis key="y" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
              <Tooltip key="tip" contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v: number) => formatIDR(v)} />
              <Legend key="legend" wrapperStyle={{ fontSize: 12 }} />
              <Bar key="income" dataKey="income" name="Income" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              <Bar key="expense" dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-1">Kategori Pengeluaran</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribusi Mei 2026</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie key="pie" data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {expenseByCategory.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip key="tip" formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {expenseByCategory.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: c.color }} /> {c.name}</div>
                <span className="font-semibold">{formatIDR(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-1">Pertumbuhan Pemasukan</h3>
          <p className="text-xs text-muted-foreground mb-4">Tren 6 bulan</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyTrend}>
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
            <LineChart data={monthlyTrend.map((m) => ({ ...m, net: m.income - m.expense }))}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, color: 'emerald', t: 'Pemasukan naik 17%', d: 'Pemasukan bulan ini meningkat dibanding April. Pertahankan momentum!' },
            { icon: AlertCircle, color: 'amber', t: 'Kategori Belanja tinggi', d: 'Pengeluaran belanja 92% dari budget. Pertimbangkan menahan pembelian non-esensial.' },
            { icon: Lightbulb, color: 'blue', t: 'Peluang menabung', d: 'Sisa cashflow sebesar 15jt bisa Anda alokasikan ke reksadana atau emas digital.' },
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
      </Card>
    </div>
  );
}
