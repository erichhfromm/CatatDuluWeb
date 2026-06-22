import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2, ArrowRight, TrendingUp, TrendingDown, Wallet, PiggyBank, Scale } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, Button, Badge, SectionHeader, StatCard, Input, Label } from '../ui';
import { formatIDR, reportsApi, analyticsApi, type ApiDetailedReport, type ApiComparisonStats } from '../api';
import { toast } from 'sonner';

export function ReportsScreen() {
  const [activeTab, setActiveTab] = useState<'detailed' | 'comparative'>('detailed');

  // Detailed Report State
  const [report, setReport] = useState<ApiDetailedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Comparative Report State
  const [p1From, setP1From] = useState('');
  const [p1To, setP1To] = useState('');
  const [p2From, setP2From] = useState('');
  const [p2To, setP2To] = useState('');
  const [compLoading, setCompLoading] = useState(false);
  const [compData, setCompData] = useState<{ p1: ApiComparisonStats; p2: ApiComparisonStats } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await reportsApi.generateDetailed();
      setReport(res.data);
      toast.success('Laporan berhasil dibuat!');
    } catch (e: any) {
      toast.error(e.message ?? 'Gagal membuat laporan.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    format === 'csv' ? setExportingCsv(true) : setExportingPdf(true);
    try {
      const res = await reportsApi.export(format);
      if (res.download_url) {
        window.open(res.download_url, '_blank');
        toast.success(`Berhasil mengunduh laporan ${format.toUpperCase()}`);
      } else {
        throw new Error('URL download tidak ditemukan');
      }
    } catch (e: any) {
      toast.error(e.message ?? `Gagal mengunduh laporan ${format.toUpperCase()}`);
    } finally {
      format === 'csv' ? setExportingCsv(false) : setExportingPdf(false);
    }
  };

  const handleCompare = async () => {
    if (!p1From || !p1To || !p2From || !p2To) {
      toast.error('Harap lengkapi semua tanggal periode.');
      return;
    }
    setCompLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        analyticsApi.comparison(p1From, p1To),
        analyticsApi.comparison(p2From, p2To)
      ]);
      setCompData({ p1: res1, p2: res2 });
      toast.success('Perbandingan berhasil dihitung!');
    } catch (e: any) {
      toast.error(e.message ?? 'Gagal menghitung perbandingan.');
    } finally {
      setCompLoading(false);
    }
  };

  const renderComparisonDiff = (val1: number, val2: number, invertColors = false) => {
    const diff = val2 - val1;
    const pct = val1 > 0 ? (diff / val1) * 100 : 0;
    const isPositive = diff > 0;
    const isGood = invertColors ? !isPositive : isPositive;
    
    if (diff === 0) return <span className="text-muted-foreground text-xs font-medium">Sama</span>;
    
    return (
      <div className={`flex items-center gap-1 text-xs font-semibold ${isGood ? 'text-emerald-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(pct).toFixed(1)}% ({formatIDR(Math.abs(diff))})
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Laporan & Analisis"
        desc="Generate laporan lengkap atau bandingkan performa keuangan Anda antar periode."
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              icon={exportingCsv ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />} 
              onClick={() => handleExport('csv')}
              disabled={exportingCsv}
            >
              Export Excel
            </Button>
            <Button 
              icon={exportingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} 
              onClick={() => handleExport('pdf')}
              disabled={exportingPdf}
            >
              Export PDF
            </Button>
          </div>
        }
      />

      <div className="flex border-b border-border mb-6">
        <button
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'detailed' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('detailed')}
        >
          Laporan Bulanan
        </button>
        <button
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'comparative' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('comparative')}
        >
          <Scale className="w-4 h-4" /> Perbandingan Periode
        </button>
      </div>

      {activeTab === 'detailed' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground mb-4">Klik tombol di bawah untuk generate laporan bulanan berdasarkan transaksi aktual Anda.</p>
            <Button onClick={handleGenerate} disabled={loading} icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}>
              {loading ? 'Generating...' : 'Generate Laporan'}
            </Button>
          </Card>

          {!report ? (
            <Card className="p-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="mb-1">Laporan belum dibuat</h3>
                <p className="text-muted-foreground text-sm">Klik "Generate Laporan" untuk membuat laporan dari data transaksi nyata Anda.</p>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Pemasukan" value={formatIDR(report.income)} icon={<TrendingUp className="w-5 h-5" />} accent="success" />
                <StatCard label="Total Pengeluaran" value={formatIDR(report.expenses)} icon={<TrendingDown className="w-5 h-5" />} accent="danger" />
                <StatCard label="Net Saldo" value={formatIDR(report.net)} icon={<Wallet className="w-5 h-5" />} accent="primary" />
                <StatCard
                  label="Tingkat Tabungan"
                  value={report.income > 0 ? `${Math.round((report.net / report.income) * 100)}%` : '0%'}
                  icon={<PiggyBank className="w-5 h-5" />}
                  accent="warning"
                />
              </div>

              {report.by_category.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3>Ringkasan per Kategori</h3>
                      <p className="text-xs text-muted-foreground mt-1">Periode: {report.period}</p>
                    </div>
                    <Badge variant="info">Live Data</Badge>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={report.by_category}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="category_name" fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} stroke="#6B7280" tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
                      <Tooltip formatter={(v: number) => formatIDR(v)} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="total" name="Total" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {report.transactions.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground text-sm">
                  Belum ada transaksi dalam periode ini.
                </Card>
              ) : (
                <Card className="p-0 overflow-hidden">
                  <div className="px-6 py-4 border-b border-border">
                    <h3>Detail Transaksi</h3>
                    <p className="text-xs text-muted-foreground mt-1">{report.transactions.length} transaksi dalam periode {report.period}</p>
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
                      {report.transactions.map((t, i) => (
                        <tr key={i} className="border-t border-border hover:bg-muted/30">
                          <td className="py-3 px-6 text-xs">{t.date}</td>
                          <td className="py-3 px-2 font-semibold">{t.description}</td>
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
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="p-6">
            <h3 className="mb-4">Pilih Periode Perbandingan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-muted items-center justify-center text-muted-foreground z-10">
                VS
              </div>
              
              <div className="space-y-4">
                <Badge variant="outline" className="mb-2">Periode 1</Badge>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Dari Tanggal</Label>
                    <Input type="date" value={p1From} onChange={e => setP1From(e.target.value)} />
                  </div>
                  <div>
                    <Label>Sampai Tanggal</Label>
                    <Input type="date" value={p1To} onChange={e => setP1To(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Badge variant="outline" className="mb-2">Periode 2</Badge>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Dari Tanggal</Label>
                    <Input type="date" value={p2From} onChange={e => setP2From(e.target.value)} />
                  </div>
                  <div>
                    <Label>Sampai Tanggal</Label>
                    <Input type="date" value={p2To} onChange={e => setP2To(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 pt-6 border-t border-border">
              <Button 
                onClick={handleCompare} 
                disabled={compLoading || !p1From || !p1To || !p2From || !p2To}
                icon={compLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
              >
                {compLoading ? 'Memproses...' : 'Bandingkan Performa'}
              </Button>
            </div>
          </Card>

          {compData && (
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-muted-foreground text-xs">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">Metrik</th>
                    <th className="py-4 px-6 text-right font-semibold">Periode 1<br/><span className="font-normal text-[10px]">{compData.p1.period}</span></th>
                    <th className="py-4 px-6 text-right font-semibold">Periode 2<br/><span className="font-normal text-[10px]">{compData.p2.period}</span></th>
                    <th className="py-4 px-6 text-right font-semibold">Selisih & Pertumbuhan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { label: 'Total Pemasukan', k: 'income', invert: false },
                    { label: 'Total Pengeluaran', k: 'expense', invert: true },
                    { label: 'Net Cashflow', k: 'net', invert: false },
                    { label: 'Rata-rata Pengeluaran Harian', k: 'average_daily_spend', invert: true },
                  ].map((row) => (
                    <tr key={row.k} className="hover:bg-muted/10">
                      <td className="py-4 px-6 font-medium">{row.label}</td>
                      <td className="py-4 px-6 text-right">{formatIDR((compData.p1 as any)[row.k])}</td>
                      <td className="py-4 px-6 text-right font-semibold">{formatIDR((compData.p2 as any)[row.k])}</td>
                      <td className="py-4 px-6 text-right flex justify-end">
                        {renderComparisonDiff((compData.p1 as any)[row.k], (compData.p2 as any)[row.k], row.invert)}
                      </td>
                    </tr>
                  ))}
                  <tr className="hover:bg-muted/10">
                    <td className="py-4 px-6 font-medium">Tingkat Tabungan (Savings Rate)</td>
                    <td className="py-4 px-6 text-right">{compData.p1.savings_rate}%</td>
                    <td className="py-4 px-6 text-right font-semibold">{compData.p2.savings_rate}%</td>
                    <td className="py-4 px-6 text-right flex justify-end">
                      {compData.p2.savings_rate - compData.p1.savings_rate === 0 
                        ? <span className="text-muted-foreground text-xs font-medium">Sama</span>
                        : <span className={`text-xs font-semibold ${compData.p2.savings_rate > compData.p1.savings_rate ? 'text-emerald-600' : 'text-red-600'}`}>
                            {compData.p2.savings_rate > compData.p1.savings_rate ? '+' : ''}{(compData.p2.savings_rate - compData.p1.savings_rate).toFixed(1)}%
                          </span>
                      }
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

