import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Edit, Trash2, TrendingDown, Calendar, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function BudgetDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get('id');
  const [budget, setBudget] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchBudgetDetail();
  }, [accessToken, budgetId]);

  const fetchBudgetDetail = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/budgets/${budgetId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setBudget(data.budget);
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus budget ini?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/budgets/${budgetId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        toast.success('Budget berhasil dihapus');
        navigate('/budgets');
      } else {
        toast.error('Gagal menghapus budget');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Gagal menghapus budget');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!budget) {
    return null;
  }

  const spent = budget.spent || 0;
  const limit = budget.amount || 0;
  const percentage = (spent / limit) * 100;
  const remaining = limit - spent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/budgets')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Detail Budget</h1>
          <div className="w-10" />
        </div>

        <div className="text-center mb-6">
          <p className="text-white/80 text-sm mb-2 capitalize">{budget.category}</p>
          <h2 className="text-4xl font-bold text-white mb-2">
            Rp {spent.toLocaleString('id-ID')}
          </h2>
          <p className="text-white/60">
            dari Rp {limit.toLocaleString('id-ID')}
          </p>
        </div>

        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              percentage > 90 ? 'bg-red-400' : percentage > 75 ? 'bg-yellow-400' : 'bg-green-400'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="flex justify-between mt-3 text-white/80 text-sm">
          <span>{percentage.toFixed(0)}% terpakai</span>
          <span>{(100 - percentage).toFixed(0)}% tersisa</span>
        </div>
      </div>

      <div className="px-6 -mt-12 space-y-4">
        {percentage > 90 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Peringatan Budget!</h4>
              <p className="text-sm text-red-700">
                Anda sudah menggunakan {percentage.toFixed(0)}% dari budget. Sisa Rp {remaining.toLocaleString('id-ID')}
              </p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Informasi Budget</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Periode</span>
              <span className="font-semibold text-[#0A0A0A] capitalize">{budget.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mulai</span>
              <span className="font-semibold text-[#0A0A0A]">
                {new Date(budget.startDate).toLocaleDateString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sisa</span>
              <span className={`font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                Rp {remaining.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => navigate(`/edit-budget?id=${budgetId}`)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7C3AED] text-white font-semibold hover:bg-[#6D31D4] transition-colors"
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Hapus
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-4">
            <TrendingDown className="w-5 h-5 inline mr-2" />
            Transaksi Terkait
          </h3>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada transaksi</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-[#0A0A0A]">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span className="font-semibold text-red-600">
                    -Rp {transaction.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
