import { motion } from 'framer-motion'

/**
 * AnimatedLeo — Expressive Vector Cartoon Astronaut
 * 'Commander Leo' with dynamic animated facial expressions and reactions:
 *   - 'happy', 'scared', 'thinking', 'freezing', 'dusty', 'shocked', 'celebrating', 'confused'
 */
export default function AnimatedLeo({ mood = 'happy', className = '' }) {
  // Shiver animation for freezing
  const isShivering = mood === 'freezing'
  // Jump animation for celebrating
  const isJumping = mood === 'celebrating'

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Cartoon Thought / Emotion Bubble or Floating Props */}
      <div className="h-10 flex items-center justify-center mb-1">
        {mood === 'scared' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="px-3 py-1 rounded-full bg-alert-red/90 text-white font-mono text-xs font-bold shadow-lg flex items-center gap-1"
          >
            <span>😱</span>
            <span>MAYDAY!</span>
          </motion.div>
        )}
        {mood === 'thinking' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.1, 1], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="px-3 py-1 rounded-full bg-sol-gold/90 text-space-black font-mono text-xs font-bold shadow-lg flex items-center gap-1"
          >
            <span>🤔</span>
            <span>HMM... WHAT SHOULD I USE?</span>
          </motion.div>
        )}
        {mood === 'freezing' && (
          <motion.div
            animate={{ x: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 0.1 }}
            className="px-3 py-1 rounded-full bg-sky-400/90 text-space-black font-mono text-xs font-bold shadow-lg flex items-center gap-1"
          >
            <span>🥶</span>
            <span>B-B-BRRR! IT'S -120°C!</span>
          </motion.div>
        )}
        {mood === 'dusty' && (
          <motion.div
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="px-3 py-1 rounded-full bg-amber-700/90 text-white font-mono text-xs font-bold shadow-lg flex items-center gap-1"
          >
            <span>💨</span>
            <span>*COUGH COUGH* TOO MUCH DUST!</span>
          </motion.div>
        )}
        {mood === 'shocked' && (
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 0.2 }}
            className="px-3 py-1 rounded-full bg-yellow-400 text-space-black font-mono text-xs font-bold shadow-lg flex items-center gap-1"
          >
            <span>⚡</span>
            <span>BZZZZT! OVERLOAD!</span>
          </motion.div>
        )}
        {mood === 'celebrating' && (
          <motion.div
            animate={{ y: [0, -6, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="px-3.5 py-1 rounded-full bg-life-green text-space-black font-mono text-xs font-extrabold shadow-lg flex items-center gap-1"
          >
            <span>🎉</span>
            <span>YAY! IT WORKED!</span>
          </motion.div>
        )}
      </div>

      {/* Main Animated Astronaut Body */}
      <motion.div
        animate={
          isShivering
            ? { x: [-3, 3, -3, 3, 0] }
            : isJumping
            ? { y: [0, -22, 0], rotate: [-2, 2, 0] }
            : { y: [0, -6, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: isShivering ? 0.08 : isJumping ? 0.5 : 2.4,
          ease: 'easeInOut',
        }}
        className="relative w-36 h-48 sm:w-44 sm:h-56 flex flex-col items-center"
      >
        {/* Oxygen Backpack Behind */}
        <div className="absolute top-10 w-28 h-32 rounded-2xl bg-slate-300 border-2 border-slate-400 shadow-md flex justify-between px-2 pt-2">
          <div className="w-4 h-24 rounded-full bg-cyan-400/80" />
          <div className="w-4 h-24 rounded-full bg-blue-500/80" />
        </div>

        {/* ── Big Astronaut Helmet ── */}
        <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-100 border-4 border-slate-300 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Glass Visor */}
          <div
            className={`w-22 h-22 sm:w-26 sm:h-26 rounded-full flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 ${
              mood === 'shocked'
                ? 'bg-yellow-300'
                : mood === 'freezing'
                ? 'bg-sky-200 border-2 border-sky-400'
                : mood === 'dusty'
                ? 'bg-amber-800/80'
                : 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border-2 border-cyan-400/60'
            }`}
          >
            {/* Visor Glare Shine */}
            <div className="absolute top-2 left-3 w-8 h-4 rounded-full bg-white/30 rotate-[-35deg]" />

            {/* ── Facial Expressions ── */}
            {/* Happy / Default */}
            {(mood === 'happy' || mood === 'celebrating') && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-5 rounded-full bg-cyan-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white ml-1 mb-1" />
                  </div>
                  <div className="w-4 h-5 rounded-full bg-cyan-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white ml-1 mb-1" />
                  </div>
                </div>
                {/* Big Grin */}
                <div className="w-8 h-4 rounded-b-full bg-white border-2 border-slate-900" />
              </div>
            )}

            {/* Scared */}
            {mood === 'scared' && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-6 rounded-full bg-white flex items-center justify-center animate-ping-short">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                  <div className="w-5 h-6 rounded-full bg-white flex items-center justify-center animate-ping-short">
                    <div className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>
                </div>
                {/* Wavy mouth */}
                <div className="w-7 h-3 rounded-full bg-slate-900 border border-white" />
              </div>
            )}

            {/* Thinking */}
            {mood === 'thinking' && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-cyan-300 flex items-start justify-end">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="w-4 h-3 rounded-full bg-cyan-300 flex items-start justify-end">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="w-5 h-1 bg-white rounded-full rotate-[-10deg]" />
              </div>
            )}

            {/* Freezing */}
            {mood === 'freezing' && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-4">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-900" />
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-900" />
                </div>
                {/* Chattering teeth */}
                <div className="w-6 h-3 rounded-md bg-white border border-blue-400 flex items-center justify-center gap-0.5">
                  <div className="w-1 h-2 bg-blue-300" />
                  <div className="w-1 h-2 bg-blue-300" />
                  <div className="w-1 h-2 bg-blue-300" />
                </div>
              </div>
            )}

            {/* Dusty */}
            {mood === 'dusty' && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-4 text-xs font-bold text-amber-200">
                  <span>🌀</span>
                  <span>🌀</span>
                </div>
                <div className="w-5 h-2 rounded-full bg-amber-950 border border-amber-300" />
              </div>
            )}

            {/* Shocked */}
            {mood === 'shocked' && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-900">
                  <span>⚡</span>
                  <span>⚡</span>
                </div>
                <div className="w-6 h-5 rounded-full bg-slate-900" />
              </div>
            )}

            {/* Confused / Choked */}
            {(mood === 'confused' || mood === 'choked') && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-4 text-xs">
                  <span>✖️</span>
                  <span>✖️</span>
                </div>
                <div className="w-6 h-2 rounded-full bg-slate-800" />
              </div>
            )}
          </div>
        </div>

        {/* ── Cute Astronaut Spacesuit Torso ── */}
        <div className="relative z-10 -mt-2 w-20 sm:w-24 h-18 sm:h-22 rounded-2xl bg-white border-2 border-slate-300 shadow-md flex flex-col items-center p-2">
          {/* NASA Meatball Logo Badge */}
          <div className="w-6 h-6 rounded-full bg-blue-600 border border-white flex items-center justify-center text-[7px] font-black text-white tracking-tighter">
            NASA
          </div>

          {/* Chest control panel buttons */}
          <div className="flex gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Little Astronaut Boots */}
        <div className="flex gap-4 -mt-1">
          <div className="w-7 h-5 rounded-b-xl bg-slate-200 border-2 border-slate-400" />
          <div className="w-7 h-5 rounded-b-xl bg-slate-200 border-2 border-slate-400" />
        </div>
      </motion.div>
    </div>
  )
}

