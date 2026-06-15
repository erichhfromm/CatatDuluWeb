import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Fingerprint, Smartphone, Key, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function SecuritySettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    biometric: true,
    twoFactor: false,
    autoLock: true,
    pinEnabled: true
  });

  const securityOptions = [
    {
      id: 'change-password',
      icon: Lock,
      title: 'Ubah Password',
      description: 'Update password akun Anda',
      action: () => navigate('/change-password')
    },
    {
      id: 'change-pin',
      icon: Key,
      title: 'Ubah PIN',
      description: 'Update PIN keamanan',
      action: () => navigate('/change-pin')
    },
    {
      id: 'biometric',
      icon: Fingerprint,
      title: 'Autentikasi Biometrik',
      description: 'Gunakan sidik jari atau face ID',
      toggle: true,
      value: settings.biometric,
      onChange: (value: boolean) => setSettings({ ...settings, biometric: value })
    },
    {
      id: 'two-factor',
      icon: Smartphone,
      title: 'Autentikasi 2 Faktor',
      description: 'Keamanan tambahan dengan OTP',
      toggle: true,
      value: settings.twoFactor,
      onChange: (value: boolean) => setSettings({ ...settings, twoFactor: value })
    }
  ];

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
          <h1 className="text-xl font-bold text-white">Keamanan</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 space-y-4"
        >
          {securityOptions.map((option, index) => (
            <div key={option.id}>
              {index > 0 && <div className="border-t border-gray-100 my-4" />}
              <button
                onClick={() => !option.toggle && option.action?.()}
                className="w-full flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                  <option.icon className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0A0A0A] mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
                {option.toggle ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={option.value}
                      onChange={(e) => option.onChange?.(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7C3AED]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7C3AED]"></div>
                  </label>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6 mt-4"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-3">Sesi Aktif</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-[#0A0A0A]">Perangkat Ini</p>
                <p className="text-sm text-gray-500">Chrome • Jakarta</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                Aktif
              </span>
            </div>
          </div>
          <button className="w-full mt-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors">
            Logout Semua Perangkat
          </button>
        </motion.div>
      </div>
    </div>
  );
}
