import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  QrCode,
  Bell,
  User,
  ShoppingBag,
  Home as HomeIcon,
  Car,
  Coffee,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Activity,
  CreditCard,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BottomNav } from './BottomNav';
import { QuickAddTransaction } from './QuickAddTransaction';
import { BudgetCard } from './BudgetCard';
import { FinancialTips } from './FinancialTips';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface Stats {
  user: { id: number; name: string; currency: string };
  balance: {
    total: number;
    monthly_income: number;
    monthly_expense: number;
    net_monthly: number;
  };
  summary: {
    transactions_count: number;
    budgets_active: number;
    goals_active: number;
    notifications_unread: number;
  };
}

interface Breakdown {
  category: string;
  total: number;
  percentage: number;
  color?: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [breakdown, setBreakdown] = useState<Breakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('api_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData(token);
  }, [navigate]);

  const fetchData = async (token: string) => {
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      };

      const [statsRes, transRes, breakdownRes] = await Promise.all([
        fetch('/api/dashboard/stats', { headers }),
        fetch('/api/dashboard/recent-transactions?limit=5', { headers }),
        fetch('/api/analytics/category-breakdown?type=expense', { headers })
      ]);

      if (!statsRes.ok) throw new Error('Session expired');

      const statsData = await statsRes.json();
      const transData = await transRes.json();
      const breakdownData = await breakdownRes.json();

      setStats(statsData);
      setTransactions(transData.transactions || []);
      // Handle the case where breakdown API might not be fully functional or returns empty
      setBreakdown(Array.isArray(breakdownData) ? breakdownData : []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard. Silakan login kembali.');
      localStorage.removeItem('api_token');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      shopping: ShoppingBag,
      housing: HomeIcon,
      transport: Car,
      food: Coffee,
      salary: DollarSign,
      other: CreditCard
    };
    const key = category.toLowerCase();
    const Icon = icons[key] || Activity;
    return <Icon className="w-5 h-5" />;
  };

  const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">Menyiapkan Dashboard...</p>
      </div>
    );
  }

  const unreadCount = stats?.summary?.notifications_unread || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] pb-24">
      {/* HEADER SECTION WITH GLASSMORPHISM */}
      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#2347A8] to-[#3B82F6] px-6 pt-10 pb-28 rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl mix-blend-overlay" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#7C3AED] opacity-20 rounded-full blur-3xl mix-blend-overlay" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner border border-white/20">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs font-medium">Selamat datang kembali,</p>
                <h1 className="text-xl font-bold text-white tracking-wide">
                  {stats?.user?.name?.split(' ')[0] || 'User'} 👋
                </h1>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/notifications')}
                className="relative w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 shadow-sm"
              >
                <Bell className="w-5 h-5 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold shadow-md border-2 border-[#1E3A8A]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-white/80 mb-1.5 text-sm font-medium">Total Saldo (IDR)</p>
            <h1 className="text-[2.75rem] font-extrabold text-white leading-none tracking-tight flex items-baseline gap-1 drop-shadow-md">
              <span className="text-2xl opacity-80 font-semibold mr-1">Rp</span>
              {new Intl.NumberFormat('id-ID').format(stats?.balance?.total || 0)}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-400/20 rounded-xl flex items-center justify-center shadow-inner">
                  <ArrowDownRight className="w-4 h-4 text-green-300" />
                </div>
                <span className="text-green-100 text-xs font-medium">Pemasukan</span>
              </div>
              <p className="text-lg font-bold text-white">
                {formatIDR(stats?.balance?.monthly_income || 0)}
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-400/20 rounded-xl flex items-center justify-center shadow-inner">
                  <ArrowUpRight className="w-4 h-4 text-red-300" />
                </div>
                <span className="text-red-100 text-xs font-medium">Pengeluaran</span>
              </div>
              <p className="text-lg font-bold text-white">
                {formatIDR(stats?.balance?.monthly_expense || 0)}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20">
        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/qr-scanner')}
            className="bg-card text-foreground py-4 rounded-2xl font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 border border-border"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-sm">Scan QRIS</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowQuickAdd(true)}
            className="bg-card text-foreground py-4 rounded-2xl font-semibold shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-2 border border-border"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm">Catat Cepat</span>
          </motion.button>
        </div>

        {/* ACTIVE GOALS/BUDGET SUMMARY */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Budget Aktif</p>
                <p className="font-bold text-lg leading-none">{stats?.summary?.budgets_active || 0}</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Target Capaian</p>
                <p className="font-bold text-lg leading-none">{stats?.summary?.goals_active || 0}</p>
              </div>
            </div>
        </div>

        {/* PIE CHART EXPENSES */}
        <div className="bg-card rounded-[1.5rem] shadow-sm border border-border p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-1">Distribusi Pengeluaran</h2>
          <p className="text-xs text-muted-foreground mb-6">Bulan ini berdasarkan kategori</p>
          
          {breakdown && breakdown.length > 0 ? (
            <div className="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={entry.color || defaultColors[index % defaultColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatIDR(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Circle Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total</span>
                <span className="text-sm font-bold text-foreground">
                   {formatIDR(stats?.balance?.monthly_expense || 0)}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center text-center px-4 bg-muted/20 rounded-2xl border border-dashed border-border">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <PieChart className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground">Belum ada pengeluaran</p>
              <p className="text-xs text-muted-foreground mt-1">Mulai catat transaksi untuk melihat visualisasi pengeluaranmu.</p>
            </div>
          )}
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="bg-card rounded-[1.5rem] shadow-sm border border-border p-5 mb-6">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-lg font-bold text-foreground">Transaksi Terakhir</h2>
            <button onClick={() => navigate('/transactions')} className="text-primary font-semibold text-xs bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={transaction.id}
                  className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer group"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105 ${
                    transaction.type === 'income' 
                      ? 'bg-gradient-to-br from-green-100 to-green-50 text-green-600' 
                      : 'bg-gradient-to-br from-red-100 to-red-50 text-red-600'
                  }`}>
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {transaction.description}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {transaction.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-bold text-sm ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatIDR(transaction.amount)}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                      {new Date(transaction.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-muted-foreground/60" />
                </div>
                <p className="text-sm font-medium text-foreground">Belum ada transaksi</p>
                <p className="text-xs text-muted-foreground mt-1">Transaksi terbarumu akan muncul di sini.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {showQuickAdd && (
          <QuickAddTransaction
            onClose={() => setShowQuickAdd(false)}
            onSuccess={() => fetchData(localStorage.getItem('api_token') || '')}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
