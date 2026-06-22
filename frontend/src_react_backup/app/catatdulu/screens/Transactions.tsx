import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, ArrowUpRight, ArrowDownRight, MoreVertical, Trash2, Calendar, Tag, Wallet, FileText, ChevronLeft, Loader2 } from 'lucide-react';
import { Card, Button, Badge, Input, Label, Modal, SectionHeader } from '../ui';
import { formatIDR, transactionsApi, categoriesApi, type ApiTransaction, type ApiCategory } from '../api';
import type { Route } from '../Layout';
import { toast } from 'sonner';

// ── Shared Transaction Table ──────────────────────────────────
function TxTable({
  rows, loading, total, page, lastPage, onPageChange, onDelete, onOpen, type,
  search, onSearchChange, fromDate, onFromDateChange, toDate, onToDateChange, onResetFilters,
}: {
  rows: ApiTransaction[];
  loading: boolean;
  total: number;
  page: number;
  lastPage: number;
  onPageChange: (p: number) => void;
  onDelete: (id: number) => void;
  onOpen: () => void;
  type: 'income' | 'expense';
  search: string;
  onSearchChange: (v: string) => void;
  fromDate: string;
  onFromDateChange: (v: string) => void;
  toDate: string;
  onToDateChange: (v: string) => void;
  onResetFilters: () => void;
  onRowClick?: (id: number) => void;
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 flex flex-col xl:flex-row gap-3 xl:items-center justify-between border-b border-border">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Cari transaksi..." 
              className="pl-10" 
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Dari:</span>
            <Input 
              type="date" 
              className="w-36 h-10 text-xs" 
              value={fromDate}
              onChange={(e) => onFromDateChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sampai:</span>
            <Input 
              type="date" 
              className="w-36 h-10 text-xs" 
              value={toDate}
              onChange={(e) => onToDateChange(e.target.value)}
            />
          </div>
          {(fromDate || toDate || search) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onResetFilters}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Reset
            </Button>
          )}
        </div>
        <Button onClick={onOpen} icon={<Plus className="w-4 h-4" />}>
          Tambah {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat transaksi...</span>
        </div>
      ) : rows.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Belum ada transaksi.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="py-3 px-5 text-left font-semibold">Deskripsi</th>
                <th className="py-3 px-2 text-left font-semibold">Kategori</th>
                <th className="py-3 px-2 text-left font-semibold">Akun</th>
                <th className="py-3 px-2 text-left font-semibold">Tanggal</th>
                <th className="py-3 px-2 text-right font-semibold">Nominal</th>
                <th className="py-3 px-5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr 
                  key={t.id} 
                  className="border-t border-border hover:bg-muted/30 cursor-pointer"
                  onClick={(e) => {
                    // Prevent row click if clicking the delete button
                    if ((e.target as HTMLElement).closest('button')) return;
                    onRowClick?.(t.id);
                  }}
                >
                  <td className="py-3 px-5">
                     <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                         {t.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                       </div>
                       <span className="font-semibold">{t.description}</span>
                     </div>
                  </td>
                  <td className="py-3 px-2"><Badge variant="outline">{t.category?.name ?? '-'}</Badge></td>
                  <td className="py-3 px-2 text-xs">{t.payment_method}</td>
                  <td className="py-3 px-2 text-xs text-muted-foreground">{t.transaction_date?.slice(0, 10)}</td>
                  <td className={`py-3 px-2 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                  </td>
                  <td className="py-3 px-5">
                    <button onClick={() => onDelete(t.id)} className="w-7 h-7 rounded-md hover:bg-red-50 flex items-center justify-center text-muted-foreground hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Menampilkan {rows.length} dari {total} transaksi</span>
        <div className="flex gap-1">
          <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-40">Prev</button>
          {Array.from({ length: Math.min(lastPage, 5) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded-md border ${p === page ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'}`}>{p}</button>
          ))}
          <button disabled={page >= lastPage} onClick={() => onPageChange(page + 1)} className="px-3 py-1 rounded-md border border-border hover:bg-muted disabled:opacity-40">Next</button>
        </div>
      </div>
    </Card>
  );
}

