import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Wallet, CreditCard, Building2, QrCode, Plus } from 'lucide-react';
import { useState } from 'react';

export function PaymentMethod() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'ewallet',
      icon: Wallet,
      name: 'E-Wallet',
      description: 'GoPay, OVO, Dana, LinkAja',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'bank',
      icon: Building2,
      name: 'Transfer Bank',
      description: 'BCA, Mandiri, BNI, BRI',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'card',
      icon: CreditCard,
      name: 'Kartu Kredit/Debit',
      description: 'Visa, Mastercard',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'qris',
      icon: QrCode,
      name: 'QRIS',
      description: 'Scan QR untuk bayar',
      color: 'from-red-500 to-red-600'
    }
  ];

  const handleContinue = () => {
    if (selectedMethod) {
      navigate(`/payment-transfer?method=${selectedMethod}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Metode Pembayaran</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full bg-white rounded-2xl shadow-lg p-6 transition-all ${
                selectedMethod === method.id
                  ? 'ring-2 ring-[#7C3AED] ring-offset-2'
                  : 'hover:shadow-xl'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                  <method.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-[#0A0A0A] mb-1">{method.name}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-[#7C3AED] bg-[#7C3AED]'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}

          <button
            onClick={() => navigate('/add-payment-method')}
            className="w-full bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-[#7C3AED] hover:bg-purple-50 transition-all"
          >
            <div className="flex items-center justify-center gap-3 text-gray-600 hover:text-[#7C3AED] transition-colors">
              <Plus className="w-6 h-6" />
              <span className="font-medium">Tambah Metode Pembayaran Baru</span>
            </div>
          </button>
        </motion.div>

        {selectedMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Lanjutkan
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
