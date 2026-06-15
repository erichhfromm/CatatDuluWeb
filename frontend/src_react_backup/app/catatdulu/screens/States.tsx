import { Inbox, FileX, BellOff, PieChart, Plus, ArrowLeft, RefreshCw, ShieldOff, ServerCrash, WifiOff } from 'lucide-react';
import { Card, Button, SectionHeader } from '../ui';
import type { Route } from '../Layout';

function EmptyBlock({ icon: Icon, title, desc, action }: any) {
  return (
    <Card className="p-10 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">{desc}</p>
      {action}
    </Card>
  );
}

export function EmptyStates() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Empty States" desc="Tampilan ketika belum ada data dalam berbagai konteks." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmptyBlock icon={Inbox} title="Belum ada transaksi" desc="Mulai catat pemasukan atau pengeluaran pertama Anda untuk melihatnya di sini." action={<Button icon={<Plus className="w-4 h-4" />}>Tambah Transaksi</Button>} />
        <EmptyBlock icon={PieChart} title="Budget belum dibuat" desc="Atur anggaran bulanan agar pengeluaran Anda lebih terkontrol dan terencana." action={<Button icon={<Plus className="w-4 h-4" />}>Buat Budget Pertama</Button>} />
        <EmptyBlock icon={BellOff} title="Tidak ada notifikasi" desc="Anda sudah membaca semua notifikasi. Kami akan beri tahu jika ada yang baru." action={<Button variant="outline">Atur Preferensi</Button>} />
        <EmptyBlock icon={FileX} title="Belum ada laporan" desc="Generate laporan pertama untuk melihat ringkasan keuangan Anda secara menyeluruh." action={<Button>Generate Laporan</Button>} />
      </div>
    </div>
  );
}

function ErrorBlock({ code, icon: Icon, title, desc, action }: any) {
  return (
    <Card className="p-10 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-red-600" />
      </div>
      <div className="text-5xl font-bold text-primary mb-1">{code}</div>
      <h3 className="mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">{desc}</p>
      {action}
    </Card>
  );
}

export function ErrorStates({ setRoute }: { setRoute: (r: Route) => void }) {
  return (
    <div className="space-y-6">
      <SectionHeader title="Error States" desc="Halaman error untuk berbagai kondisi tidak terduga." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorBlock code="404" icon={FileX} title="Halaman tidak ditemukan" desc="URL yang Anda tuju tidak ada atau sudah dipindahkan. Periksa kembali alamatnya." action={<Button onClick={() => setRoute('dashboard')} icon={<ArrowLeft className="w-4 h-4" />}>Kembali ke Dashboard</Button>} />
        <ErrorBlock code="500" icon={ServerCrash} title="Server error" desc="Terjadi kesalahan di sisi server kami. Tim kami sudah diberitahu. Mohon coba lagi." action={<Button icon={<RefreshCw className="w-4 h-4" />}>Coba Lagi</Button>} />
        <ErrorBlock code="—" icon={WifiOff} title="Tidak ada koneksi" desc="Periksa koneksi internet Anda kemudian muat ulang halaman ini." action={<Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>Muat Ulang</Button>} />
        <ErrorBlock code="401" icon={ShieldOff} title="Akses tidak diizinkan" desc="Anda perlu masuk ke akun untuk mengakses halaman ini." action={<Button onClick={() => setRoute('login')}>Masuk Sekarang</Button>} />
      </div>
    </div>
  );
}
