import { useState } from 'react';
import { Layout, type Route } from './catatdulu/Layout';
import { Toaster } from 'sonner';
import {
  SplashScreen,
  LoginScreen,
  RegisterScreen,
  OTPRegisterVerifyScreen,
  ForgotPasswordScreen,
  OTPResetPasswordScreen,
  CreateNewPasswordScreen,
  PasswordChangedSuccessScreen
} from './catatdulu/screens/Auth';

export function CatatDuluApp() {
  // State Utama Manajemen Tampilan Screen
  const [route, setRoute] = useState<Route>('splash');

  // State Penampung Sementara Data Aktivasi Registrasi OTP
  const [contextEmail, setContextEmail] = useState('');
  const [contextPhone, setContextPhone] = useState('');

  // State Penampung Sementara Data Lupa Password
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');

  // ==========================================
  // 1. BLOK PROSES AUTENTIKASI (LUAR DASHBOARD)
  // ==========================================

  if (route === 'splash') {
    return <SplashScreen onDone={() => setRoute('login')} />;
  }

  if (route === 'login') {
    return (
      <LoginScreen
        setRoute={setRoute}
        setContextEmail={setContextEmail}
        setContextPhone={setContextPhone}
      />
    );
  }

  if (route === 'register') {
    return (
      <RegisterScreen
        setRoute={setRoute}
        setContextEmail={setContextEmail}
        setContextPhone={setContextPhone}
      />
    );
  }

  // Merender Layar Utama Input OTP Aktivasi WhatsApp
  if (route === 'otp-register-verify') {
    return (
      <OTPRegisterVerifyScreen
        setRoute={setRoute}
        email={contextEmail}
        phone={contextPhone}
      />
    );
  }

  if (route === 'forgot-password') {
    return <ForgotPasswordScreen setRoute={setRoute} setEmail={setResetEmail} />;
  }

  if (route === 'otp-reset-password') {
    return <OTPResetPasswordScreen setRoute={setRoute} email={resetEmail} setResetOtp={setResetOtp} />;
  }

  if (route === 'create-new-password') {
    return <CreateNewPasswordScreen setRoute={setRoute} email={resetEmail} resetOtp={resetOtp} />;
  }

  if (route === 'password-changed-success') {
    return <PasswordChangedSuccessScreen setRoute={setRoute} />;
  }

  // ==========================================
  // 2. BLOK AKUN INTERNAL (DALAM BINGKAI LAYOUT)
  // ==========================================
  return (
    <Layout route={route} setRoute={setRoute}>
      {route === 'dashboard' && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Dashboard Keuangan</h1>
          <p className="text-muted-foreground text-sm">Selamat datang di aplikasi manajemen finansial Anda.</p>
          {/* Tempatkan Komponen Utama UI Dashboard Kamu Di Sini */}
        </div>
      )}

      {route === 'income' && (
        <div>
          <h1 className="text-2xl font-bold">Kelola Pemasukan (Income)</h1>
        </div>
      )}

      {route === 'expense' && (
        <div>
          <h1 className="text-2xl font-bold">Kelola Pengeluaran (Expense)</h1>
        </div>
      )}

      {route === 'budget' && (
        <div>
          <h1 className="text-2xl font-bold">Budgeting Cerdas</h1>
        </div>
      )}

      {route === 'analytics' && (
        <div>
          <h1 className="text-2xl font-bold">Analisis Keuangan</h1>
        </div>
      )}

      {route === 'reports' && (
        <div>
          <h1 className="text-2xl font-bold">Laporan Finansial</h1>
        </div>
      )}

      {route === 'notifications' && (
        <div>
          <h1 className="text-2xl font-bold">Notifikasi Sistem</h1>
        </div>
      )}

      {route === 'profile' && (
        <div>
          <h1 className="text-2xl font-bold">Profil Pengguna</h1>
        </div>
      )}

      {route === 'settings' && (
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Aplikasi</h1>
        </div>
      )}

      {/* Fallback Screen handler jika route belum didefinisikan tampilannya */}
      {!['dashboard', 'income', 'expense', 'budget', 'analytics', 'reports', 'notifications', 'profile', 'settings'].includes(route) && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Halaman <span className="font-semibold">{route}</span> sedang dalam proses pengembangan sistem.
        </div>
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <>
      <CatatDuluApp />
      <Toaster position="top-right" richColors />
    </>
  );
}