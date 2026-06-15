import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Search, HelpCircle, MessageCircle, Mail, Phone, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const helpTopics = [
    {
      id: 'getting-started',
      icon: '🚀',
      title: 'Memulai',
      description: 'Panduan dasar menggunakan aplikasi',
      articles: 5
    },
    {
      id: 'transactions',
      icon: '💳',
      title: 'Transaksi',
      description: 'Cara menambah dan mengelola transaksi',
      articles: 8
    },
    {
      id: 'budget',
      icon: '📊',
      title: 'Budget & Tabungan',
      description: 'Mengatur budget dan target tabungan',
      articles: 6
    },
    {
      id: 'security',
      icon: '🔒',
      title: 'Keamanan',
      description: 'Pengaturan keamanan akun',
      articles: 4
    },
    {
      id: 'reports',
      icon: '📈',
      title: 'Laporan',
      description: 'Memahami laporan keuangan',
      articles: 3
    }
  ];

  const contactOptions = [
    {
      id: 'faq',
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Pertanyaan yang sering diajukan',
      action: () => navigate('/faq')
    },
    {
      id: 'chat',
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat dengan customer service',
      action: () => navigate('/live-chat')
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email Support',
      description: 'support@wealthtrack.com',
      action: () => window.location.href = 'mailto:support@wealthtrack.com'
    },
    {
      id: 'phone',
      icon: Phone,
      title: 'Telepon',
      description: '+62 21 1234 5678',
      action: () => window.location.href = 'tel:+622112345678'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6 pb-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Pusat Bantuan</h1>
          <div className="w-10" />
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bantuan..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40 outline-none transition-all"
          />
        </div>
      </div>

      <div className="px-6 -mt-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="font-semibold text-[#0A0A0A] mb-3">Topik Bantuan</h2>
          {helpTopics.map((topic, index) => (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/help-topic/${topic.id}`)}
              className="w-full bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center text-3xl">
                {topic.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-[#0A0A0A] mb-1">{topic.title}</h3>
                <p className="text-sm text-gray-500">{topic.description}</p>
                <p className="text-xs text-[#7C3AED] mt-1">{topic.articles} artikel</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-6"
        >
          <h2 className="font-semibold text-[#0A0A0A] mb-4">Hubungi Kami</h2>
          <div className="space-y-3">
            {contactOptions.map((option, index) => (
              <div key={option.id}>
                {index > 0 && <div className="border-t border-gray-100 my-3" />}
                <button
                  onClick={option.action}
                  className="w-full flex items-center gap-4 text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                    <option.icon className="w-6 h-6 text-[#7C3AED]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0A0A0A] mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
