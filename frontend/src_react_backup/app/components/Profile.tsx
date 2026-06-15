import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Edit2,
  Camera,
  Save,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Info,
  ChevronRight
} from 'lucide-react';
import { projectId } from '/utils/supabase/info';
import { supabase } from '../../utils/supabase/client';
import { toast } from 'sonner';
import { BottomNav } from './BottomNav';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
  balance: number;
}

export function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [accessToken, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/auth/profile`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      const data = await response.json();
      setProfile(data.profile);
      setFormData({
        name: data.profile.name || '',
        phone: data.profile.phone || '',
        address: data.profile.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/auth/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error('Failed to update profile: ' + data.error);
        return;
      }

      setProfile(data.profile);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('accessToken');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
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
      <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] px-6 pt-8 pb-32 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED] opacity-10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Profile</h1>
            <button
              onClick={() => setEditing(!editing)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <Edit2 className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4 text-[#0A0A0A]" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {profile?.name}
            </h2>
            <p className="text-gray-400">{profile?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-4">
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-[#0A0A0A]">{profile?.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-[#0A0A0A]">{profile?.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                  placeholder="+1 234 567 8900"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-[#0A0A0A]">
                    {profile?.phone || 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Address</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                  placeholder="123 Main St, City, Country"
                />
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-[#0A0A0A]">
                    {profile?.address || 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Member Since</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-[#0A0A0A]">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Pengaturan</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/edit-profile')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="flex-1 text-left font-medium text-[#0A0A0A]">
                Edit Profil
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/security-settings')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="flex-1 text-left font-medium text-[#0A0A0A]">
                Keamanan
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/notification-settings')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="flex-1 text-left font-medium text-[#0A0A0A]">
                Notifikasi
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-6"
        >
          <h3 className="font-semibold text-[#0A0A0A] mb-4">Bantuan & Info</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/help-center')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="flex-1 text-left font-medium text-[#0A0A0A]">
                Pusat Bantuan
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => navigate('/about-app')}
              className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <span className="flex-1 text-left font-medium text-[#0A0A0A]">
                Tentang Aplikasi
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-white border-2 border-red-500 text-red-500 py-4 rounded-2xl font-semibold shadow-md hover:bg-red-50 transition-all flex items-center justify-center gap-2 mb-6"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
