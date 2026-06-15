import { motion } from 'motion/react';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center mb-8">
          <FileQuestion className="w-20 h-20 text-[#7C3AED]" />
        </div>
        <h1 className="text-6xl font-bold text-[#7C3AED] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#0A0A0A] mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin sudah dipindahkan atau dihapus.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Beranda
          </button>
        </div>
      </motion.div>
    </div>
  );
}
