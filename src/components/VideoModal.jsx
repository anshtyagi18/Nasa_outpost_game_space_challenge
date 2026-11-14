import { motion, AnimatePresence } from 'framer-motion';
import { X, Film } from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 print-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-4 sm:inset-10 md:inset-16 lg:inset-24 z-50 flex items-center justify-center pointer-events-none print-hide"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <div className="w-full max-w-4xl bg-slate-900 border-2 border-cyan-400 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-3.5 bg-slate-800/90 border-b border-cyan-500/30">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-orbitron font-black text-white text-sm tracking-wide">
                    ARES KIDS: SURVIVAL ON SOL-7 — DEMO WALKTHROUGH
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="relative bg-black flex-1 flex items-center justify-center p-2">
                <video
                  src="./ares-kids-demo.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[70vh] rounded-lg shadow-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-950 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <span>NASA Space Apps Challenge 2024 Showcase</span>
                <span className="text-cyan-400 font-orbitron">1080p HD Gameplay Recording</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
