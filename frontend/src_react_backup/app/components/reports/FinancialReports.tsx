import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Download, FileText, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function FinancialReports() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', income: 5000000, expense: 3500000 },
    { month: 'Feb', income: 5200000, expense: 3800000 },
    { month: 'Mar', income: 5100000, expense: 3600000 },
    { month: 'Apr', income: 5300000, expense: 3900000 },
    { month: 'Mei', income: 5500000, expense: 4100000 },
    { month: 'Jun', income: 5400000, expense: 3700000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] pb-6">
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-6 py-8 rounded-b-3xl mb-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Laporan Keuangan</h1>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {period === 'daily' ? 'Harian' : period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0A0A0A]">Trend Keuangan</h2>
            <button className="text-[#7C3AED] text-sm font-medium">
              Detail
            </button>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="income" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#EC4899" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/export-pdf')}
            className="bg-white rounded-2xl shadow-md p-5 text-left"
          >
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-[#0A0A0A] mb-1">Export PDF</h3>
            <p className="text-xs text-gray-500">Download laporan PDF</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/export-excel')}
            className="bg-white rounded-2xl shadow-md p-5 text-left"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-[#0A0A0A] mb-1">Export Excel</h3>
            <p className="text-xs text-gray-500">Download laporan Excel</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
