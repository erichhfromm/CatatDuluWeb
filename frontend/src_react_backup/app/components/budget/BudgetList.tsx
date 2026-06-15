import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Target, TrendingUp } from 'lucide-react';

export function BudgetList() {
  const navigate = useNavigate();

  const budgets = [
    { id: '1', category: 'Makanan', budget: 2000000, spent: 1500000, period: 'Bulanan' },
    { id: '2', category: 'Transport', budget: 1000000, spent: 850000, period: 'Bulanan' },
    { id: '3', category: 'Belanja', budget: 3000000, spent: 3200000, period: 'Bulanan' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6]">
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-6 py-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Budget</h1>
          </div>
          <button
            onClick={() => navigate('/create-budget')}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-white/70">Kelola anggaran bulanan Anda</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        {budgets.map((budget, index) => {
          const percentage = Math.min((budget.spent / budget.budget) * 100, 100);
          const isOverBudget = budget.spent > budget.budget;

          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(`/budget-detail/${budget.id}`)}
              className="bg-white rounded-2xl shadow-md p-5 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#0A0A0A] mb-1">{budget.category}</h3>
                  <p className="text-sm text-gray-500">{budget.period}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isOverBudget
                    ? 'bg-red-50 text-red-600'
                    : percentage > 80
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-green-50 text-green-600'
                }`}>
                  {percentage.toFixed(0)}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Terpakai</span>
                  <span className="font-semibold">Rp {budget.spent.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      isOverBudget
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : percentage > 80
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Total Budget</span>
                  <span>Rp {budget.budget.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
