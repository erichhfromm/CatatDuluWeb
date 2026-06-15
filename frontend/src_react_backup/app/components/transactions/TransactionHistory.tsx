import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Filter,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Coffee,
  Car,
  Home as HomeIcon
} from 'lucide-react';
import { BottomNav } from '../BottomNav';

export function TransactionHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const transactions = [
    {
      id: '1',
      type: 'expense',
      category: 'shopping',
      description: 'Belanja Bulanan',
      amount: 500000,
      date: '2026-06-01T10:30:00',
      merchant: 'Supermarket ABC'
    },
    {
      id: '2',
      type: 'income',
      category: 'salary',
      description: 'Gaji Bulan Juni',
      amount: 5000000,
      date: '2026-06-01T08:00:00',
      merchant: 'PT. Example'
    },
    {
      id: '3',
      type: 'expense',
      category: 'food',
      description: 'Makan Siang',
      amount: 75000,
      date: '2026-05-31T12:15:00',
      merchant: 'Restaurant XYZ'
    }
  ];

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      shopping: ShoppingBag,
      food: Coffee,
      transport: Car,
      housing: HomeIcon
    };
    return icons[category] || ShoppingBag;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] pb-24">
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-6 py-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Riwayat Transaksi</h1>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#7C3AED]/50 outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'income', 'expense'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {filter === 'all' ? 'Semua' : filter === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {transactions.map((transaction) => {
          const Icon = getCategoryIcon(transaction.category);
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
              className="bg-white rounded-2xl shadow-md p-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-[#0A0A0A]">{transaction.description}</h3>
                  <p className="text-sm text-gray-500">{transaction.merchant}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(transaction.date).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => navigate('/filter-transactions')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] rounded-full shadow-2xl flex items-center justify-center z-40"
      >
        <Filter className="w-6 h-6 text-white" />
      </button>

      <BottomNav />
    </div>
  );
}
