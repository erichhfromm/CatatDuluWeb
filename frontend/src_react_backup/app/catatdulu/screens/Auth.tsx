import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, ArrowLeft, Phone } from 'lucide-react';
import { Button, Input, Label } from '../ui';
import type { Route } from '../Layout';
import { OTPInput } from 'input-otp';
import { toast } from 'sonner';

function Hero() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1E3A8A] via-[#2347A8] to-[#3B82F6] text-white p-12 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <div className="font-bold text-lg">CatatDulu</div>
          <div className="text-xs text-white/70">Personal Finance Platform</div>
        </div>
      </div>

      <div className="relative z-10 space-y-6">
        <h1 className="text-white text-4xl leading-tight font-bold">Catat keuangan, kelola masa depan.</h1>
        <p className="text-white/80 max-w-md">Platform manajemen keuangan personal dengan dashboard interaktif, budget cerdas, dan laporan otomatis untuk semua kebutuhan finansialmu.</p>

        <div className="grid grid-cols-1 gap-3 max-w-sm">
          {[
            { icon: TrendingUp, text: 'Analisa cashflow real-time' },
            { icon: ShieldCheck, text: 'Enkripsi end-to-end & aman' },
            { icon: CheckCircle2, text: 'Laporan PDF / Excel siap pakai' },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10">
              <f.icon className="w-4 h-4 text-blue-200" />
              <span className="text-sm">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex -space-x-2">
          {['#fda4af', '#fde68a', '#a7f3d0', '#bfdbfe'].map((c) => (
            <div key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: c }} />
          ))}
        </div>
        <div className="text-xs text-white/80"><b className="text-white">10,000+</b> pengguna aktif mempercayai CatatDulu</div>
      </div>
    </div>
  );
}

export function SplashScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#2347A8] to-[#3B82F6] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center text-white relative z-10">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-24 h-24 mx-auto rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 shadow-2xl">
          <Wallet className="w-12 h-12" />
        </motion.div>
        <h1 className="text-white text-4xl font-bold mb-2">CatatDulu</h1>
        <p className="text-white/80 mb-10">Personal Finance Management</p>
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }} className="w-2 h-2 rounded-full bg-white" />
          ))}
        </div>
        <button onClick={onDone} className="px-6 py-2 bg-white/15 hover:bg-white/25 rounded-full text-sm backdrop-blur border border-white/20">Lanjutkan →</button>
      </motion.div>
    </div>
  );
}

