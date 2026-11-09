import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react'
import confetti from 'canvas-confetti'
import cartoonAudio from '../game/CartoonAudio.js'
import AnimatedLeo from './AnimatedLeo.jsx'

export default function ComicVictoryModal({ onRestart }) {
  useEffect(() => {
    cartoonAudio.playSuccess()

    // Multi-stage confetti celebration
    const duration = 2500
    const end = Date.now() + duration
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
        colors: ['#ec4899', '#38bdf8', '#fbbf24'],
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }, [])

  const NASA_SECRETS = [
    '🌪️ Mars dust has static cling — heavy sand bouncing wipes it clean!',
    '🪨 Moon dirt (regolith) blocks radiation naturally with 0% electricity!',
    '🌱 Red and blue LEDs tell space plants which way is UP in microgravity!',
    '🧥 Shiny gold thermal blankets trap 95% of heat in -120°C Martian night!',
    '📡 Infrared lasers beam deep-space messages at light-speed!',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md animate-in zoom-in-95 select-none">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-space-deep border-4 border-sol-gold shadow-[0_0_60px_rgba(251,191,36,0.5)] text-starfield text-center space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Animated Leo Celebrating */}
        <div className="flex justify-center -mb-2">
          <AnimatedLeo mood="celebrating" />
        </div>

        <div className="inline-flex p-3 rounded-2xl bg-sol-gold/20 text-sol-gold">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-black text-sol-gold tracking-widest text-glow">
          COMMANDER LEO SAVED!
        </h2>
        <p className="font-mono text-xs sm:text-sm text-starfield/90 max-w-md mx-auto leading-relaxed">
          You conquered all 5 Sol-1 Dilemmas using real NASA aerospace engineering! You earned the official <strong>NASA Junior Commander Badge</strong>!
        </p>

        {/* 5 NASA Secrets Mastered */}
        <div className="p-4 rounded-2xl bg-space-black/80 border border-white/10 text-left space-y-2">
          <h3 className="font-display text-xs text-shield-cyan uppercase tracking-wider font-bold mb-2">
            🧠 Real NASA Engineering Lessons Mastered:
          </h3>
          {NASA_SECRETS.map((secret, i) => (
            <div key={i} className="flex items-start gap-2 text-xs font-mono text-starfield/90">
              <CheckCircle2 className="w-4 h-4 text-life-green shrink-0 mt-0.5" />
              <span>{secret}</span>
            </div>
          ))}
        </div>

        {/* Play Again */}
        <div className="pt-2 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              cartoonAudio.playClick()
              onRestart()
            }}
            className="px-8 py-3.5 rounded-2xl font-display text-xs sm:text-sm tracking-widest uppercase
                       bg-gradient-to-r from-sol-gold via-amber-400 to-yellow-500 text-space-black font-black
                       shadow-[0_0_30px_rgba(251,191,36,0.6)] cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            🎮 Play Again & Test a Friend!
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

