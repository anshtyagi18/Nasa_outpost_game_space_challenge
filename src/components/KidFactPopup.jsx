import { motion, AnimatePresence } from 'framer-motion';

export default function KidFactPopup({ isOpen, fact, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-sm px-4"
            initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: 5 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <div className="bg-slate-900 border-2 border-yellow-400 rounded-2xl p-5 shadow-2xl shadow-yellow-400/20">
              {/* Star burst top */}
              <div className="text-center mb-3">
                <motion.div
                  className="inline-block text-4xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🌟
                </motion.div>
                <h3 className="text-yellow-300 font-orbitron font-black text-sm mt-1 tracking-wider">
                  KID SCIENCE FACT!
                </h3>
              </div>
              
              {/* Fact text */}
              <p className="text-white text-sm text-center leading-relaxed font-nunito">
                {fact}
              </p>
              
              {/* Continue button */}
              <motion.button
                className="mt-4 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-2.5 rounded-xl text-sm font-nunito transition-colors"
                onClick={onClose}
                whileTap={{ scale: 0.95 }}
              >
                Cool! Keep Going! 🚀
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
