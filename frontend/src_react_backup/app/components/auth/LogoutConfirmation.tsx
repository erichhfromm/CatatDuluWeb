import { motion } from 'motion/react';
import { LogOut, X } from 'lucide-react';

interface LogoutConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutConfirmation({ onConfirm, onCancel }: LogoutConfirmationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">
            Keluar dari Akun?
          </h2>
          <p className="text-gray-600">
            Anda yakin ingin keluar dari akun ini?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Ya, Keluar
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
