import { Bell, Check, AlertCircle, Info, X, Search, Heart, Star } from 'lucide-react';
import { Card, Button, Badge, Input, Label, Avatar, SectionHeader } from '../ui';
import { formatIDR } from '../data';

function Block({ title, children }: { title: string; children: any }) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">{title}</h3>
      {children}
    </Card>
  );
}

export function DesignSystem() {
  const colors = [
    ['Primary', '#1E3A8A'], ['Secondary', '#3B82F6'], ['Success', '#10B981'],
    ['Danger', '#EF4444'], ['Warning', '#F59E0B'], ['Info', '#3B82F6'],
    ['Background', '#F8FAFC'], ['Surface', '#FFFFFF'], ['Text Primary', '#111827'], ['Text Secondary', '#6B7280'],
  ];

  return (
    <div className="space-y-6">
      <SectionHeader title="Design System" desc="Token, komponen, dan pola yang digunakan di seluruh aplikasi CatatDulu." />

      <Block title="Colors">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {colors.map(([n, c]) => (
            <div key={n} className="rounded-xl border border-border overflow-hidden">
              <div className="h-20" style={{ background: c }} />
              <div className="p-3">
                <div className="text-xs font-semibold">{n}</div>
                <div className="text-[11px] text-muted-foreground font-mono">{c}</div>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Typography">
        <div className="space-y-3">
          <div className="flex items-baseline gap-6 border-b border-border pb-3"><div className="w-24 text-xs text-muted-foreground">Display</div><div className="text-4xl font-bold tracking-tight">Catat keuangan, kelola masa depan</div></div>
          <div className="flex items-baseline gap-6 border-b border-border pb-3"><div className="w-24 text-xs text-muted-foreground">H1 / 30px</div><h1>Heading One</h1></div>
          <div className="flex items-baseline gap-6 border-b border-border pb-3"><div className="w-24 text-xs text-muted-foreground">H2 / 24px</div><h2>Heading Two</h2></div>
          <div className="flex items-baseline gap-6 border-b border-border pb-3"><div className="w-24 text-xs text-muted-foreground">H3 / 20px</div><h3>Heading Three</h3></div>
          <div className="flex items-baseline gap-6 border-b border-border pb-3"><div className="w-24 text-xs text-muted-foreground">Body / 14px</div><p>Inter font dengan line height nyaman untuk membaca paragraf panjang dalam dashboard SaaS.</p></div>
          <div className="flex items-baseline gap-6"><div className="w-24 text-xs text-muted-foreground">Caption / 12px</div><div className="text-xs text-muted-foreground">Caption text untuk metadata sekunder</div></div>
        </div>
      </Block>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Block title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button icon={<Heart className="w-4 h-4" />}>With Icon</Button>
          </div>
        </Block>

        <Block title="Badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </Block>

        <Block title="Inputs">
          <div className="space-y-3">
            <div><Label required>Email</Label><Input placeholder="you@example.com" /></div>
            <div>
              <Label>Search</Label>
              <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" placeholder="Cari..." /></div>
            </div>
            <div><Label>Dropdown</Label><select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option>Bulan ini</option><option>3 bulan</option></select></div>
            <div><Label>Disabled</Label><Input disabled defaultValue="Nilai tidak bisa diubah" /></div>
          </div>
        </Block>

        <Block title="Avatars">
          <div className="flex items-center gap-3">
            <Avatar name="Ariana Rizki" size={32} />
            <Avatar name="Budi Santoso" size={40} />
            <Avatar name="Citra Dewi" size={48} />
            <Avatar name="Dimas Putra" size={56} />
            <div className="flex -space-x-2">
              <Avatar name="A R" size={32} />
              <Avatar name="B S" size={32} />
              <Avatar name="C D" size={32} />
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-white text-[10px] font-semibold flex items-center justify-center">+5</div>
            </div>
          </div>
        </Block>

        <Block title="Alerts">
          <div className="space-y-3">
            {[
              { Icon: Check, c: 'emerald', t: 'Sukses!', d: 'Transaksi berhasil disimpan.' },
              { Icon: AlertCircle, c: 'amber', t: 'Peringatan', d: 'Budget Anda hampir habis bulan ini.' },
              { Icon: X, c: 'red', t: 'Error', d: 'Gagal terhubung ke server.' },
              { Icon: Info, c: 'blue', t: 'Info', d: 'Versi baru CatatDulu sudah tersedia.' },
            ].map((a) => (
              <div key={a.t} className={`flex items-start gap-3 p-3 rounded-xl bg-${a.c}-50 border border-${a.c}-100`}>
                <a.Icon className={`w-4 h-4 mt-0.5 text-${a.c}-700`} />
                <div><div className="text-sm font-semibold">{a.t}</div><div className="text-xs text-muted-foreground">{a.d}</div></div>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Notification Toast">
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border shadow-lg">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"><Check className="w-4 h-4" /></div>
              <div className="flex-1"><div className="text-sm font-semibold">Tersimpan</div><div className="text-xs text-muted-foreground">Transaksi telah berhasil tersimpan.</div></div>
              <button className="text-muted-foreground"><X className="w-4 h-4" /></button>
            </div>
          </div>
        </Block>

        <Block title="Tables (mini)">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr><th className="py-2 px-3 text-left font-semibold">Item</th><th className="py-2 px-3 text-left font-semibold">Status</th><th className="py-2 px-3 text-right font-semibold">Amount</th></tr>
            </thead>
            <tbody>
              {[['Gaji', 'success', 12500000], ['Makanan', 'warning', -250000], ['Belanja', 'danger', -420000]].map(([n, v, a]: any) => (
                <tr key={n} className="border-t border-border">
                  <td className="py-2 px-3 font-semibold">{n}</td>
                  <td className="py-2 px-3"><Badge variant={v}>{v}</Badge></td>
                  <td className={`py-2 px-3 text-right font-semibold ${a > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatIDR(a)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Block>

        <Block title="Cards">
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4">
              <div className="text-xs text-muted-foreground">Total Saldo</div>
              <div className="text-xl font-bold mt-1">{formatIDR(28450000)}</div>
              <Badge variant="success">+12.4%</Badge>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-primary to-accent text-white border-0">
              <div className="text-xs text-white/80">Premium</div>
              <div className="text-xl font-bold mt-1">Unlimited</div>
              <Badge variant="outline">PRO</Badge>
            </Card>
          </div>
        </Block>

        <Block title="Navigation Pills">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold">Semua</button>
            <button className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold">Income</button>
            <button className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold">Expense</button>
            <button className="px-4 py-1.5 rounded-full border border-border text-xs font-semibold">Budget</button>
          </div>
          <div className="mt-4 border-b border-border flex gap-6">
            {['Overview', 'Transactions', 'Budgets', 'Reports'].map((t, i) => (
              <button key={t} className={`pb-2 text-sm relative ${i === 0 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {t}
                {i === 0 && <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}
