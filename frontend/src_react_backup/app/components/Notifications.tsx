import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Bell,
  ArrowLeft,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Check
} from 'lucide-react';
import { projectId } from '/utils/supabase/info';
import { toast } from 'sonner';
import { BottomNav } from './BottomNav';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchNotifications();
  }, [accessToken, navigate]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/notifications`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/notifications/${id}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (response.ok) {
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: { Icon: Info, color: 'bg-blue-500' },
      success: { Icon: CheckCircle, color: 'bg-green-500' },
      warning: { Icon: AlertTriangle, color: 'bg-yellow-500' },
      error: { Icon: XCircle, color: 'bg-red-500' }
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-6 py-8 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-3xl font-bold text-white">{notifications.length}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
            <p className="text-3xl font-bold text-[#7C3AED]">
              {notifications.filter((n) => !n.read).length}
            </p>
            <p className="text-sm text-gray-400">Unread</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const { Icon, color } = getNotificationIcon(notification.type);

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-all ${
                  !notification.read ? 'border-l-4 border-[#7C3AED]' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-[#0A0A0A]">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#7C3AED] rounded-full mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>

                  {notification.read && (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Notifications
            </h3>
            <p className="text-gray-500">
              You're all caught up! Check back later.
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