// ── Transaction Form Modal ────────────────────────────────────
function TxFormModal({
  open, onClose, type, categories, onSaved,
}: {
  open: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
  categories: ApiCategory[];
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type || c.type === 'both');

  const handleSave = async () => {
    if (!amount || !categoryId || !description || !date) {
      toast.error('Lengkapi semua field yang diperlukan.');
      return;
    }
    setSaving(true);
    try {
      await transactionsApi.create({
        amount: parseFloat(amount),
        category_id: parseInt(categoryId),
        type,
        description,
        notes,
        transaction_date: `${date} 00:00:00`,
        payment_method: paymentMethod,
      });
      toast.success('Transaksi berhasil disimpan!');
      onSaved();
      onClose();
      setAmount(''); setCategoryId(''); setDescription(''); setNotes('');
    } catch (e: any) {
      toast.error(e.message ?? 'Gagal menyimpan transaksi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Tambah ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label required>Deskripsi</Label>
          <Input placeholder="Contoh: Gaji bulanan" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label required>Nominal</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
            <Input type="number" placeholder="0" className="pl-10" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label required>Kategori</Label>
            <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">-- Pilih --</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label required>Metode Bayar</Label>
            <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="card">Kartu</option>
              <option value="bank">Transfer Bank</option>
              <option value="wallet">Dompet Digital</option>
              <option value="other">Lainnya</option>
            </select>
          </div>
        </div>
        <div>
          <Label required>Tanggal</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <Label>Catatan</Label>
          <textarea
            className="w-full min-h-[90px] p-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Catatan opsional..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}

// ── Shared hook for transactions ──────────────────────────────
function useTransactions(type: 'income' | 'expense') {
  const [rows, setRows] = useState<ApiTransaction[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async (p = 1, fDate = fromDate, tDate = toDate, query = search) => {
    setLoading(true);
    try {
      const [txData, catData] = await Promise.all([
        transactionsApi.list({ 
          type, 
          per_page: 15, 
          page: p,
          from_date: fDate || undefined,
          to_date: tDate || undefined,
          search: query || undefined
        }),
        categoriesApi.list(),
      ]);
      setRows(txData.data ?? []);
      setTotal(txData.meta?.total ?? 0);
      setLastPage(txData.meta?.last_page ?? 1);
      setCategories(catData.data ?? []);
    } catch {
      toast.error('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, [type, fromDate, toDate, search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(1, fromDate, toDate, search);
      setPage(1);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, fromDate, toDate, fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus transaksi ini?')) return;
    try {
      await transactionsApi.delete(id);
      toast.success('Transaksi dihapus.');
      fetchData(page);
    } catch {
      toast.error('Gagal menghapus transaksi.');
    }
  };

  const handleResetFilters = () => {
    setFromDate('');
    setToDate('');
    setSearch('');
  };

  return { 
    rows, categories, loading, total, page, lastPage, setPage, fetchData, handleDelete,
    fromDate, setFromDate, toDate, setToDate, search, setSearch, handleResetFilters 
  };
}

// ── Income Screen ─────────────────────────────────────────────
export function IncomeScreen({ setRoute, setTxId }: { setRoute: (r: Route) => void; setTxId?: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const { 
    rows, categories, loading, total, page, lastPage, setPage, fetchData, handleDelete,
    fromDate, setFromDate, toDate, setToDate, search, setSearch, handleResetFilters
  } = useTransactions('income');
  const totalIncome = rows.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="Pemasukan" desc={`Total ${total} transaksi · ${formatIDR(totalIncome)}`} />
      <TxTable 
        rows={rows} 
        loading={loading} 
        total={total} 
        page={page} 
        lastPage={lastPage} 
        onPageChange={(p) => { setPage(p); fetchData(p); }} 
        onDelete={handleDelete} 
        onOpen={() => setOpen(true)} 
        type="income"
        search={search}
        onSearchChange={setSearch}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        onResetFilters={handleResetFilters}
        onRowClick={(id) => {
          setTxId?.(id);
          setRoute('transaction-detail');
        }}
      />
      <TxFormModal open={open} onClose={() => setOpen(false)} type="income" categories={categories} onSaved={() => fetchData(page)} />
    </div>
  );
}

// ── Expense Screen ────────────────────────────────────────────
export function ExpenseScreen({ setRoute, setTxId }: { setRoute: (r: Route) => void; setTxId?: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const { 
    rows, categories, loading, total, page, lastPage, setPage, fetchData, handleDelete,
    fromDate, setFromDate, toDate, setToDate, search, setSearch, handleResetFilters
  } = useTransactions('expense');
  const totalExpense = rows.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <SectionHeader title="Pengeluaran" desc={`Total ${total} transaksi · ${formatIDR(totalExpense)}`} />
      <TxTable 
        rows={rows} 
        loading={loading} 
        total={total} 
        page={page} 
        lastPage={lastPage} 
        onPageChange={(p) => { setPage(p); fetchData(p); }} 
        onDelete={handleDelete} 
        onOpen={() => setOpen(true)} 
        type="expense"
        search={search}
        onSearchChange={setSearch}
        fromDate={fromDate}
        onFromDateChange={setFromDate}
        toDate={toDate}
        onToDateChange={setToDate}
        onResetFilters={handleResetFilters}
        onRowClick={(id) => {
          setTxId?.(id);
          setRoute('transaction-detail');
        }}
      />
      <TxFormModal open={open} onClose={() => setOpen(false)} type="expense" categories={categories} onSaved={() => fetchData(page)} />
    </div>
  );
}

// ── Transaction Detail ─────────────────────────────────────────
export function TransactionDetail({ setRoute, txId }: { setRoute: (r: Route) => void; txId: number | null }) {
  const [tx, setTx] = useState<ApiTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!txId) {
      setLoading(false);
      setError('ID Transaksi tidak ditemukan.');
      return;
    }
    setLoading(true);
    transactionsApi.show(txId)
      .then((res) => setTx(res.data))
      .catch(() => setError('Gagal memuat detail transaksi.'))
      .finally(() => setLoading(false));
  }, [txId]);

  return (
    <div className="space-y-6">
      <button onClick={() => setRoute('dashboard')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>
      <Card className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx?.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {tx?.type === 'income' ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
          </div>
          <div>
            <h2>Detail Transaksi</h2>
            <p className="text-muted-foreground text-sm">{tx?.description ?? 'Memuat...'}</p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-muted-foreground">Memuat data...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : !tx ? null : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: Tag, label: 'Kategori', val: tx.category?.name ?? '-' },
                { icon: Calendar, label: 'Tanggal', val: tx.transaction_date?.slice(0, 10) ?? '-' },
                { icon: Wallet, label: 'Metode', val: tx.payment_method ?? '-' },
                { icon: FileText, label: 'Tipe', val: tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran' },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-3 p-4 rounded-xl bg-muted/40">
                  <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center"><d.icon className="w-4 h-4 text-primary" /></div>
                  <div>
                    <div className="text-[11px] text-muted-foreground">{d.label}</div>
                    <div className="text-sm font-semibold">{d.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="text-[11px] text-muted-foreground mb-1">Nominal</div>
              <div className={`text-2xl font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
              </div>
            </div>

            {tx.notes && (
              <div className="mt-6">
                <div className="text-[11px] text-muted-foreground mb-2">Catatan</div>
                <div className="p-4 rounded-xl bg-muted/30 text-sm whitespace-pre-wrap border border-border/50">
                  {tx.notes}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
