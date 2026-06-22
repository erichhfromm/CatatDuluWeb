import { useEffect, useState, useRef, useCallback } from 'react';
import { Camera, Key, Loader2, Mail, MapPin, Phone, Edit, Save, X, Trash2, CheckCircle2, ChevronRight, Moon, Shield, Bell, Globe, AlertTriangle, CheckCheck, Info, RefreshCw } from 'lucide-react';
import { Card, Button, Avatar, Input, Label, SectionHeader, Badge, Modal } from '../ui';
import { profileApi, notificationsApi, type UserData, type ApiNotification } from '../api';
import { toast } from 'sonner';

// ── Relative time helper ─────────────────────────────────────
function relativeTime(dateStr: string): string {
  const now  = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

  if (diff < 60)          return 'Baru saja';
  if (diff < 3600)        return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400)       return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 7)   return `${Math.floor(diff / 86400)} hari lalu`;
  if (diff < 86400 * 30)  return `${Math.floor(diff / (86400 * 7))} minggu lalu`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))} bulan lalu`;
  return `${Math.floor(diff / (86400 * 365))} tahun lalu`;
}

// ── Notifications Screen ─────────────────────────────────────
export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [tick, setTick]                   = useState(0); // forces relative-time re-render

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const data = await notificationsApi.list();
      setNotifications(data.data ?? []);
    } catch {
      if (!silent) toast.error('Gagal memuat notifikasi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Auto-poll every 30 seconds (silent refresh)
  useEffect(() => {
    const poll = setInterval(() => fetchNotifications(true), 30_000);
    return () => clearInterval(poll);
  }, [fetchNotifications]);

  // Update relative timestamps every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n));
    } catch { toast.error('Gagal menandai notifikasi.'); }
  };

  const handleMarkAll = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
      toast.success('Semua notifikasi ditandai dibaca.');
    } catch { toast.error('Gagal menandai semua notifikasi.'); }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notifikasi berhasil dihapus.');
    } catch { toast.error('Gagal menghapus notifikasi.'); }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) return;
    try {
      await notificationsApi.deleteAll();
      setNotifications([]);
      toast.success('Semua notifikasi berhasil dihapus.');
    } catch { toast.error('Gagal menghapus semua notifikasi.'); }
  };

  const iconFor = (t: string) =>
    t === 'success'                              ? CheckCircle2
    : (t === 'warning' || t === 'budget_alert') ? AlertTriangle
    : Info;

  const colorFor = (t: string) =>
    t === 'success'                              ? 'text-emerald-600 bg-emerald-50'
    : (t === 'warning' || t === 'budget_alert') ? 'text-amber-600 bg-amber-50'
    : t === 'expense'                            ? 'text-red-600 bg-red-50'
    : t === 'income'                             ? 'text-emerald-600 bg-emerald-50'
    : 'text-blue-600 bg-blue-50';

  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifikasi"
        desc={unread > 0 ? `${unread} notifikasi baru` : 'Semua sudah dibaca'}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
              onClick={() => fetchNotifications()}
              disabled={refreshing}
            >
              Refresh
            </Button>
            {notifications.length > 0 && (
              <>
                <Button variant="outline" size="sm" icon={<CheckCheck className="w-4 h-4" />} onClick={handleMarkAll}>
                  Tandai semua dibaca
                </Button>
                <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />} onClick={handleDeleteAll}>
                  Hapus Semua
                </Button>
              </>
            )}
          </div>
        }
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
            <p className="text-muted-foreground text-sm">Anda sudah up-to-date! Coba tambah transaksi baru.</p>
          </div>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          {notifications.map(n => {
            const Icon    = iconFor(n.type);
            const isUnread = !n.is_read;
            return (
              <div
                key={`${n.id}-${tick}`}
                className={`flex items-start gap-4 p-5 border-b border-border last:border-0 transition-colors ${isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/30'} cursor-pointer`}
                onClick={() => isUnread && handleMarkRead(n.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorFor(n.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{n.title}</span>
                    {isUnread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-muted-foreground/70 mt-1 block">{relativeTime(n.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isUnread && (
                    <Button variant="ghost" size="sm" onClick={e => { e.stopPropagation(); handleMarkRead(n.id); }}>
                      Baca
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={e => { e.stopPropagation(); handleDelete(n.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Mengunggah foto profil...');
    try {
      const res = await profileApi.uploadPicture(file);
      setUser(prev => prev ? { ...prev, profile_picture: res.profile_picture } : null);
      toast.success('Foto profil berhasil diubah!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message ?? 'Gagal mengunggah foto profil.', { id: toastId });
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error('Nama lengkap tidak boleh kosong.');
      return;
    }
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
              <Avatar name={user?.name ?? 'User'} src={user?.profile_picture} size={96} />
              <button 
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-white hover:bg-primary/95 transition"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
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
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-1">Ubah Password</h3>
        <p className="text-xs text-muted-foreground mb-4">Pastikan menggunakan password yang kuat dan unik (Min. 8 karakter, huruf besar, huruf kecil, dan angka).</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><Label required>Password Lama</Label><Input type="password" placeholder="••••••••" value={oldPw} onChange={(e) => setOldPw(e.target.value)} /></div>
          <div><Label required>Password Baru</Label><Input type="password" placeholder="Min. 8 karakter + Angka + Huruf Besar" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></div>
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

// ── Settings Screen ───────────────────────────────────────────
export function SettingsScreen({ onLogout }: { onLogout?: () => void }) {
  const [preferences, setPreferences] = useState({ currency: 'IDR', date_format: 'Y-m-d', theme: 'light' });
  const [nestedPrefs, setNestedPrefs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [dangerModal, setDangerModal] = useState<{ open: boolean; type: 'export' | 'disable' | 'delete' }>({ open: false, type: 'export' });
  const [dangerLoading, setDangerLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    profileApi.getPreferences()
      .then((data) => {
        setPreferences({
          currency: data.currency ?? 'IDR',
          date_format: data.date_format ?? 'Y-m-d',
          theme: data.theme ?? 'light'
        });
        setNestedPrefs(data.preferences ?? {});
      })
      .catch(() => toast.error('Gagal memuat pengaturan.'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdatePreference = async (key: string, val: string) => {
    const updated = { ...preferences, [key]: val };
    setPreferences(updated);
    if (key === 'theme') {
      document.documentElement.classList.toggle('dark', val === 'dark');
    }
    try {
      await profileApi.updatePreferences({ [key]: val });
      toast.success('Pengaturan berhasil diperbarui!');
    } catch {
      toast.error('Gagal memperbarui pengaturan.');
    }
  };

  const handleTogglePref = async (key: string, val: boolean) => {
    const updated = { ...nestedPrefs, [key]: val };
    setNestedPrefs(updated);
    try {
      await profileApi.updatePreferences({ preferences: { [key]: val } });
    } catch {
      toast.error('Gagal menyimpan pengaturan.');
    }
  };

  const handleDangerAction = async () => {
    if (dangerModal.type === 'delete' && confirmText !== 'HAPUS') {
      toast.error('Ketik "HAPUS" untuk konfirmasi.');
      return;
    }
    setDangerLoading(true);
    try {
      if (dangerModal.type === 'export') {
        const data = await profileApi.exportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `catadulu-data-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Data berhasil diekspor! File sedang diunduh.');
        setDangerModal({ ...dangerModal, open: false });
      } else if (dangerModal.type === 'disable') {
        await profileApi.disableAccount();
        toast.success('Akun dinonaktifkan. Anda akan keluar...');
        setTimeout(() => {
          localStorage.removeItem('api_token');
          onLogout?.();
        }, 1500);
      } else {
        await profileApi.deleteAccount();
        toast.success('Akun dihapus permanen. Selamat tinggal!');
        setTimeout(() => {
          localStorage.removeItem('api_token');
          onLogout?.();
        }, 1500);
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Terjadi kesalahan.');
    } finally {
      setDangerLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-sm">Memuat pengaturan...</span>
      </div>
    );
  }

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
            <div>
              <Label>Bahasa</Label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
                onChange={() => toast.info('Fitur lokalisasi bahasa akan segera hadir.')}
              >
                <option>Indonesia</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <Label>Format Tanggal</Label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
                value={preferences.date_format}
                onChange={(e) => handleUpdatePreference('date_format', e.target.value)}
              >
                <option value="d/m/Y">DD/MM/YYYY</option>
                <option value="m/d/Y">MM/DD/YYYY</option>
                <option value="Y-m-d">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <Label>Mata Uang</Label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-border bg-card text-sm"
                value={preferences.currency}
                onChange={(e) => handleUpdatePreference('currency', e.target.value)}
              >
                <option value="IDR">Rupiah (IDR)</option>
                <option value="USD">Dolar AS (USD)</option>
                <option value="SGD">Dolar Singapura (SGD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
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
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'light', label: 'Terang' },
                  { value: 'dark', label: 'Gelap' }
                ].map((t) => (
                  <button 
                    key={t.value} 
                    onClick={() => handleUpdatePreference('theme', t.value)}
                    className={`px-3 py-2 rounded-lg border text-xs font-semibold transition ${
                      preferences.theme === t.value 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'border-border hover:bg-muted text-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <ToggleRow prefKey="compact_mode" label="Mode kompak" desc="Tampilkan lebih banyak data" checked={nestedPrefs['compact_mode'] ?? false} onToggle={handleTogglePref} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><Shield className="w-5 h-5" /></div>
            <div><h4>Keamanan</h4><p className="text-[11px] text-muted-foreground">2FA, sesi, perangkat</p></div>
          </div>
          <div className="space-y-4">
            <ToggleRow prefKey="two_factor" label="Autentikasi 2 Faktor" desc="Lapisan keamanan ekstra" checked={nestedPrefs['two_factor'] ?? false} onToggle={handleTogglePref} />
            <ToggleRow prefKey="login_notif" label="Notifikasi login" desc="Email saat login baru" checked={nestedPrefs['login_notif'] ?? true} onToggle={handleTogglePref} />
            <Button variant="outline" className="w-full" onClick={() => toast.info('Manajemen perangkat akan segera hadir.')}>Lihat Perangkat Aktif</Button>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><Bell className="w-5 h-5" /></div>
            <div><h4>Preferensi Notifikasi</h4><p className="text-[11px] text-muted-foreground">Atur notifikasi yang Anda terima</p></div>
          </div>
          <div className="space-y-3">
            {([
              ['email_notif', 'Email notifikasi', 'Update mingguan dan ringkasan bulanan', true],
              ['push_notif', 'Push notification', 'Notifikasi langsung di browser', true],
              ['budget_reminder', 'Pengingat budget', 'Saat mencapai 80% / 100% budget', true],
              ['bill_reminder', 'Pengingat tagihan', '3 hari sebelum jatuh tempo', false],
              ['weekly_tips', 'Tips keuangan mingguan', 'Konten edukatif dari CatatDulu', false],
            ] as [string, string, string, boolean][]).map(([k, t, d, def]) => (
              <ToggleRow key={k} prefKey={k} label={t} desc={d} checked={nestedPrefs[k] ?? def} onToggle={handleTogglePref} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center"><Shield className="w-5 h-5" /></div>
            <div><h4>Akun</h4><p className="text-[11px] text-muted-foreground">Zona bahaya</p></div>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => setDangerModal({ open: true, type: 'export' })}>Export semua data</Button>
            <Button variant="outline" className="w-full" onClick={() => setDangerModal({ open: true, type: 'disable' })}>Nonaktifkan akun</Button>
            <Button variant="danger" className="w-full" onClick={() => setDangerModal({ open: true, type: 'delete' })}>Hapus akun permanen</Button>
          </div>
        </Card>
      </div>

      {/* Danger Zone Modal */}
      <Modal
        open={dangerModal.open}
        onClose={() => setDangerModal({ ...dangerModal, open: false })}
        title={
          dangerModal.type === 'export' ? 'Export Data Akun' :
          dangerModal.type === 'disable' ? 'Nonaktifkan Akun' : 'Hapus Akun Permanen'
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setDangerModal({ ...dangerModal, open: false })}>Batal</Button>
            <Button 
              variant={dangerModal.type === 'delete' ? 'danger' : 'primary'}
              onClick={handleDangerAction}
              disabled={dangerLoading}
              icon={dangerLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
            >
              {dangerLoading ? 'Memproses...' : 'Lanjutkan'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-amber-600 bg-amber-50 p-4 rounded-lg">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm">
              {dangerModal.type === 'export' && 'Semua data transaksi dan pengaturan akan dikumpulkan ke dalam file .zip. Proses ini mungkin memakan waktu beberapa saat.'}
              {dangerModal.type === 'disable' && 'Akun Anda akan disembunyikan dan dijedah sementara. Anda bisa mengaktifkannya kembali dengan login.'}
              {dangerModal.type === 'delete' && 'Tindakan ini tidak bisa dibatalkan! Semua data, budget, transaksi, dan histori Anda akan dihapus selamanya dari sistem kami.'}
            </p>
          </div>
          {dangerModal.type === 'delete' && (
            <div>
              <Label>Ketik "HAPUS" untuk mengkonfirmasi</Label>
              <Input
                placeholder="HAPUS"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

function ToggleRow({ prefKey, label, desc, checked, onToggle, defaultChecked }: {
  prefKey?: string;
  label: string;
  desc: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onToggle?: (key: string, val: boolean) => void;
}) {
  const [localChecked, setLocalChecked] = useState(checked ?? defaultChecked ?? false);

  // Sync external checked changes (e.g. when preferences load from API)
  useEffect(() => {
    if (checked !== undefined) setLocalChecked(checked);
  }, [checked]);

  const handleChange = () => {
    const newVal = !localChecked;
    setLocalChecked(newVal);
    if (prefKey && onToggle) {
      onToggle(prefKey, newVal);
      toast.success(`"${label}" ${newVal ? 'diaktifkan' : 'dinonaktifkan'}.`);
    } else {
      toast.success(`"${label}" ${newVal ? 'diaktifkan' : 'dinonaktifkan'}.`);
    }
  };

  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        <div className="text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={localChecked}
          className="peer sr-only"
          onChange={handleChange}
        />
        <div className={`w-10 h-6 rounded-full transition ${localChecked ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition transform ${localChecked ? 'translate-x-4' : ''}`} />
      </div>
    </label>
  );
}
