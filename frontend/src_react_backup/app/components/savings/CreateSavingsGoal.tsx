import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Target, DollarSign, Calendar } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

export function CreateSavingsGoal() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    target: '',
    current: '0',
    category: 'general',
    deadline: '',
    icon: '🎯'
  });
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  const icons = ['🎯', '🏠', '🚗', '✈️', '💍', '🎓', '📱', '💰', '🎉', '🏖️'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/savings-goals`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            target: parseFloat(formData.target),
            current: parseFloat(formData.current)
          })
        }
      );

      if (!response.ok) {
        toast.error('Gagal membuat target tabungan');
        return;
      }

      toast.success('Target tabungan berhasil dibuat!');
      navigate('/savings-goals');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Gagal membuat target tabungan');
    } finally {
      setLoading(false);
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
          <h1 className="text-xl font-bold text-white">Target Tabungan Baru</h1>
          <div className="w-10" />
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilih Icon
              </label>
              <div className="grid grid-cols-5 gap-3">
                {icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`w-full aspect-square rounded-xl text-3xl flex items-center justify-center transition-all ${
                      formData.icon === icon
                        ? 'bg-gradient-to-br from-[#7C3AED]/20 to-[#5B21B6]/20 ring-2 ring-[#7C3AED]'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Nama Target
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                placeholder="e.g. Liburan ke Bali"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Target Jumlah
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  Rp
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex gap-2 mt-3">
                {[1000000, 5000000, 10000000, 20000000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, target: amount.toString() })}
                    className="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-purple-100 hover:text-[#7C3AED] text-sm font-medium transition-colors"
                  >
                    {amount >= 1000000 ? `${amount / 1000000}jt` : `${amount / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Tabungan Awal (Opsional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  Rp
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.current}
                  onChange={(e) => setFormData({ ...formData, current: e.target.value })}
                  className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Target Tanggal (Opsional)
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Membuat...' : 'Buat Target'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
