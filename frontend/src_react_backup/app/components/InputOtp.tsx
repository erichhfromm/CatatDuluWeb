import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function InputOtp() {
  const location = useLocation();
  const navigate = useNavigate();

  // Menangkap data email dan phone yang dilempar dari page Register
  const email = location.state?.email || '';
  const phone = location.state?.phone || '';

  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Proteksi halaman: Jika tidak ada data email (akses ilegal tanpa register), tendang balik ke register
  useEffect(() => {
    if (!email) {
      toast.error('Sesi habis atau tidak valid, silakan daftar kembali.');
      navigate('/register');
    }
  }, [email, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      toast.error('Kode OTP harus berisikan 6 digit angka');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Verifikasi gagal');
        return;
      }

      // Berhasil verifikasi akun
      toast.success('Akun Anda berhasil diaktivasi! Silakan login secara manual.');
      
      // KUNCI UTAMA: Alihkan user ke halaman login manual, bukan dashboard
      navigate('/login');
    } catch (error) {
      toast.error('Terjadi kesalahan koneksi, coba lagi.');
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Gagal mengirim ulang OTP');
        return;
      }

      toast.success('Kode OTP baru berhasil dikirim ke WhatsApp Anda!');
    } catch (error) {
      toast.error('Gagal mengirim ulang kode OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">
              Verifikasi OTP 💬
            </h1>
            <p className="text-gray-500 text-sm px-2">
              Kode OTP telah dikirim ke nomor WhatsApp Anda{' '}
              <span className="font-semibold text-gray-800">({phone || 'Nomor HP'})</span>. 
              Silakan masukkan kode tersebut di bawah ini.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-3xl font-tracking-widest tracking-[0.5em] font-bold py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                placeholder="000000"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verifikasi Akun'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Tidak menerima kode?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-[#7C3AED] font-medium hover:text-[#5B21B6] transition-colors inline-flex items-center gap-1 disabled:opacity-50"
              >
                {resendLoading ? 'Mengirim...' : 'Kirim Ulang'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}