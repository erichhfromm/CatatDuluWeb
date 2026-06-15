import { useEffect, useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Info, Camera, Shield, Globe, Moon, Mail, Phone, MapPin, Key, Loader2 } from 'lucide-react';
import { Card, Button, Badge, Input, Label, Avatar, SectionHeader } from '../ui';
import { profileApi, notificationsApi, type UserData, type ApiNotification } from '../api';
import { toast } from 'sonner';

// ── Notifications Screen ─────────────────────────────────────
export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsApi.list()
      .then((data) => setNotifications(data.data ?? []))
      .catch(() => toast.error('Gagal memuat notifikasi.'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch { toast.error('Gagal menandai notifikasi.'); }
  };

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      toast.success('Semua notifikasi ditandai dibaca.');
    } catch { toast.error('Gagal menandai semua notifikasi.'); }
  };

  const iconFor = (t: string) => t === 'success' ? CheckCircle2 : t === 'warning' ? AlertTriangle : Info;
  const colorFor = (t: string) => t === 'success' ? 'text-emerald-600 bg-emerald-50' : t === 'warning' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifikasi"
        desc={`${unread} notifikasi baru`}
        action={<Button variant="outline" icon={<CheckCheck className="w-4 h-4" />} onClick={handleMarkAll}>Tandai semua dibaca</Button>}
      />

      {loading ? (
        <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Memuat notifikasi...</span>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center gap-3 text-center">
          <Bell className="w-10 h-10 text-muted-foreground" />
          <div>
            <h3 className="mb-1">Tidak ada notifikasi</h3>
            <p className="text-muted-foreground text-sm">Anda sudah up-to-date!</p>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          {notifications.map((n) => {
            const Icon = iconFor(n.type);
            const isUnread = !n.read_at;
            return (
              <div key={n.id} className={`flex items-start gap-4 p-5 border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer ${isUnread ? 'bg-blue-50/30' : ''}`} onClick={() => isUnread && handleMarkRead(n.id)}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorFor(n.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm">{n.title}</div>
                    {isUnread && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.message}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                {isUnread && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }}>Baca</Button>}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

// ── Profile Screen ────────────────────────────────────────────
export function ProfileScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Password change
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    profileApi.me()
      .then((data) => {
        const u = data.data;
        setUser(u);
        setName(u?.name ?? '');
        setPhone(u?.phone ?? '');
      })
      .catch(() => toast.error('Gagal memuat profil.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const result = await profileApi.update({ name, phone });
      setUser(result.data);
      toast.success('Profil berhasil diperbarui!');
    } catch (e: any) {
      toast.error(e.message ?? 'Gagal memperbarui profil.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPw !== confirmPw) { toast.error('Konfirmasi password tidak cocok.'); return; }
    if (newPw.length < 8) { toast.error('Password minimal 8 karakter.'); return; }
    setSavingPw(true);
    try {
      await profileApi.changePassword({ current_password: oldPw, password: newPw, password_confirmation: confirmPw });
      toast.success('Password berhasil diubah!');
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } catch (e: any) {
      toast.error(e.message ?? 'Gagal mengubah password.');
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm">Memuat profil...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Profil Pengguna" desc="Kelola informasi pribadi dan preferensi akun Anda." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar name={user?.name ?? 'User'} size={96} />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="mt-4">{user?.name}</h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <Badge variant="info" className="mt-2">Premium Member</Badge>
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border w-full text-center">
              {[
                { k: user?.name?.split(' ').length ?? '-', v: 'Kata Nama' },
                { k: user?.currency ?? 'IDR', v: 'Mata Uang' },
              ].map((s) => (
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
            <div>
              <Label>Nama Lengkap</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" value={user?.email ?? ''} disabled />
              </div>
            </div>
            <div>
              <Label>Nomor Telepon</Label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+62..." />
              </div>
            </div>
            <div>
              <Label>Mata Uang</Label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-10" value={user?.currency ?? 'IDR'} disabled />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
            <Button variant="outline">Batal</Button>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-1">Ubah Password</h3>
        <p className="text-xs text-muted-foreground mb-4">Pastikan menggunakan password yang kuat dan unik.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label required>Password Lama</Label><Input type="password" placeholder="••••••••" value={oldPw} onChange={(e) => setOldPw(e.target.value)} /></div>
          <div><Label required>Password Baru</Label><Input type="password" placeholder="Min. 8 karakter" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></div>
          <div><Label required>Konfirmasi Password</Label><Input type="password" placeholder="Ulangi password baru" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} /></div>
        </div>
        <div className="flex justify-end mt-4">
          <Button icon={<Key className="w-4 h-4" />} onClick={handleChangePassword} disabled={savingPw || !oldPw || !newPw || !confirmPw}>
            {savingPw ? 'Mengubah...' : 'Update Password'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ── Settings Screen (mostly UI) ───────────────────────────────
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
            {([
              ['Email notifikasi', 'Update mingguan dan ringkasan bulanan', true],
              ['Push notification', 'Notifikasi langsung di browser', true],
              ['Pengingat budget', 'Saat mencapai 80% / 100% budget', true],
              ['Pengingat tagihan', '3 hari sebelum jatuh tempo', false],
              ['Tips keuangan mingguan', 'Konten edukatif dari CatatDulu', false],
            ] as [string, string, boolean][]).map(([t, d, c]) => <ToggleRow key={t} label={t} desc={d} defaultChecked={c} />)}
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
