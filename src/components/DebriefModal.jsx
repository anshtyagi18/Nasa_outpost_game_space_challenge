import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw, BookOpen, Trophy } from 'lucide-react'
import sound from '../game/SoundFX.js'

export default function DebriefModal({ data, onRestart }) {
  if (!data) return null

  const {
    reason = 'rover_destroyed',
    title = 'Mission Compromised!',
    detail = 'Your rover took fatal damage from deep-space hazard swarms.',
    score = 0,
    sol = 1,
    level = 1,
  } = data

  const getLesson = () => {
    if (reason === 'base_power') {
      return {
        lesson: 'NASA Mars Opportunity rover operated for 15 years until a global dust storm blocked all sunlight from its solar panels, draining its batteries permanently.',
        tip: 'Collect ⚡ Power Cells and return to the Outpost Sol-1 center circle frequently to deposit reserves!',
      }
    }
    if (reason === 'base_oxygen') {
      return {
        lesson: 'On the ISS, the Oxygen Generation System (OGS) splits recycled water into oxygen. When water recycling fails, emergency chemical oxygen candles must be ignited.',
        tip: 'Prioritize collecting 💨 Oxygen Canisters and avoid staying away from the base for too long!',
      }
    }
    if (reason === 'base_shield') {
      return {
        lesson: 'Deep-space cosmic rays and solar flares bombard Martian ground without Earth\'s magnetic umbrella. Regolith soil bunkers are NASA\'s primary passive defense plan.',
        tip: 'Bury the outpost in regolith and grab 🛡️ Shield Cores to absorb cosmic proton impacts!',
      }
    }
    return {
      lesson: 'NASA rovers travel at careful speeds of ~0.1 mph because high-speed impacts with Martian boulders or micro-meteoroids cause irrecoverable tire and chassis punctures.',
      tip: 'Use [SPACE] Thruster Boost to become invincible and smash through hazard swarms when trapped!',
    }
  }

  const { lesson, tip } = getLesson()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md animate-in fade-in select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-space-deep border-2 border-alert-red shadow-[0_0_50px_rgba(239,68,68,0.4)] text-starfield space-y-4"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-alert-red/30 pb-3">
          <div className="p-3 rounded-2xl bg-alert-red/20 text-alert-red">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-alert-red">
              {title}
            </h2>
            <p className="font-mono text-xs text-starfield/60">
              Expedition Terminated on Sol {sol} • Cadet Level {level} • Score: {score} PTS
            </p>
          </div>
        </div>

        {/* Root Cause & Lesson */}
        <div className="space-y-3 font-mono text-xs text-starfield/90">
          <div className="p-3.5 rounded-2xl bg-space-black/70 border border-white/5">
            <p className="font-bold text-sol-gold mb-1">🔍 Mission Failure Analysis:</p>
            <p className="text-starfield/80 leading-relaxed">{detail}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-nasa-blue/20 border border-nasa-blue/30">
            <p className="font-bold text-shield-cyan mb-1">🚀 Real NASA Aerospace Lesson:</p>
            <p className="text-starfield/80 leading-relaxed">{lesson}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-life-green/10 border border-life-green/30">
            <p className="font-bold text-life-green mb-1">💡 Flight Director Retry Advice:</p>
            <p className="text-starfield/80 leading-relaxed">{tip}</p>
          </div>
        </div>

        {/* Retry Button */}
        <div className="pt-2 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              sound.playClick()
              onRestart()
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display text-xs sm:text-sm tracking-widest uppercase
                       bg-gradient-to-r from-nasa-blue via-sky-500 to-shield-cyan text-space-black font-extrabold
                       shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Launch Next Expedition (Sol 1)
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
