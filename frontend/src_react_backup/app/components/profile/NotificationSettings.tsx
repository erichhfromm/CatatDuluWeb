import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, DollarSign, TrendingUp, Calendar, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function NotificationSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    transactionAlerts: true,
    budgetWarnings: true,
    monthlyReports: true,
    emailNotifications: false,
    pushNotifications: true,
    billReminders: true
  });

  const handleSave = () => {
    toast.success('Pengaturan notifikasi disimpan!');
  };

  const notificationTypes = [
    {
      id: 'transactionAlerts',
      icon: DollarSign,
      title: 'Notifikasi Transaksi',
      description: 'Pemberitahuan setiap transaksi masuk/keluar',
      value: settings.transactionAlerts
    },
    {
      id: 'budgetWarnings',
      icon: TrendingUp,
      title: 'Peringatan Budget',
      description: 'Alert saat mendekati limit budget',
      value: settings.budgetWarnings
    },
    {
      id: 'billReminders',
      icon: Calendar,
      title: 'Pengingat Tagihan',
      description: 'Reminder untuk tagihan yang akan jatuh tempo',
      value: settings.billReminders
    },
    {
      id: 'monthlyReports',
      icon: Calendar,
      title: 'Laporan Bulanan',
      description: 'Ringkasan keuangan setiap bulan',
      value: settings.monthlyReports
    }
  ];

  const channelSettings = [
    {
      id: 'pushNotifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Notifikasi di perangkat',
      value: settings.pushNotifications
    },
    {
      id: 'emailNotifications',
      icon: Mail,
      title: 'Email Notifications',
      description: 'Kirim notifikasi ke email',
      value: settings.emailNotifications
    }
  ];

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Notifikasi</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 -mt-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Tipe Notifikasi</h3>
          <div className="space-y-4">
            {notificationTypes.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <div className="border-t border-gray-100 my-4" />}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0A0A0A] mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={() => handleToggle(item.id as keyof typeof settings)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3AED]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Channel Notifikasi</h3>
          <div className="space-y-4">
            {channelSettings.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <div className="border-t border-gray-100 my-4" />}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#0A0A0A] mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={() => handleToggle(item.id as keyof typeof settings)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3AED]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
