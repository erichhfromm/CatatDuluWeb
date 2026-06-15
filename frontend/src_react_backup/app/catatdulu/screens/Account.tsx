import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info, Camera, Shield, Globe, Moon, Mail, Phone, MapPin, Key } from 'lucide-react';
import { Card, Button, Badge, Input, Label, Avatar, SectionHeader } from '../ui';
import { notifications } from '../data';

export function NotificationsScreen() {
  const iconFor = (t: string) => t === 'success' ? CheckCircle2 : t === 'warning' ? AlertTriangle : Info;
  const colorFor = (t: string) => t === 'success' ? 'text-emerald-600 bg-emerald-50' : t === 'warning' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifikasi"
        desc={`${notifications.filter((n) => !n.read).length} notifikasi baru`}
        action={<Button variant="outline" icon={<CheckCheck className="w-4 h-4" />}>Tandai semua dibaca</Button>}
      />

      <div className="flex gap-2 flex-wrap">
        {['Semua', 'Belum dibaca', 'Transaksi', 'Budget', 'Sistem'].map((f, i) => (
          <button key={f} className={`px-4 py-2 rounded-full text-xs font-semibold ${i === 0 ? 'bg-primary text-white' : 'border border-border hover:bg-muted'}`}>{f}</button>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        {notifications.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <div key={n.id} className={`flex items-start gap-4 p-5 border-b border-border last:border-0 hover:bg-muted/30 ${!n.read ? 'bg-blue-50/30' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorFor(n.type)}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-sm">{n.title}</div>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{n.time}</div>
              </div>
              <Button variant="ghost" size="sm">Lihat</Button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

export function ProfileScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Profil Pengguna" desc="Kelola informasi pribadi dan preferensi akun Anda." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar name="Ariana Rizki" size={96} />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="mt-4">Ariana Rizki</h3>
            <p className="text-xs text-muted-foreground">ariana@catatdulu.id</p>
            <Badge variant="info">Premium Member</Badge>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border w-full text-center">
              {[{ k: '124', v: 'Transaksi' }, { k: '6', v: 'Budget' }, { k: '2y', v: 'Member' }].map((s) => (
                <div key={s.v}>
                  <div className="font-bold">{s.k}</div>
                  <div className="text-[11px] text-muted-foreground">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <h3 className="mb-4">Informasi Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Nama Lengkap</Label><Input defaultValue="Ariana Rizki" /></div>
            <div><Label>Username</Label><Input defaultValue="@ariana" /></div>
            <div>
              <Label>Email</Label>
              <div className="relative"><Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" defaultValue="ariana@catatdulu.id" /></div>
            </div>
            <div>
              <Label>Nomor Telepon</Label>
              <div className="relative"><Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" defaultValue="+62 812 3456 7890" /></div>
            </div>
            <div>
              <Label>Lokasi</Label>
              <div className="relative"><MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input className="pl-10" defaultValue="Jakarta, Indonesia" /></div>
            </div>
            <div><Label>Mata Uang</Label>
              <select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm">
                <option>IDR — Rupiah</option><option>USD — Dollar</option><option>EUR — Euro</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
            <Button variant="outline">Batal</Button>
            <Button>Simpan Perubahan</Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-1">Ubah Password</h3>
        <p className="text-xs text-muted-foreground mb-4">Pastikan menggunakan password yang kuat dan unik.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label required>Password Lama</Label><Input type="password" placeholder="••••••••" /></div>
          <div><Label required>Password Baru</Label><Input type="password" placeholder="Min. 8 karakter" /></div>
          <div><Label required>Konfirmasi Password</Label><Input type="password" placeholder="Ulangi password baru" /></div>
        </div>
        <div className="flex justify-end mt-4">
          <Button icon={<Key className="w-4 h-4" />}>Update Password</Button>
        </div>
      </Card>
    </div>
  );
}

export function SettingsScreen() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Pengaturan" desc="Sesuaikan aplikasi sesuai kebutuhan Anda." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center"><Globe className="w-5 h-5" /></div>
            <div><h4>Umum</h4><p className="text-[11px] text-muted-foreground">Bahasa, mata uang, format</p></div>
          </div>
          <div className="space-y-4">
            <div><Label>Bahasa</Label><select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option>Indonesia</option><option>English</option></select></div>
            <div><Label>Format Tanggal</Label><select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></div>
            <div><Label>Awal Minggu</Label><select className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"><option>Senin</option><option>Minggu</option></select></div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center"><Moon className="w-5 h-5" /></div>
            <div><h4>Tampilan</h4><p className="text-[11px] text-muted-foreground">Tema & aksen</p></div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Tema</Label>
              <div className="grid grid-cols-3 gap-2">
                {['Light', 'Dark', 'Auto'].map((t, i) => (
                  <button key={t} className={`px-3 py-2 rounded-lg border text-xs font-semibold ${i === 0 ? 'bg-primary text-white border-primary' : 'border-border'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Aksen</Label>
              <div className="flex gap-2">
                {['#1E3A8A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((c, i) => (
                  <button key={c} className={`w-8 h-8 rounded-full border-2 ${i === 0 ? 'border-foreground' : 'border-transparent'}`} style={{ background: c }} />
                ))}
              </div>
            </div>
            <ToggleRow label="Mode kompak" desc="Tampilkan lebih banyak data" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><Shield className="w-5 h-5" /></div>
            <div><h4>Keamanan</h4><p className="text-[11px] text-muted-foreground">2FA, sesi, perangkat</p></div>
          </div>
          <div className="space-y-4">
            <ToggleRow label="Autentikasi 2 Faktor" desc="Lapisan keamanan ekstra" defaultChecked />
            <ToggleRow label="Login dengan Biometrik" desc="Face ID / sidik jari" />
            <ToggleRow label="Notifikasi login" desc="Email saat login baru" defaultChecked />
            <Button variant="outline" className="w-full">Lihat Perangkat Aktif</Button>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><Bell className="w-5 h-5" /></div>
            <div><h4>Preferensi Notifikasi</h4><p className="text-[11px] text-muted-foreground">Atur notifikasi yang Anda terima</p></div>
          </div>
          <div className="space-y-3">
            {[
              ['Email notifikasi', 'Update mingguan dan ringkasan bulanan', true],
              ['Push notification', 'Notifikasi langsung di browser', true],
              ['Pengingat budget', 'Saat mencapai 80% / 100% budget', true],
              ['Pengingat tagihan', '3 hari sebelum jatuh tempo', false],
              ['Tips keuangan mingguan', 'Konten edukatif dari CatatDulu', false],
            ].map(([t, d, c]) => <ToggleRow key={t as string} label={t as string} desc={d as string} defaultChecked={c as boolean} />)}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center"><Shield className="w-5 h-5" /></div>
            <div><h4>Akun</h4><p className="text-[11px] text-muted-foreground">Zona bahaya</p></div>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full">Export semua data</Button>
            <Button variant="outline" className="w-full">Nonaktifkan akun</Button>
            <Button variant="danger" className="w-full">Hapus akun permanen</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <div className="relative">
        <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary transition" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition peer-checked:translate-x-4" />
      </div>
    </label>
  );
}
