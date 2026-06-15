import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Check } from 'lucide-react';
import { toast } from 'sonner';

export function CreatePIN() {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [loading, setLoading] = useState(false);

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = isConfirm ? [...confirmPin] : [...pin];
    newPin[index] = value;

    if (isConfirm) {
      setConfirmPin(newPin);
    } else {
      setPin(newPin);
    }

    if (value && index < 5) {
      const nextInput = document.getElementById(
        `${isConfirm ? 'confirm-' : ''}pin-${index + 1}`
      );
      nextInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const pinValue = pin.join('');
    const confirmPinValue = confirmPin.join('');

    if (step === 'create') {
      if (pinValue.length === 6) {
        setStep('confirm');
      } else {
        toast.error('PIN harus 6 digit');
      }
    } else {
      if (pinValue !== confirmPinValue) {
        toast.error('PIN tidak cocok');
        setConfirmPin(['', '', '', '', '', '']);
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        toast.success('PIN berhasil dibuat!');
        navigate('/dashboard');
      }, 1000);
    }
  };

  const currentPin = step === 'create' ? pin : confirmPin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">
              {step === 'create' ? 'Buat PIN' : 'Konfirmasi PIN'}
            </h1>
            <p className="text-gray-500">
              {step === 'create'
                ? 'Buat 6 digit PIN untuk keamanan akun'
                : 'Masukkan ulang PIN Anda'}
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center gap-3">
              {currentPin.map((digit, index) => (
                <input
                  key={index}
                  id={`${step === 'confirm' ? 'confirm-' : ''}pin-${index}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handlePinChange(index, e.target.value, step === 'confirm')
                  }
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || currentPin.some((d) => !d)}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-3 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {step === 'create' ? 'Lanjutkan' : 'Selesai'}
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>

            {step === 'confirm' && (
              <button
                onClick={() => {
                  setStep('create');
                  setConfirmPin(['', '', '', '', '', '']);
                }}
                className="w-full text-gray-600 hover:text-[#7C3AED] transition-colors font-medium"
              >
                Ubah PIN
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
