import { motion } from 'motion/react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface NetworkErrorProps {
  onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6"
    >
      <div className="w-32 h-32 rounded-full bg-red-50 flex items-center justify-center mb-6">
        <WifiOff className="w-16 h-16 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">
        Tidak Ada Koneksi
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        Periksa koneksi internet Anda dan coba lagi
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Coba Lagi
        </button>
      )}
    </motion.div>
  );
}
