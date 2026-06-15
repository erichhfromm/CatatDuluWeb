import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Clock, LogIn } from 'lucide-react';

export function SessionExpired() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-12 h-12 text-orange-500" />
          </div>

          <h1 className="text-2xl font-bold text-[#0A0A0A] mb-3">
            Sesi Anda Telah Berakhir
          </h1>
          <p className="text-gray-600 mb-8">
            Untuk keamanan akun Anda, silakan login kembali
          </p>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Login Kembali
          </button>
        </div>
      </motion.div>
    </div>
  );
}
