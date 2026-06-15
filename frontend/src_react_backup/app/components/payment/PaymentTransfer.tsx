import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, User, DollarSign, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function PaymentTransfer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const method = searchParams.get('method');

  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Transfer berhasil!');
      navigate('/payment-success', {
        state: {
          amount: formData.amount,
          recipient: formData.recipient,
          method
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Transfer gagal');
    } finally {
      setLoading(false);
    }
  };

  const getMethodName = (method: string | null) => {
    const methods: any = {
      ewallet: 'E-Wallet',
      bank: 'Transfer Bank',
      card: 'Kartu Kredit/Debit',
      qris: 'QRIS'
    };
    return methods[method || ''] || 'Unknown';
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
          <h1 className="text-xl font-bold text-white">Transfer Dana</h1>
          <div className="w-10" />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <p className="text-white/80 text-sm mb-1">Metode Pembayaran</p>
          <p className="text-white font-bold text-lg">{getMethodName(method)}</p>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Penerima
              </label>
              <input
                type="text"
                value={formData.recipient}
                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                placeholder={method === 'bank' ? 'Nomor Rekening' : 'Nomor HP / ID'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Jumlah Transfer
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  Rp
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex gap-2 mt-3">
                {[50000, 100000, 250000, 500000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    className="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-purple-100 hover:text-[#7C3AED] text-sm font-medium transition-colors"
                  >
                    {amount / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Catatan (Opsional)
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all resize-none"
                rows={3}
                placeholder="Tambahkan catatan untuk transfer ini"
              />
            </div>

            <div className="bg-purple-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jumlah Transfer</span>
                <span className="font-semibold text-[#0A0A0A]">
                  Rp {parseFloat(formData.amount || '0').toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-semibold text-[#0A0A0A]">Gratis</span>
              </div>
              <div className="border-t border-purple-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#0A0A0A]">Total</span>
                  <span className="font-bold text-[#7C3AED] text-lg">
                    Rp {parseFloat(formData.amount || '0').toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Kirim Transfer'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
