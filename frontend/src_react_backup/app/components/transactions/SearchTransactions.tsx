import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId } from '/utils/supabase/info';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export function SearchTransactions() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchTransactions();
  }, [accessToken]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions([]);
      return;
    }

    const filtered = transactions.filter((t) => {
      const query = searchQuery.toLowerCase();
      return (
        t.description?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query) ||
        t.amount?.toString().includes(query)
      );
    });

    setFilteredTransactions(filtered);
  }, [searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/transactions`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Cari Transaksi</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan deskripsi, kategori, atau jumlah..."
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white border-2 border-transparent focus:border-white outline-none transition-all"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="px-6 -mt-2">
        {loading ? (
          <LoadingSkeleton type="transaction" count={5} />
        ) : searchQuery.trim() === '' ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Mulai ketik untuk mencari transaksi</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="font-bold text-[#0A0A0A] mb-2">Tidak Ada Hasil</h3>
            <p className="text-gray-500">
              Tidak ada transaksi yang cocok dengan "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-3">
              {filteredTransactions.length} hasil ditemukan
            </p>
            {filteredTransactions.map((transaction: any, index: number) => (
              <motion.button
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/transaction-detail?id=${transaction.id}`)}
                className="w-full bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center text-2xl">
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-[#0A0A0A] mb-1">
                      {transaction.description || 'No description'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="capitalize">{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}Rp{' '}
                      {transaction.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
