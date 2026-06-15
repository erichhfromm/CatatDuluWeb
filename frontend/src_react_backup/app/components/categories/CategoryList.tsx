import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  ShoppingBag,
  Coffee,
  Car,
  Home as HomeIcon,
  Heart,
  Zap,
  MoreVertical
} from 'lucide-react';

export function CategoryList() {
  const navigate = useNavigate();
  
  const categories = [
    { id: '1', name: 'Belanja', icon: ShoppingBag, color: 'from-blue-500 to-blue-600', count: 24 },
    { id: '2', name: 'Makanan', icon: Coffee, color: 'from-orange-500 to-orange-600', count: 18 },
    { id: '3', name: 'Transport', icon: Car, color: 'from-yellow-500 to-yellow-600', count: 12 },
    { id: '4', name: 'Rumah', icon: HomeIcon, color: 'from-green-500 to-green-600', count: 8 },
    { id: '5', name: 'Kesehatan', icon: Heart, color: 'from-red-500 to-red-600', count: 5 },
    { id: '6', name: 'Utilitas', icon: Zap, color: 'from-purple-500 to-purple-600', count: 3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F3F4F6]">
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-6 py-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Kategori</h1>
          </div>
          <button
            onClick={() => navigate('/add-category')}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-white/70">Kelola kategori pengeluaran Anda</p>
      </div>

      <div className="px-6 py-6 grid grid-cols-2 gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(`/category-detail/${category.id}`)}
              className="bg-white rounded-2xl shadow-md p-5 cursor-pointer relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit-category/${category.id}`);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-3`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="font-bold text-[#0A0A0A] mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} transaksi</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
