import { useMemo, useState } from 'react';
import { Plus, Search, Filter, Download, ArrowUpRight, ArrowDownRight, MoreVertical, Edit3, Trash2, Calendar, Tag, Wallet, FileText, ChevronLeft } from 'lucide-react';
import { Card, Button, Badge, Input, Label, Modal, SectionHeader } from '../ui';
import { transactions, formatIDR, Transaction } from '../data';
import type { Route } from '../Layout';

function TxTable({ rows, onOpen, type }: { rows: Transaction[]; onOpen: () => void; type: 'income' | 'expense' }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-5 flex flex-col md:flex-row gap-3 md:items-center justify-between border-b border-border">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari transaksi..." className="pl-10" />
          </div>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>Filter</Button>
          <Button variant="outline" icon={<Calendar className="w-4 h-4" />}>Mei 2026</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>Export</Button>
          <Button onClick={onOpen} icon={<Plus className="w-4 h-4" />}>Tambah {type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs text-muted-foreground">
            <tr>
              <th className="py-3 px-5 text-left font-semibold"><input type="checkbox" className="rounded" /></th>
              <th className="py-3 px-2 text-left font-semibold">ID</th>
              <th className="py-3 px-2 text-left font-semibold">Deskripsi</th>
              <th className="py-3 px-2 text-left font-semibold">Kategori</th>
              <th className="py-3 px-2 text-left font-semibold">Akun</th>
              <th className="py-3 px-2 text-left font-semibold">Tanggal</th>
              <th className="py-3 px-2 text-left font-semibold">Status</th>
              <th className="py-3 px-2 text-right font-semibold">Nominal</th>
              <th className="py-3 px-5"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id} className="border-t border-border hover:bg-muted/30">
                <td className="py-3 px-5"><input type="checkbox" className="rounded" /></td>
                <td className="py-3 px-2 text-xs font-mono text-muted-foreground">{t.id}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {t.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <span className="font-semibold">{t.note}</span>
                  </div>
                </td>
                <td className="py-3 px-2"><Badge variant="outline">{t.category}</Badge></td>
                <td className="py-3 px-2 text-xs">{t.account}</td>
                <td className="py-3 px-2 text-xs text-muted-foreground">{t.date}</td>
                <td className="py-3 px-2"><Badge variant={t.status === 'completed' ? 'success' : 'warning'}>{t.status}</Badge></td>
                <td className={`py-3 px-2 text-right font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
                </td>
                <td className="py-3 px-5">
                  <button className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Menampilkan {rows.length} dari {rows.length} transaksi</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 rounded-md border border-border hover:bg-muted">Prev</button>
          <button className="px-3 py-1 rounded-md bg-primary text-white">1</button>
          <button className="px-3 py-1 rounded-md border border-border hover:bg-muted">2</button>
          <button className="px-3 py-1 rounded-md border border-border hover:bg-muted">Next</button>
        </div>
      </div>
    </Card>
  );
}

function TxFormModal({ open, onClose, type }: { open: boolean; onClose: () => void; type: 'income' | 'expense' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Tambah ${type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={onClose}>Simpan Transaksi</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Label required>Nominal</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
            <Input type="number" placeholder="0" className="pl-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label required>Kategori</Label>
            <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
              <option>Gaji</option><option>Freelance</option><option>Investasi</option><option>Bonus</option>
            </select>
          </div>
          <div>
            <Label required>Akun</Label>
            <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
              <option>BCA</option><option>Mandiri</option><option>GoPay</option><option>Cash</option>
            </select>
          </div>
        </div>
        <div>
          <Label required>Tanggal</Label>
          <Input type="date" defaultValue="2026-05-28" />
        </div>
        <div>
          <Label>Catatan</Label>
          <textarea className="w-full min-h-[90px] p-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Tambahkan catatan opsional..." />
        </div>
      </div>
    </Modal>
  );
}

export function IncomeScreen({ setRoute }: { setRoute: (r: Route) => void }) {
  const rows = useMemo(() => transactions.filter((t) => t.type === 'income'), []);
  const [open, setOpen] = useState(false);
  const total = rows.reduce((a, b) => a + b.amount, 0);
  return (
    <div className="space-y-6">
      <SectionHeader title="Pemasukan" desc={`Total ${rows.length} transaksi · ${formatIDR(total)}`} />
      <TxTable rows={rows} onOpen={() => setOpen(true)} type="income" />
      <TxFormModal open={open} onClose={() => setOpen(false)} type="income" />
    </div>
  );
}

export function ExpenseScreen({ setRoute }: { setRoute: (r: Route) => void }) {
  const rows = useMemo(() => transactions.filter((t) => t.type === 'expense'), []);
  const [open, setOpen] = useState(false);
  const total = rows.reduce((a, b) => a + b.amount, 0);
  return (
    <div className="space-y-6">
      <SectionHeader title="Pengeluaran" desc={`Total ${rows.length} transaksi · ${formatIDR(total)}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {['Semua', 'Makanan', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan'].map((c, i) => (
          <button key={c} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${i === 0 ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'}`}>{c}</button>
        ))}
      </div>
      <TxTable rows={rows} onOpen={() => setOpen(true)} type="expense" />
      <TxFormModal open={open} onClose={() => setOpen(false)} type="expense" />
    </div>
  );
}

export function TransactionDetail({ setRoute }: { setRoute: (r: Route) => void }) {
  const t = transactions[0];
  return (
    <div className="space-y-6">
      <button onClick={() => setRoute('expense')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {t.type === 'income' ? <ArrowDownRight className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t.id}</div>
                <h2 className="mt-0.5">{t.note}</h2>
                <Badge variant={t.status === 'completed' ? 'success' : 'warning'}>{t.status}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Nominal</div>
              <div className={`text-3xl font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}{formatIDR(t.amount)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
            {[
              { icon: Tag, label: 'Kategori', val: t.category },
              { icon: Calendar, label: 'Tanggal', val: t.date },
              { icon: Wallet, label: 'Akun', val: t.account },
              { icon: FileText, label: 'Tipe', val: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran' },
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

          <div className="mt-6">
            <Label>Catatan</Label>
            <div className="p-4 bg-muted/40 rounded-xl text-sm text-muted-foreground">{t.note} — disimpan pada {t.date} dengan metode pembayaran {t.account}.</div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h4 className="mb-3">Aksi</h4>
            <div className="space-y-2">
              <Button className="w-full" icon={<Edit3 className="w-4 h-4" />}>Edit Transaksi</Button>
              <Button variant="outline" className="w-full" icon={<FileText className="w-4 h-4" />}>Duplikasi</Button>
              <Button variant="danger" className="w-full" icon={<Trash2 className="w-4 h-4" />}>Hapus</Button>
            </div>
          </Card>
          <Card className="p-5">
            <h4 className="mb-3">Riwayat Aktivitas</h4>
            <div className="space-y-3 text-xs">
              {[
                { t: 'Transaksi dibuat', d: '2026-05-28 09:14' },
                { t: 'Kategori diperbarui', d: '2026-05-28 09:20' },
                { t: 'Diverifikasi', d: '2026-05-28 09:25' },
              ].map((h) => (
                <div key={h.t} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                  <div>
                    <div className="font-semibold">{h.t}</div>
                    <div className="text-muted-foreground">{h.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
