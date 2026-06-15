import { useNavigate, useLocation } from 'react-router';
import { Home, QrCode, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: QrCode, label: 'Scan', path: '/qr-scanner' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl rounded-t-3xl z-50">
      <div className="flex items-center justify-around px-6 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 min-w-[60px]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] scale-110'
                    : 'bg-gray-100'
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-[#7C3AED]' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
