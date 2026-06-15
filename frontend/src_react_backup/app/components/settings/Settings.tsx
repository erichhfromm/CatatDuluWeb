import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  User,
  Shield,
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { LogoutConfirmation } from '../auth/LogoutConfirmation';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner';

export function Settings() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const settingsMenu = [
    {
      title: 'Akun',
      items: [
        { icon: User, label: 'Edit Profil', path: '/edit-profile' },
        { icon: Shield, label: 'Keamanan', path: '/security-settings' }
      ]
    },
    {
      title: 'Preferensi',
      items: [
        { icon: Bell, label: 'Notifikasi', path: '/notification-settings' }
      ]
    },
    {
      title: 'Bantuan',
      items: [
        { icon: HelpCircle, label: 'Bantuan & FAQ', path: '/help-faq' },
        { icon: Info, label: 'Tentang Aplikasi', path: '/about' }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('accessToken');
      toast.success('Berhasil keluar');
      navigate('/login');
    } catch (error) {
      toast.error('Gagal keluar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6]">
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-6 py-8 rounded-b-3xl mb-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {settingsMenu.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <h2 className="font-semibold text-gray-700">{section.title}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIdx}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-[#0A0A0A]">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-white rounded-2xl shadow-md px-5 py-4 flex items-center gap-3 hover:bg-red-50 transition-colors border-2 border-red-500"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="font-semibold text-red-500">Keluar</span>
        </button>
      </div>

      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutConfirmation
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
