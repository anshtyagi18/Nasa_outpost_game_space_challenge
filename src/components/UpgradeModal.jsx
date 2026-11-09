import { motion } from 'framer-motion'
import { Sparkles, BookOpen } from 'lucide-react'
import sound from '../game/SoundFX.js'

/**
 * UpgradeModal — Big Glowing Arcade Choice Cards
 * Presented during Level-Up or Sol Milestones.
 * Enforces authentic NASA engineering trade-offs with zero boring text walls.
 */
export default function UpgradeModal({ choices = [], onSelect }) {
  if (!choices || choices.length === 0) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-5xl text-center space-y-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-1"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sol-gold/20 border border-sol-gold/50 text-sol-gold font-mono text-xs uppercase tracking-widest font-bold animate-pulse">
            <Sparkles className="w-4 h-4" />
            LEVEL UP! SELECT MISSION TECH UPGRADE
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-starfield tracking-wider text-glow">
            NASA ENGINEERING TRADE-OFF
          </h2>
          <p className="font-mono text-xs sm:text-sm text-starfield/70 max-w-xl mx-auto">
            Every upgrade boosts your rover or base, but demands a strategic engineering compromise!
          </p>
        </motion.div>

        {/* 2–3 Big Glowing Arcade Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {choices.map((card, idx) => (
            <motion.button
              key={card.id || idx}
              whileHover={{ scale: 1.04, y: -6 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sound.playPickup('power')
                onSelect(card)
              }}
              className={`p-6 rounded-3xl bg-space-deep/95 border-2 ${card.border} shadow-[0_0_35px_${card.glow}]
                         flex flex-col justify-between text-left transition-all duration-200 cursor-pointer group relative overflow-hidden`}
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-white/10"
                    style={{ color: card.color }}
                  >
                    {card.badge}
                  </span>
                  <span className="text-3xl">{card.icon}</span>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-starfield group-hover:text-glow mb-3">
                  {card.title}
                </h3>

                {/* Big Buff Pill */}
                <div className="p-2.5 rounded-xl bg-life-green/20 border border-life-green/50 text-life-green font-mono text-xs font-bold mb-2 flex items-center gap-2">
                  <span>✅</span>
                  <span>{card.buffText}</span>
                </div>

                {/* Big Debuff Trade-off Pill */}
                <div className="p-2.5 rounded-xl bg-alert-red/20 border border-alert-red/50 text-alert-red font-mono text-xs font-bold mb-4 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{card.debuffText}</span>
                </div>
              </div>

              {/* Kid-Friendly NASA Science Fact */}
              <div className="pt-3 border-t border-white/10 flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-shield-cyan shrink-0 mt-0.5" />
                <p className="font-mono text-[11px] text-starfield/70 leading-relaxed italic">
                  {card.fact}
                </p>
              </div>

              {/* Bottom CTA hint */}
              <div className="mt-3 text-center">
                <span
                  className="font-display text-xs tracking-widest font-bold uppercase underline"
                  style={{ color: card.color }}
                >
                  TAP TO INSTALL &gt;&gt;
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
