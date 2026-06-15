import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

export function ScanResult() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [result, setResult] = useState({
    merchant: 'Supermarket ABC',
    date: '2026-06-01',
    total: 125000,
    items: [
      { name: 'Beras 5kg', price: 65000 },
      { name: 'Minyak Goreng 2L', price: 35000 },
      { name: 'Telur 1kg', price: 25000 }
    ]
  });

  const handleSave = () => {
    toast.success('Transaksi berhasil disimpan!');
    navigate('/scan-success');
  };

  const handleEdit = () => {
    navigate('/edit-scan-result', { state: { result } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] pb-24">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] px-6 pt-8 pb-24 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/scan-receipt')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Hasil Scan</h1>
          <button
            onClick={handleEdit}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Edit2 className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="text-center text-white">
          <CheckCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">Scan berhasil!</p>
        </div>
      </div>

      <div className="px-6 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-[#0A0A0A] mb-4">Detail Transaksi</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Merchant</p>
              <p className="font-semibold text-[#0A0A0A]">{result.merchant}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Tanggal</p>
              <p className="font-semibold text-[#0A0A0A]">
                {new Date(result.date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Item</p>
              <div className="space-y-2">
                {result.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm">{item.name}</span>
                    <span className="font-semibold">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-[#7C3AED]">
                  Rp {result.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Simpan Transaksi
        </button>
      </div>
    </div>
  );
}
