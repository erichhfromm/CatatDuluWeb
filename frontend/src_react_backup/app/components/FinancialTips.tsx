import { motion } from 'motion/react';
import { Lightbulb, TrendingUp, PiggyBank, Shield } from 'lucide-react';

const tips = [
  {
    icon: PiggyBank,
    title: 'Save 20% Monthly',
    description: 'Try to save at least 20% of your income each month',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: TrendingUp,
    title: 'Track Every Expense',
    description: 'Small purchases add up. Keep track of everything',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Shield,
    title: 'Emergency Fund',
    description: 'Build 3-6 months of expenses for emergencies',
    color: 'from-purple-500 to-purple-600'
  }
];

export function FinancialTips() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-xl flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#0A0A0A]">Financial Tips</h2>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${tip.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-[#0A0A0A] mb-1">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
