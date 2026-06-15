import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { QrCode, X, Plus, Minus, DollarSign } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

export function QRScanner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [qrData, setQrData] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: 'shopping',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
  }, [accessToken, navigate]);

  const startScanning = () => {
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning) return;

    const initScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            setQrData(decodedText);
            setShowForm(true);
            stopScanning();
            toast.success('QR Code scanned successfully!');
          },
          (error) => {
            // Silent errors
          }
        );
      } catch (error) {
        console.error('Error starting scanner:', error);
        toast.error('Failed to start camera');
        setScanning(false);
      }
    };

    initScanner();
  }, [scanning]);

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-53620e8e/transactions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            ...formData,
            amount: parseFloat(formData.amount),
            qr_data: qrData
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error('Failed to add transaction: ' + data.error);
        return;
      }

      toast.success('Transaction added successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] to-[#F1F5F9] p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setShowForm(false);
                setQrData('');
              }}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#0A0A0A]">Add Transaction</h1>
            <div className="w-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6"
          >
            <div className="bg-gradient-to-br from-[#7C3AED]/10 to-[#5B21B6]/10 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Scanned QR Data</p>
              <p className="font-mono text-sm text-[#0A0A0A] break-all">{qrData}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.type === 'income'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Plus className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <span className="font-medium">Income</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.type === 'expense'
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Minus className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <span className="font-medium">Expense</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                >
                  <option value="shopping">Shopping</option>
                  <option value="food">Food & Dining</option>
                  <option value="transport">Transportation</option>
                  <option value="housing">Housing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 outline-none transition-all"
                  placeholder="What was this for?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Transaction'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold text-white">QR Scanner</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!scanning ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-3xl flex items-center justify-center shadow-2xl">
              <QrCode className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Scan QR Code
            </h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Point your camera at a QR code to quickly add a transaction
            </p>
            <button
              onClick={startScanning}
              className="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Start Scanning
            </button>
          </motion.div>
        ) : (
          <div className="w-full max-w-md">
            <div
              id="qr-reader"
              ref={videoRef}
              className="rounded-3xl overflow-hidden shadow-2xl"
            />
            <button
              onClick={stopScanning}
              className="w-full mt-6 bg-red-500 text-white py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
