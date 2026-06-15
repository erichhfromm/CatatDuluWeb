import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Edit, Trash2, Calendar, Tag, FileText, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function TransactionDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('id');
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchTransactionDetail();
  }, [accessToken, transactionId]);

  const fetchTransactionDetail = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTransaction(data.transaction);
      } else {
        toast.error('Failed to load transaction');
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/transactions/${transactionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        toast.success('Transaksi berhasil dihapus');
        navigate('/transaction-history');
      } else {
        toast.error('Gagal menghapus transaksi');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Gagal menghapus transaksi');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] p-6">
        <p className="text-center text-gray-600">Transaksi tidak ditemukan</p>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: any = {
      shopping: '🛍️',
      food: '🍔',
      transport: '🚗',
      housing: '🏠',
      salary: '💰',
      freelance: '💼',
      investment: '📈',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/transaction-history')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Detail Transaksi</h1>
          <div className="w-10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-white/80 mb-2">Jumlah</p>
          <h2 className={`text-4xl font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
            {transaction.type === 'income' ? '+' : '-'}Rp {transaction.amount.toLocaleString('id-ID')}
          </h2>
        </motion.div>
      </div>

      <div className="px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center text-2xl">
              {getCategoryIcon(transaction.category)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#0A0A0A] mb-1">
                {transaction.description || 'Tidak ada deskripsi'}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-[#7C3AED]" />
              <div>
                <p className="text-xs text-gray-500">Tanggal</p>
                <p className="font-medium text-[#0A0A0A]">
                  {new Date(transaction.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Tag className="w-5 h-5 text-[#7C3AED]" />
              <div>
                <p className="text-xs text-gray-500">Tipe</p>
                <p className="font-medium text-[#0A0A0A] capitalize">
                  {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-[#7C3AED]" />
              <div>
                <p className="text-xs text-gray-500">Kategori</p>
                <p className="font-medium text-[#0A0A0A] capitalize">{transaction.category}</p>
              </div>
            </div>

            {transaction.qr_data && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <FileText className="w-5 h-5 text-[#7C3AED] mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">QR Data</p>
                  <p className="font-mono text-sm text-[#0A0A0A] break-all">
                    {transaction.qr_data}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={() => navigate(`/edit-transaction?id=${transactionId}`)}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7C3AED] text-white font-semibold hover:bg-[#6D31D4] transition-colors"
            >
              <Edit className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              {deleting ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
