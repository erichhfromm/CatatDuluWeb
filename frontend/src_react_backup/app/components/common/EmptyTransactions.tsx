import { motion } from 'motion/react';
import { Receipt, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';

export function EmptyTransactions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center mb-6">
        <Receipt className="w-16 h-16 text-[#7C3AED]" />
      </div>
      <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">
        Belum Ada Transaksi
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        Mulai catat transaksi Anda untuk melihat laporan keuangan yang lengkap
      </p>
      <button
        onClick={() => navigate('/qr-scanner')}
        className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
      >
        <Plus className="w-5 h-5" />
        Tambah Transaksi
      </button>
    </motion.div>
  );
}