export function LoginScreen({ setRoute, setContextEmail, setContextPhone }: { setRoute: (r: Route) => void; setContextEmail: (e: string) => void; setContextPhone: (p: string) => void }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('ariana@catatdulu.id');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 403 && data.requires_otp) {
        toast.error(data.message);
        setContextEmail(data.email);
        setContextPhone(data.phone);
        setRoute('otp-register-verify');
        return;
      }

      if (!response.ok) {
        toast.error(data.message || 'Login gagal');
        return;
      }

      localStorage.setItem('api_token', data.token);
      toast.success('Selamat datang kembali!');
      setRoute('dashboard');
    } catch (error) {
      toast.error('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Hero />
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-2xl font-bold">Selamat datang kembali 👋</h1>
          <p className="text-muted-foreground mb-8 text-sm">Masuk ke akun untuk melanjutkan mengelola keuangan Anda.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label required>Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <div>
              <Label required>Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type={show ? 'text' : 'password'} placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border" /> Ingat saya
              </label>
              <button type="button" onClick={() => setRoute('forgot-password')} className="text-primary font-medium hover:underline">Lupa password?</button>
            </div>

            <Button
              type="submit"
              size="lg"
              className={`w-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>

            <div className="relative my-4 text-center text-xs text-muted-foreground">
              <div className="absolute inset-y-1/2 inset-x-0 border-t border-border" />
              <span className="relative bg-background px-3">atau lanjutkan dengan</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="md" className="w-full">Google</Button>
              <Button variant="outline" size="md" className="w-full">Apple</Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-6">
              Belum punya akun?{' '}
              <button type="button" onClick={() => setRoute('register')} className="text-primary font-semibold hover:underline">Daftar sekarang</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export function RegisterScreen({ setRoute, setContextEmail, setContextPhone }: { setRoute: (r: Route) => void; setContextEmail: (e: string) => void; setContextPhone: (p: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  // UBAH BAGIAN TRY-CATCH SIFAT SINKRONISASI KE JSON SECARA AMAN
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (password !== passwordConfirmation) {
      toast.error('Password dan konfirmasi password tidak sama');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // Memaksa Laravel merespons JSON standar
        },
        body: JSON.stringify({ name, email, phone, password, password_confirmation: passwordConfirmation }),
      });

      const textData = await response.text();
      let data;

      try {
        data = JSON.parse(textData);
      } catch (parseError) {
        // Menangkap jika Laravel mengalami internal crash 500 berupa HTML Whoops
        toast.error('Server Error (500). Silakan cek console inspect atau laravel.log!');
        console.error('Crash Response HTML:', textData);
        return;
      }

      if (!response.ok) {
        const errors = data.errors as Record<string, string[]> | undefined;
        const firstError = errors ? Object.values(errors)[0]?.[0] : data.message;
        toast.error(firstError || 'Pendaftaran gagal');
        return;
      }

      toast.success('Pendaftaran sukses! Kode OTP dikirim ke WhatsApp.');
      if (data.dev_otp) {
        toast.info(`[DEV MODE] Kode OTP Anda: ${data.dev_otp}`, { duration: 15000 });
      }
      setContextEmail(email);
      setContextPhone(phone);
      setRoute('otp-register-verify');
    } catch (error) {
      toast.error('Terjadi gangguan jaringan atau koneksi ditolak.');
      console.error('Network Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Hero />
      <div className="flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-2xl font-bold">Buat akun baru</h1>
          <p className="text-muted-foreground mb-8 text-sm">Gratis selamanya. Tanpa kartu kredit.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label required>Nama Lengkap</Label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Ariana Rizki" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label required>Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label required>Nomor WhatsApp</Label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="tel" placeholder="08123456789" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label required>Password</Label>
                <Input type="password" placeholder="Min. 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div>
                <Label required>Konfirmasi</Label>
                <Input type="password" placeholder="Ulangi password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-border" />
              <span>Saya menyetujui <a className="text-primary font-medium cursor-pointer">Syarat & Ketentuan</a> dan <a className="text-primary font-medium cursor-pointer">Kebijakan Privasi</a> CatatDulu.</span>
            </label>

            <Button
              type="submit"
              size="lg"
              className={`w-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Mendaftarkan...' : 'Buat Akun'}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Sudah punya akun?{' '}
              <button type="button" onClick={() => setRoute('login')} className="text-primary font-semibold hover:underline">Masuk di sini</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ... Sisa fungsi OTPRegisterVerifyScreen, ForgotPasswordScreen, dsb. tetap sama tanpa ada perubahan dibawah ini ...
export function OTPRegisterVerifyScreen({ setRoute, email, phone }: { setRoute: (r: Route) => void; email: string; phone: string }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || loading) return;
    setLoading(true);
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Verifikasi gagal');
        return;
      }

      toast.success('Akun berhasil diaktivasi! Silakan login secara manual.');
      setRoute('login');
    } catch (error) {
      toast.error('Gangguan koneksi ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Kode OTP baru telah dikirim ke WhatsApp Anda!');
        if (data.dev_otp) {
          toast.info(`[DEV MODE] Kode OTP Anda: ${data.dev_otp}`, { duration: 15000 });
        }
      } else {
        toast.error('Gagal mengirim ulang OTP.');
      }
    } catch (error) {
      toast.error('Gagal mengirim kode baru.');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Hero />
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <button type="button" onClick={() => setRoute('register')} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
          </button>

          <h1 className="mb-2 text-2xl font-bold">Verifikasi Aktivasi Akun 💬</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Kode OTP telah dikirim ke nomor WhatsApp Anda <span className="font-semibold text-foreground">({phone || 'Nomor Anda'})</span>. Silakan masukkan kode tersebut di bawah ini.
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center my-6">
              <OTPInput
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="flex gap-2"
                render={({ slots }) => (
                  <>
                    {slots.map((slot, idx) => (
                      <div key={idx} className={`relative flex h-14 w-12 items-center justify-center border text-xl font-semibold transition-all rounded-xl ${slot.isActive ? 'border-primary ring-2 ring-primary/20 z-10' : 'border-border bg-card'}`}>
                        {slot.char}
                        {slot.hasFakeCaret && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="h-6 w-px animate-pulse bg-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className={`w-full ${otp.length !== 6 || loading ? 'opacity-50 pointer-events-none' : ''}`}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Memverifikasi...' : 'Aktivasi Akun'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Tidak menerima kode?{' '}
              <button type="button" onClick={handleResend} className="text-primary font-semibold hover:underline">Kirim Ulang</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordScreen({ setRoute, setEmail }: { setRoute: (r: Route) => void; setEmail: (email: string) => void }) {
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setEmail(emailInput);
      setRoute('otp-reset-password');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Hero />
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <button type="button" onClick={() => setRoute('login')} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Masuk
          </button>

          <h1 className="mb-2 text-2xl font-bold">Lupa Password? 🔐</h1>
          <p className="text-muted-foreground mb-8 text-sm">Masukkan email terdaftar Anda. Kami akan mengirimkan kode OTP untuk mengatur ulang password Anda.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label required>Email</Label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" icon={<ArrowRight className="w-4 h-4" />}>
              Kirim OTP
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function OTPResetPasswordScreen({ setRoute, email }: { setRoute: (r: Route) => void; email: string }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6 || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRoute('create-new-password');
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Hero />
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <button type="button" onClick={() => setRoute('forgot-password')} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

          <h1 className="mb-2 text-2xl font-bold">Verifikasi OTP ✉️</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Kode OTP telah dikirim ke <span className="font-semibold text-foreground">{email || 'email Anda'}</span>. Silakan masukkan kode tersebut di bawah ini.
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center my-6">
              <OTPInput
                maxLength={6}
                value={otp}
                onChange={setOtp}
                containerClassName="flex gap-2"
                render={({ slots }) => (
                  <>
                    {slots.map((slot, idx) => (
                      <div key={idx} className={`relative flex h-14 w-12 items-center justify-center border text-xl font-semibold transition-all rounded-xl ${slot.isActive ? 'border-primary ring-2 ring-primary/20 z-10' : 'border-border bg-card'}`}>
                        {slot.char}
                        {slot.hasFakeCaret && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="h-6 w-px animate-pulse bg-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className={`w-full ${otp.length !== 6 || loading ? 'opacity-50 pointer-events-none' : ''}`}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Memverifikasi...' : 'Verifikasi'}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Tidak menerima kode?{' '}
              <button type="button" onClick={() => setOtp('')} className="text-primary font-semibold hover:underline">Kirim Ulang</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export function CreateNewPasswordScreen({ setRoute }: { setRoute: (r: Route) => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword || password.length < 8 || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRoute('password-changed-success');
    }, 1200);
  };

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatch = password === confirmPassword && password.length > 0;

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Hero />
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-2xl font-bold">Buat Password Baru 🔒</h1>
          <p className="text-muted-foreground mb-8 text-sm">Buat password baru yang kuat untuk mengamankan akun Anda.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label required>Password Baru</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type={showPassword ? 'text' : 'password'} placeholder="Password Baru" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label required>Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Konfirmasi Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-semibold text-foreground mb-1">Persyaratan Password:</div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                <span className={hasMinLength ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>Minimal 8 karakter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${hasUppercase ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                <span className={hasUppercase ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>Satu huruf besar (A-Z)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                <span className={hasNumber ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>Satu angka (0-9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isMatch ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                <span className={isMatch ? 'text-emerald-600 font-medium' : 'text-muted-foreground'}>Password cocok</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className={`w-full mt-2 ${!hasMinLength || !hasUppercase || !hasNumber || !isMatch || loading ? 'opacity-50 pointer-events-none' : ''}`}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function PasswordChangedSuccessScreen({ setRoute }: { setRoute: (r: Route) => void }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Hero />
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }} className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 text-emerald-600 shadow-md shadow-emerald-500/5">
            <CheckCircle2 className="w-8 h-8" />
          </motion.div>

          <h1 className="mb-2 text-2xl font-bold">Password Diperbarui! 🎉</h1>
          <p className="text-muted-foreground mb-8 text-sm">Password Anda telah berhasil diubah. Silakan masuk kembali menggunakan password baru Anda.</p>

          <Button onClick={() => setRoute('login')} size="lg" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
            Masuk Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}