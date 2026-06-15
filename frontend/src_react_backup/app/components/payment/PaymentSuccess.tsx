import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, Download, Share2, Home } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount, recipient, method } = location.state || {};

  const handleDownload = () => {
    toast.success('Bukti transfer diunduh');
  };

  const handleShare = () => {
    toast.success('Bukti transfer dibagikan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mb-8"
      >
        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-white mb-3">
          Transfer Berhasil!
        </h1>
        <p className="text-white/80">
          Transfer Anda telah berhasil diproses
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 mb-6"
      >
        <div className="text-center pb-6 border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Jumlah Transfer</p>
          <h2 className="text-4xl font-bold text-[#7C3AED]">
            Rp {parseFloat(amount || '0').toLocaleString('id-ID')}
          </h2>
        </div>

        <div className="space-y-4 pt-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Penerima</span>
            <span className="font-semibold text-[#0A0A0A]">{recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Metode</span>
            <span className="font-semibold text-[#0A0A0A] capitalize">{method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tanggal</span>
            <span className="font-semibold text-[#0A0A0A]">
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Waktu</span>
            <span className="font-semibold text-[#0A0A0A]">
              {new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nomor Referensi</span>
            <span className="font-mono text-sm font-semibold text-[#0A0A0A]">
              {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-md space-y-3"
      >
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all"
          >
            <Download className="w-5 h-5" />
            Unduh
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Bagikan
          </button>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-[#7C3AED] font-bold hover:shadow-lg transition-all"
        >
          <Home className="w-5 h-5" />
          Kembali ke Beranda
        </button>
      </motion.div>
    </div>
  );
}
