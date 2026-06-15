import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Tag, DollarSign, Calendar, Repeat } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

export function CreateBudget() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'shopping',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    notifications: true
  });
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/budgets`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount)
          })
        }
      );

      if (!response.ok) {
        toast.error('Gagal membuat budget');
        return;
      }

      toast.success('Budget berhasil dibuat!');
      navigate('/budgets');
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error('Gagal membuat budget');
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
          <h1 className="text-xl font-bold text-white">Buat Budget Baru</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
              >
                <option value="shopping">Belanja</option>
                <option value="food">Makanan & Minuman</option>
                <option value="transport">Transportasi</option>
                <option value="housing">Rumah Tangga</option>
                <option value="entertainment">Hiburan</option>
                <option value="healthcare">Kesehatan</option>
                <option value="education">Pendidikan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Limit Budget
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
                {[500000, 1000000, 2000000, 5000000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    className="flex-1 py-2 px-3 rounded-lg bg-gray-100 hover:bg-purple-100 hover:text-[#7C3AED] text-sm font-medium transition-colors"
                  >
                    {amount >= 1000000 ? `${amount / 1000000}jt` : `${amount / 1000}k`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Repeat className="w-4 h-4 inline mr-2" />
                Periode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['weekly', 'monthly', 'yearly'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setFormData({ ...formData, period })}
                    className={`py-3 rounded-xl border-2 transition-all font-medium capitalize ${
                      formData.period === period
                        ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div>
                <h4 className="font-semibold text-[#0A0A0A] mb-1">Notifikasi Budget</h4>
                <p className="text-sm text-gray-600">Alert saat mendekati limit</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3AED]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Membuat...' : 'Buat Budget'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
