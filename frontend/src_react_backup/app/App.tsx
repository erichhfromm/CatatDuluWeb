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
import { Dashboard } from './catatdulu/screens/Dashboard';
import { IncomeScreen, ExpenseScreen } from './catatdulu/screens/Transactions';
import { BudgetScreen, AnalyticsScreen } from './catatdulu/screens/BudgetAnalytics';
import { ReportsScreen } from './catatdulu/screens/Reports';
import { NotificationsScreen, ProfileScreen, SettingsScreen } from './catatdulu/screens/Account';

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
      {route === 'dashboard' && <Dashboard setRoute={setRoute} />}
      {route === 'income' && <IncomeScreen setRoute={setRoute} />}
      {route === 'expense' && <ExpenseScreen setRoute={setRoute} />}
      {route === 'budget' && <BudgetScreen />}
      {route === 'analytics' && <AnalyticsScreen />}
      {route === 'reports' && <ReportsScreen />}
      {route === 'notifications' && <NotificationsScreen />}
      {route === 'profile' && <ProfileScreen />}
      {route === 'settings' && <SettingsScreen />}

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