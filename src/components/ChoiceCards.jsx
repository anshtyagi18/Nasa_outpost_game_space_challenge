import { motion } from 'framer-motion'
import cartoonAudio from '../game/CartoonAudio.js'

/**
 * ChoiceCards — Exactly 2 Big Glowing Arcade Choice Cards
 * Directly inspired by 'Save the Girl' mechanics for kids aged 7–12.
 */
export default function ChoiceCards({ choiceA, choiceB, onSelect, disabled }) {
  if (!choiceA || !choiceB) return null

  const cards = [choiceA, choiceB]

  return (
    <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 select-none">
      {cards.map((choice, idx) => {
        const isFirst = idx === 0
        const cardBorder = isFirst
          ? 'border-cyan-400 hover:border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
          : 'border-amber-400 hover:border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.3)]'

        return (
          <motion.button
            key={choice.id}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.05, y: -6 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            onMouseEnter={() => {
              if (!disabled) cartoonAudio.playPop()
            }}
            onClick={() => {
              if (!disabled) {
                cartoonAudio.playClick()
                onSelect(choice)
              }
            }}
            className={`p-5 sm:p-6 rounded-3xl bg-space-deep/95 border-4 ${cardBorder}
                       flex flex-col items-center text-center transition-all duration-200
                       ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95 group'}`}
          >
            {/* Big 3D / Animated Emoji Icon */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: idx * 0.3 }}
              className="text-5xl sm:text-6xl mb-3 filter drop-shadow-lg"
            >
              {choice.icon}
            </motion.div>

            {/* Title */}
            <h3 className="font-display text-lg sm:text-xl font-black text-starfield group-hover:text-glow tracking-wider mb-1">
              {choice.title}
            </h3>

            {/* Subtitle / Action explanation */}
            <p className="font-mono text-xs text-starfield/70 leading-relaxed max-w-xs">
              {choice.subtitle}
            </p>

            {/* Bottom action hint */}
            <div className="mt-3 px-4 py-1 rounded-full bg-white/10 font-mono text-[10px] uppercase tracking-widest font-bold text-starfield/60 group-hover:text-starfield">
              TAP TO USE THIS! 👉
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
