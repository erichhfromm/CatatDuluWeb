import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Camera, Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function ScanReceipt() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setTimeout(() => {
          navigate('/scan-processing');
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    setScanning(true);
    setTimeout(() => {
      navigate('/scan-processing');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Scan Struk</h1>
          <button
            onClick={() => navigate('/scan-history')}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[3/4] bg-white/5 rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center relative overflow-hidden"
          >
            {scanning ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-full h-1 bg-[#7C3AED]"
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            ) : image ? (
              <img src={image} alt="Receipt" className="w-full h-full object-cover rounded-3xl" />
            ) : (
              <>
                <Camera className="w-16 h-16 text-white/40 mb-4" />
                <p className="text-white/60">Posisikan struk di area ini</p>
              </>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCapture}
              className="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Ambil Foto
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/10 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 border border-white/20"
            >
              <Upload className="w-5 h-5" />
              Upload
            </motion.button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h3 className="font-semibold mb-3">Tips Scan Struk:</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full mt-1.5" />
                Pastikan struk terlihat jelas dan tidak blur
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full mt-1.5" />
                Ambil foto di tempat dengan pencahayaan yang cukup
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full mt-1.5" />
                Posisikan struk sejajar dengan kamera
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
