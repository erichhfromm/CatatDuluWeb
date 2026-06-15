import { motion } from 'motion/react';

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ text, fullScreen = false }: LoadingSpinnerProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-[#7C3AED]/20 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
