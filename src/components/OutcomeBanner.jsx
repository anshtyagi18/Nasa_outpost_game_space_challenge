import { motion } from 'framer-motion'
import { RotateCcw, ArrowRight, BookOpen, Sparkles, AlertCircle } from 'lucide-react'
import cartoonAudio from '../game/CartoonAudio.js'

/**
 * OutcomeBanner — Dramatic Comic Outcome + Real NASA Trade-off Lesson
 * Displays fail or success results with 1-click 'Try Again' or 'Next Stage'.
 */
export default function OutcomeBanner({
  outcome,
  onTryAgain,
  onNextStage,
  isLastStage = false,
}) {
  if (!outcome) return null

  const { isCorrect, outcomeTitle, outcomeText, nasaFact } = outcome

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className={`w-full max-w-3xl mx-auto p-5 sm:p-6 rounded-3xl border-4 backdrop-blur-xl shadow-2xl select-none text-center space-y-3 ${
        isCorrect
          ? 'bg-space-deep/95 border-life-green shadow-[0_0_50px_rgba(34,197,94,0.35)]'
          : 'bg-space-deep/95 border-alert-red shadow-[0_0_50px_rgba(239,68,68,0.35)]'
      }`}
    >
      {/* Title */}
      <div className="flex items-center justify-center gap-2">
        {isCorrect ? (
          <Sparkles className="w-6 h-6 text-sol-gold animate-bounce" />
        ) : (
          <AlertCircle className="w-6 h-6 text-alert-red animate-pulse" />
        )}
        <h3
          className={`font-display text-lg sm:text-2xl font-black tracking-wide ${
            isCorrect ? 'text-life-green text-glow' : 'text-alert-red'
          }`}
        >
          {outcomeTitle}
        </h3>
      </div>

      {/* Outcome Story Detail */}
      <p className="font-mono text-xs sm:text-sm text-starfield/90 max-w-xl mx-auto leading-relaxed">
        {outcomeText}
      </p>

      {/* Real NASA Trade-off Lesson */}
      <div className="p-3 sm:p-4 rounded-2xl bg-space-black/60 border border-white/10 max-w-xl mx-auto flex items-start gap-2.5 text-left">
        <BookOpen className="w-5 h-5 text-sol-gold shrink-0 mt-0.5" />
        <p className="font-mono text-xs text-sol-gold/90 leading-relaxed font-semibold">
          {nasaFact}
        </p>
      </div>

      {/* Action Button: Try Again OR Next Stage */}
      <div className="pt-2 flex justify-center">
        {!isCorrect ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              cartoonAudio.playClick()
              onTryAgain()
            }}
            className="px-8 py-3.5 rounded-2xl font-display text-xs sm:text-sm tracking-widest uppercase
                       bg-gradient-to-r from-sol-gold to-amber-500 text-space-black font-extrabold
                       shadow-[0_0_25px_rgba(251,191,36,0.5)] cursor-pointer flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            🔄 Try the other option!
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              cartoonAudio.playClick()
              onNextStage()
            }}
            className="px-8 py-3.5 rounded-2xl font-display text-xs sm:text-sm tracking-widest uppercase
                       bg-gradient-to-r from-life-green via-emerald-400 to-cyan-400 text-space-black font-extrabold
                       shadow-[0_0_30px_rgba(34,197,94,0.5)] cursor-pointer flex items-center gap-2"
          >
            <span>{isLastStage ? '🏆 Claim Commander Badge!' : '🚀 Next Mission Stage!'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
