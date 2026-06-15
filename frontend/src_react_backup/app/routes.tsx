import { createBrowserRouter } from 'react-router';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding1 } from './components/onboarding/Onboarding1';
import { Onboarding2 } from './components/onboarding/Onboarding2';
import { Onboarding3 } from './components/onboarding/Onboarding3';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { OTPResetPassword } from './components/auth/OTPResetPassword';
import { CreatePIN } from './components/auth/CreatePIN';
import { CreateNewPassword } from './components/auth/CreateNewPassword';
import { PasswordChangedSuccess } from './components/auth/PasswordChangedSuccess';
import { SessionExpired } from './components/auth/SessionExpired';
import { Dashboard } from './components/Dashboard';
import { QRScanner } from './components/QRScanner';
import { ScanReceipt } from './components/receipt/ScanReceipt';
import { ScanProcessing } from './components/receipt/ScanProcessing';
import { ScanResult } from './components/receipt/ScanResult';
import { TransactionHistory } from './components/transactions/TransactionHistory';
import { TransactionDetail } from './components/transactions/TransactionDetail';
import { EditTransaction } from './components/transactions/EditTransaction';
import { FilterTransactions } from './components/transactions/FilterTransactions';
import { CategoryList } from './components/categories/CategoryList';
import { AddCategory } from './components/categories/AddCategory';
import { BudgetList } from './components/budget/BudgetList';
import { CreateBudget } from './components/budget/CreateBudget';
import { BudgetDetail } from './components/budget/BudgetDetail';
import { SavingsGoals } from './components/savings/SavingsGoals';
import { CreateSavingsGoal } from './components/savings/CreateSavingsGoal';
import { FinancialReports } from './components/reports/FinancialReports';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { EditProfile } from './components/profile/EditProfile';
import { SecuritySettings } from './components/profile/SecuritySettings';
import { NotificationSettings } from './components/profile/NotificationSettings';
import { PaymentMethod } from './components/payment/PaymentMethod';
import { PaymentTransfer } from './components/payment/PaymentTransfer';
import { PaymentSuccess } from './components/payment/PaymentSuccess';
import { HelpCenter } from './components/help/HelpCenter';
import { AboutApp } from './components/help/AboutApp';
import { SearchTransactions } from './components/transactions/SearchTransactions';
import { NotFound } from './components/common/NotFound';

export const router = createBrowserRouter([
  // Splash & Onboarding
  { path: '/', element: <SplashScreen /> },
  { path: '/onboarding-1', element: <Onboarding1 /> },
  { path: '/onboarding-2', element: <Onboarding2 /> },
  { path: '/onboarding-3', element: <Onboarding3 /> },

  // Authentication
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/otp-reset-password', element: <OTPResetPassword /> },
  { path: '/create-new-password', element: <CreateNewPassword /> },
  { path: '/password-changed-success', element: <PasswordChangedSuccess /> },
  { path: '/create-pin', element: <CreatePIN /> },
  { path: '/session-expired', element: <SessionExpired /> },

  // Main App
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/profile', element: <Profile /> },

  // QR & Receipt Scanning
  { path: '/qr-scanner', element: <QRScanner /> },
  { path: '/scan-receipt', element: <ScanReceipt /> },
  { path: '/scan-processing', element: <ScanProcessing /> },
  { path: '/scan-result', element: <ScanResult /> },

  // Transactions
  { path: '/transaction-history', element: <TransactionHistory /> },
  { path: '/transaction-detail', element: <TransactionDetail /> },
  { path: '/edit-transaction', element: <EditTransaction /> },
  { path: '/filter-transactions', element: <FilterTransactions /> },

  // Payment & Transfer
  { path: '/payment-method', element: <PaymentMethod /> },
  { path: '/payment-transfer', element: <PaymentTransfer /> },
  { path: '/payment-success', element: <PaymentSuccess /> },

  // Categories
  { path: '/categories', element: <CategoryList /> },
  { path: '/add-category', element: <AddCategory /> },

  // Budget
  { path: '/budgets', element: <BudgetList /> },
  { path: '/create-budget', element: <CreateBudget /> },
  { path: '/budget-detail', element: <BudgetDetail /> },

  // Savings
  { path: '/savings-goals', element: <SavingsGoals /> },
  { path: '/create-savings-goal', element: <CreateSavingsGoal /> },

  // Reports
  { path: '/reports', element: <FinancialReports /> },

  // Profile
  { path: '/edit-profile', element: <EditProfile /> },
  { path: '/security-settings', element: <SecuritySettings /> },
  { path: '/notification-settings', element: <NotificationSettings /> },

  // Help & Support
  { path: '/help-center', element: <HelpCenter /> },
  { path: '/about-app', element: <AboutApp /> },

  // Search
  { path: '/search-transactions', element: <SearchTransactions /> },

  // 404
  { path: '*', element: <NotFound /> }
]);
