import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';

export function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    icon: '📁',
    color: '#7C3AED',
    type: 'expense'
  });
  const [loading, setLoading] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  const icons = ['📁', '🛍️', '🍔', '🚗', '🏠', '💡', '🎮', '🎬', '📚', '💊', '🎓', '✈️', '🏋️', '🎨', '💼'];
  const colors = ['#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#14B8A6'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/categories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        toast.error('Gagal menambah kategori');
        return;
      }

      toast.success('Kategori berhasil ditambahkan!');
      navigate('/categories');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Gagal menambah kategori');
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
          <h1 className="text-xl font-bold text-white">Tambah Kategori</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilih Warna
              </label>
              <div className="grid grid-cols-4 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-full aspect-square rounded-xl transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 ring-gray-400 scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                Nama Kategori
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                placeholder="e.g. Entertainment"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Kategori
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['expense', 'income'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`py-3 rounded-xl border-2 transition-all font-medium capitalize ${
                      formData.type === type
                        ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 text-center">
              <div
                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-3 shadow-lg"
                style={{ backgroundColor: formData.color }}
              >
                {formData.icon}
              </div>
              <p className="font-semibold text-[#0A0A0A]">
                {formData.name || 'Nama Kategori'}
              </p>
              <p className="text-sm text-gray-600 capitalize">{formData.type}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Tambah Kategori'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
