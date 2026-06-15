import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-[#7C3AED]" />
      </div>
      <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
