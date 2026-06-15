import { motion } from 'motion/react';
import { ServerCrash, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

interface ServerErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function ServerError({ message, onRetry }: ServerErrorProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6"
    >
      <div className="w-32 h-32 rounded-full bg-yellow-50 flex items-center justify-center mb-6">
        <ServerCrash className="w-16 h-16 text-yellow-600" />
      </div>
      <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">
        Terjadi Kesalahan Server
      </h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        {message || 'Server sedang mengalami gangguan. Silakan coba lagi nanti.'}
      </p>
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Coba Lagi
          </button>
        )}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          <Home className="w-5 h-5" />
          Beranda
        </button>
      </div>
    </motion.div>
  );
}
