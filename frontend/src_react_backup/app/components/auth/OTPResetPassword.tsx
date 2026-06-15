import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Lock, ArrowLeft } from 'lucide-react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { toast } from 'sonner';

export function OTPResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (otp.length === 6) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast.success('OTP verified!');
        navigate('/create-new-password');
      }, 1000);
    } else {
      toast.error('Masukkan 6 digit OTP');
    }
  };

  const handleResend = () => {
    toast.success('OTP baru telah dikirim');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate('/forgot-password')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">
            Verifikasi OTP
          </h2>
          <p className="text-gray-500 mb-8">
            Kode OTP telah dikirim ke {email}
          </p>

          <div className="flex justify-center mb-8">
            <OTPInput
              maxLength={6}
              value={otp}
              onChange={setOtp}
              containerClassName="flex gap-2"
              render={({ slots }) => (
                <>
                  {slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`relative flex h-14 w-12 items-center justify-center border-2 text-xl font-semibold transition-all rounded-xl ${
                        slot.isActive
                          ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/20 z-10'
                          : 'border-gray-200'
                      }`}
                    >
                      {slot.char}
                      {slot.hasFakeCaret && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="h-6 w-px animate-pulse bg-[#7C3AED]" />
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 mb-4"
          >
            {loading ? 'Memverifikasi...' : 'Verifikasi'}
          </button>

          <button
            onClick={handleResend}
            className="text-[#7C3AED] font-medium hover:text-[#5B21B6] transition-colors"
          >
            Kirim ulang OTP
          </button>
        </div>
      </motion.div>
    </div>
  );
}
