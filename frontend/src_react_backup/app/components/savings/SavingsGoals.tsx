import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Plus, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { projectId } from '/utils/supabase/info';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export function SavingsGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchGoals();
  }, [accessToken]);

  const fetchGoals = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/savings-goals`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setGoals(data.goals || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9]">
      <div className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Target Tabungan</h1>
          <button
            onClick={() => navigate('/create-savings-goal')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
          <p className="text-white/80 text-sm mb-2">Total Tabungan</p>
          <h2 className="text-4xl font-bold text-white">
            Rp {goals.reduce((sum, g) => sum + (g.current || 0), 0).toLocaleString('id-ID')}
          </h2>
        </div>
      </div>

      <div className="px-6 -mt-6">
        {goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Belum Ada Target"
            description="Mulai buat target tabungan untuk mencapai tujuan finansial Anda"
            actionLabel="Buat Target Baru"
            onAction={() => navigate('/create-savings-goal')}
          />
        ) : (
          <div className="space-y-4">
            {goals.map((goal: any, index: number) => {
              const percentage = (goal.current / goal.target) * 100;
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/savings-goal-detail?id=${goal.id}`)}
                  className="bg-white rounded-3xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 flex items-center justify-center text-2xl">
                        {goal.icon || '🎯'}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0A0A0A]">{goal.name}</h3>
                        <p className="text-sm text-gray-500">{goal.category}</p>
                      </div>
                    </div>
                    <TrendingUp className={`w-5 h-5 ${percentage >= 100 ? 'text-green-500' : 'text-[#7C3AED]'}`} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-[#7C3AED]">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] rounded-full transition-all"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Rp {goal.current.toLocaleString('id-ID')}
                      </span>
                      <span className="text-sm font-semibold text-[#0A0A0A]">
                        Rp {goal.target.toLocaleString('id-ID')}
                      </span>
                    </div>
                    {goal.deadline && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        Target: {new Date(goal.deadline).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
