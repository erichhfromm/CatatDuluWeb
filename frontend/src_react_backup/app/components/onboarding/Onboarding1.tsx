import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Wallet, ArrowRight } from 'lucide-react';

export function Onboarding1() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between p-8">
        <div className="flex justify-end w-full">
          <button
            onClick={() => navigate('/login')}
            className="text-white/80 hover:text-white transition-colors font-medium"
          >
            Skip
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-48 h-48 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-12 border border-white/20">
            <Wallet className="w-24 h-24 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Kelola Keuangan dengan Mudah
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            Pantau pemasukan dan pengeluaran Anda secara real-time dengan fitur analisis yang lengkap
          </p>
        </motion.div>

        <div className="w-full space-y-4">
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-8 h-2 bg-white rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
            <div className="w-2 h-2 bg-white/30 rounded-full" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/onboarding-2')}
            className="w-full bg-white text-[#7C3AED] py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
          >
            Selanjutnya
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
