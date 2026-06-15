import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Shield, Users, Award } from 'lucide-react';

export function AboutApp() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Star,
      title: 'User-Friendly',
      description: 'Antarmuka yang mudah digunakan untuk semua kalangan'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Data Anda dilindungi dengan enkripsi tingkat bank'
    },
    {
      icon: Users,
      title: 'Dukungan 24/7',
      description: 'Tim support siap membantu kapan saja'
    },
    {
      icon: Award,
      title: 'Fitur Lengkap',
      description: 'Kelola keuangan dengan tools yang komprehensif'
    }
  ];

  const teamMembers = [
    { name: 'John Doe', role: 'CEO & Founder' },
    { name: 'Jane Smith', role: 'CTO' },
    { name: 'Mike Johnson', role: 'Lead Developer' },
    { name: 'Sarah Williams', role: 'UX Designer' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Tentang Aplikasi</h1>
          <div className="w-10" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-5xl">💰</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">WealthTrack</h2>
          <p className="text-white/80 mb-2">Versi 1.0.0</p>
          <p className="text-white/60 text-sm">© 2026 WealthTrack. All rights reserved.</p>
        </motion.div>
      </div>

      <div className="px-6 -mt-12 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-[#0A0A0A] mb-3">Tentang Kami</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            WealthTrack adalah aplikasi manajemen keuangan pribadi yang dirancang untuk membantu Anda mengelola uang dengan lebih baik. Dengan fitur-fitur canggih namun mudah digunakan, kami berkomitmen untuk membuat perencanaan keuangan menjadi lebih sederhana dan efektif.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Misi kami adalah memberdayakan setiap individu untuk mencapai kebebasan finansial melalui pengelolaan uang yang cerdas dan terencana.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-[#0A0A0A] mb-4">Fitur Unggulan</h3>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-[#7C3AED]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0A0A0A] mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-[#0A0A0A] mb-4">Tim Kami</h3>
          <div className="grid grid-cols-2 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center p-4 bg-purple-50 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h4 className="font-semibold text-[#0A0A0A] text-sm mb-1">{member.name}</h4>
                <p className="text-xs text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h3 className="font-bold text-[#0A0A0A] mb-4">Informasi Legal</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/terms-of-service')}
              className="w-full text-left py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-[#0A0A0A]">Syarat & Ketentuan</span>
            </button>
            <button
              onClick={() => navigate('/privacy-policy')}
              className="w-full text-left py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-[#0A0A0A]">Kebijakan Privasi</span>
            </button>
            <button
              onClick={() => navigate('/licenses')}
              className="w-full text-left py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-[#0A0A0A]">Lisensi</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
