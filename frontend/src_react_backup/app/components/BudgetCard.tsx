import { motion } from 'motion/react';
import { Target, TrendingUp } from 'lucide-react';

interface BudgetCardProps {
  spent: number;
  budget: number;
}

export function BudgetCard({ spent, budget }: BudgetCardProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#0A0A0A]">Monthly Budget</h3>
        <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-2xl font-bold text-[#0A0A0A]">
              ${spent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">of ${budget.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {isOverBudget ? '+' : ''}${Math.abs(remaining).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {isOverBudget ? 'Over budget' : 'Remaining'}
            </p>
          </div>
        </div>

        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
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
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${isOverBudget ? 'text-red-500' : 'text-green-500'}`} />
          <span className="text-sm text-gray-600">
            {percentage.toFixed(0)}% used
          </span>
        </div>
        {!isOverBudget && percentage > 80 && (
          <span className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full font-medium">
            Nearing limit
          </span>
        )}
        {isOverBudget && (
          <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full font-medium">
            Budget exceeded
          </span>
        )}
      </div>
    </div>
  );
}
