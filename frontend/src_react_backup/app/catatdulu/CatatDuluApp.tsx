import { useState } from 'react';
import { Layout, Route } from './Layout';
import {
  SplashScreen, LoginScreen, RegisterScreen,
  ForgotPasswordScreen, OTPResetPasswordScreen,
  CreateNewPasswordScreen, PasswordChangedSuccessScreen
} from './screens/Auth';
import { Dashboard } from './screens/Dashboard';
import { IncomeScreen, ExpenseScreen, TransactionDetail } from './screens/Transactions';
import { BudgetScreen, AnalyticsScreen } from './screens/BudgetAnalytics';
import { ReportsScreen } from './screens/Reports';
import { NotificationsScreen, ProfileScreen, SettingsScreen } from './screens/Account';
import { EmptyStates, ErrorStates } from './screens/States';
import { DesignSystem } from './screens/DesignSystem';

export function CatatDuluApp() {
  const [route, setRoute] = useState<Route>('splash');
  const [resetEmail, setResetEmail] = useState('');

  if (route === 'splash') return <SplashScreen onDone={() => setRoute('login')} />;
  if (route === 'login') return <LoginScreen setRoute={setRoute} />;
  if (route === 'register') return <RegisterScreen setRoute={setRoute} />;
  if (route === 'forgot-password') return <ForgotPasswordScreen setRoute={setRoute} setEmail={setResetEmail} />;
  if (route === 'otp-reset-password') return <OTPResetPasswordScreen setRoute={setRoute} email={resetEmail} />;
  if (route === 'create-new-password') return <CreateNewPasswordScreen setRoute={setRoute} />;
  if (route === 'password-changed-success') return <PasswordChangedSuccessScreen setRoute={setRoute} />;

  const screens: Record<string, JSX.Element> = {
    dashboard: <Dashboard setRoute={setRoute} />,
    income: <IncomeScreen setRoute={setRoute} />,
    expense: <ExpenseScreen setRoute={setRoute} />,
    'transaction-detail': <TransactionDetail setRoute={setRoute} />,
    budget: <BudgetScreen />,
    analytics: <AnalyticsScreen />,
    reports: <ReportsScreen />,
    notifications: <NotificationsScreen />,
    profile: <ProfileScreen />,
    settings: <SettingsScreen />,
    'design-system': <DesignSystem />,
    empty: <EmptyStates />,
    error: <ErrorStates setRoute={setRoute} />,
  };

  return (
    <Layout route={route} setRoute={setRoute}>
      {screens[route] || <Dashboard setRoute={setRoute} />}
    </Layout>
  );
}
