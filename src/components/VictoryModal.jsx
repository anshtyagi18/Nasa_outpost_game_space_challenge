import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import sound from '../game/SoundFX.js'

export default function VictoryModal({ score, sol, onRestart }) {
  useEffect(() => {
    sound.playLevelUp()

    // Grand victory confetti storm
    const end = Date.now() + 3000
    ;(function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#fbbf24', '#06b6d4', '#22c55e', '#fc3d21'],
      })
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#38bdf8', '#a855f7', '#fbbf24'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md animate-in zoom-in-95 select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-space-deep border-2 border-sol-gold shadow-[0_0_60px_rgba(251,191,36,0.5)] text-starfield text-center space-y-4"
      >
        <div className="inline-flex p-4 rounded-3xl bg-sol-gold/20 text-sol-gold mb-1 animate-bounce">
          <Trophy className="w-14 h-14" />
        </div>

        <h2 className="font-display text-2xl sm:text-4xl font-black text-sol-gold tracking-widest text-glow">
          SOL 10 SURVIVED!
        </h2>
        <p className="font-mono text-xs sm:text-sm text-starfield/80 max-w-md mx-auto leading-relaxed">
          Master Commander Honors! You defended Outpost Sol-1 against solar flares, debris swarms, and oxygen freezes across 10 continuous Martian sols!
        </p>

        {/* Score & Rank */}
        <div className="p-4 rounded-2xl bg-space-black/80 border border-sol-gold/40 space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-starfield/60">
            NASA Flight Director Rank
          </span>
          <p className="font-display text-xl sm:text-2xl text-shield-cyan font-bold">
            🚀 LEGENDARY FLIGHT DIRECTOR
          </p>
          <p className="font-mono text-3xl font-extrabold text-sol-gold">
            {score} PTS
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sound.playClick()
              onRestart()
            }}
            className="px-8 py-3.5 rounded-2xl font-display text-xs sm:text-sm tracking-widest uppercase
                       bg-gradient-to-r from-sol-gold to-amber-500 text-space-black font-extrabold
                       shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Launch Next Expedition
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

