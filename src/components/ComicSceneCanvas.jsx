import { motion } from 'framer-motion'
import AnimatedLeo from './AnimatedLeo.jsx'

/**
 * ComicSceneCanvas — Visual Cartoon Setting for 'Save the Astronaut'
 * Renders the animated base dome, alien terrain, speech bubble, and Commander Leo.
 * Built with seamless speech bubble tails (Zero text obscuring) and translucent
 * celestial integration for background 3D planetary motion.
 */
export default function ComicSceneCanvas({
  stage,
  currentMood = 'happy',
  outcomeText = null,
  isCorrect = null,
}) {
  const { environment, prompt } = stage

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden border-4 border-slate-700 bg-space-black/70 backdrop-blur-md shadow-[0_0_50px_rgba(11,61,145,0.35)] flex flex-col justify-between p-4 sm:p-6 select-none transition-all duration-300">
      {/* ── 1. Comic Sky & Planet Backdrop ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Sky gradient depending on environment with slight translucency for 3D stars */}
        <div
          className={`w-full h-full transition-colors duration-700 opacity-80 ${
            environment === 'dust_storm'
              ? 'bg-gradient-to-b from-amber-950/80 via-amber-900/60 to-orange-950/85'
              : environment === 'solar_flare'
              ? 'bg-gradient-to-b from-red-950/80 via-rose-900/60 to-amber-950/85'
              : environment === 'ice_storm'
              ? 'bg-gradient-to-b from-slate-950/80 via-sky-950/60 to-blue-950/85'
              : environment === 'greenhouse'
              ? 'bg-gradient-to-b from-emerald-950/80 via-slate-900/60 to-teal-950/85'
              : 'bg-gradient-to-b from-slate-950/80 via-indigo-950/60 to-purple-950/85'
          }`}
        />

        {/* Orbiting Orbital Ring Glow */}
        <div className="absolute -top-24 right-[-10%] w-[380px] h-[380px] rounded-full border border-cyan-400/20 opacity-40 pointer-events-none" />

        {/* ── Environment Special FX ── */}
        {/* Dust Storm Clouds */}
        {environment === 'dust_storm' && (
          <div className="absolute inset-0">
            <motion.div
              animate={{ x: [-30, 30, -30] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute inset-0 bg-amber-600/25 backdrop-blur-[1px]"
            />
            <div className="absolute bottom-20 left-10 text-4xl opacity-60">🌪️</div>
            <div className="absolute top-20 right-16 text-3xl opacity-60">💨</div>
            <div className="absolute top-1/2 left-1/4 text-2xl opacity-40">🌪️</div>
          </div>
        )}

        {/* Solar Flare Waves */}
        {environment === 'solar_flare' && (
          <div className="absolute inset-0 bg-red-600/15 animate-pulse">
            <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-sol-gold/40 blur-3xl animate-ping" />
            <div className="absolute top-12 left-28 text-3xl">☀️</div>
            <div className="absolute top-24 right-32 text-2xl animate-bounce">⚡</div>
          </div>
        )}

        {/* Ice / Freezing Storm */}
        {environment === 'ice_storm' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-cyan-300/40 to-transparent flex justify-around text-lg text-cyan-200">
              <span>❄️</span><span>❄️</span><span>❄️</span><span>❄️</span><span>❄️</span><span>❄️</span><span>❄️</span>
            </div>
            <div className="absolute inset-0 bg-cyan-500/15" />
          </div>
        )}

        {/* Greenhouse Plants */}
        {environment === 'greenhouse' && (
          <div className="absolute bottom-16 left-8 sm:left-14 text-3xl sm:text-4xl opacity-80 flex gap-2">
            <span>🌱</span><span>🌿</span><span>🌾</span><span>🥬</span>
          </div>
        )}

        {/* Martian Soil Terrain Ground */}
        <div className="absolute -bottom-8 left-0 right-0 h-32 sm:h-36 rounded-t-[50%] bg-gradient-to-t from-orange-950 via-stone-800 to-amber-900 border-t-4 border-amber-700/60 shadow-2xl" />

        {/* Outpost Hab Dome in background */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 sm:w-72 h-28 rounded-t-full bg-slate-800/85 border-2 border-cyan-400/40 shadow-inner flex items-center justify-center">
          <div className="w-16 h-8 rounded-t-full bg-cyan-400/30" />
        </div>
      </div>

      {/* ── 2. Top Prompt: Comic Speech Bubble (Zero text obscuring) ── */}
      <div className="relative z-10 max-w-2xl sm:max-w-3xl mx-auto w-full flex flex-col items-center">
        <motion.div
          key={outcomeText || prompt}
          initial={{ scale: 0.92, opacity: 0, y: -6 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 280 }}
          className="w-full px-5 py-3.5 sm:px-8 sm:py-4 rounded-3xl bg-white text-slate-900 shadow-2xl border-4 border-slate-900 relative z-20"
        >
          <p className="font-display text-sm sm:text-base md:text-lg font-black text-center tracking-wide leading-snug break-words">
            {outcomeText ? outcomeText : prompt}
          </p>
        </motion.div>

        {/* Clean Comic Speech Pointer below the bubble (Zero text overlap!) */}
        <div className="relative -mt-1 z-10 flex justify-center pointer-events-none">
          <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
            {/* Triangular arrow pointing down */}
            <path
              d="M0 0 L14 16 L28 0 Z"
              fill="white"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* White masking bar to seamlessly connect bubble interior with pointer */}
            <line x1="3" y1="0" x2="25" y2="0" stroke="white" strokeWidth="6" />
          </svg>
        </div>
      </div>

      {/* ── 3. Center: Commander Leo Vector Character ── */}
      <div className="relative z-10 flex-1 flex items-end justify-center pb-2">
        <AnimatedLeo mood={currentMood} />
      </div>
    </div>
  )
}
