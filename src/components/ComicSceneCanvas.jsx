import { motion } from 'framer-motion'
import AnimatedLeo from './AnimatedLeo.jsx'
import ActionAnimationLayer from './ActionAnimationLayer.jsx'

/**
 * ComicSceneCanvas — Visual Cartoon Setting for 'Save the Astronaut'
 * Renders the animated base dome, alien terrain, speech bubble, Commander Leo,
 * real-time action animation layer, and intense survival instinct telemetry.
 */
export default function ComicSceneCanvas({
  stage,
  currentMood = 'happy',
  outcomeText = null,
  isCorrect = null,
  activeAction = null,
  survivalSeconds = 25,
}) {
  const { environment, prompt, hazardLevel, hazardRating } = stage
  const isUrgent = survivalSeconds <= 8 && !outcomeText

  return (
    <div
      className={`relative w-full h-[370px] sm:h-[430px] md:h-[470px] lg:h-[510px] rounded-3xl overflow-hidden border-4 bg-space-black/75 backdrop-blur-md shadow-[0_0_50px_rgba(11,61,145,0.35)] flex flex-col justify-between p-3.5 sm:p-5 select-none transition-all duration-300 ${
        isUrgent
          ? 'border-alert-red shadow-[0_0_50px_rgba(239,68,68,0.55)] animate-pulse'
          : 'border-slate-700'
      }`}
    >
      {/* ── 1. Comic Sky & Planet Backdrop ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Sky gradient depending on environment */}
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
              : environment === 'water_crisis'
              ? 'bg-gradient-to-b from-cyan-950/80 via-sky-900/60 to-blue-950/85'
              : environment === 'moonquake'
              ? 'bg-gradient-to-b from-stone-950/80 via-zinc-900/60 to-slate-950/85'
              : environment === 'airlock_hazard'
              ? 'bg-gradient-to-b from-amber-950/80 via-yellow-950/60 to-red-950/85'
              : environment === 'comet_frost'
              ? 'bg-gradient-to-b from-blue-950/80 via-indigo-950/60 to-cyan-950/85'
              : environment === 'asteroid_incoming'
              ? 'bg-gradient-to-b from-red-950/90 via-rose-950/80 to-amber-950/90'
              : 'bg-gradient-to-b from-slate-950/80 via-indigo-950/60 to-purple-950/85'
          }`}
        />

        {/* Orbiting Orbital Ring Glow */}
        <div className="absolute -top-24 right-[-10%] w-[380px] h-[380px] rounded-full border border-cyan-400/20 opacity-40 pointer-events-none" />

        {/* ── Environment Special FX ── */}
        {/* Dust Storm */}
        {environment === 'dust_storm' && (
          <div className="absolute inset-0">
            <motion.div
              animate={{ x: [-30, 30, -30] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute inset-0 bg-amber-600/25 backdrop-blur-[1px]"
            />
            <div className="absolute bottom-20 left-10 text-4xl opacity-60">🌪️</div>
            <div className="absolute top-20 right-16 text-3xl opacity-60">💨</div>
          </div>
        )}

        {/* Solar Flare */}
        {environment === 'solar_flare' && (
          <div className="absolute inset-0 bg-red-600/15 animate-pulse">
            <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-sol-gold/40 blur-3xl animate-ping" />
            <div className="absolute top-12 left-28 text-3xl">☀️</div>
            <div className="absolute top-24 right-32 text-2xl animate-bounce">⚡</div>
          </div>
        )}

        {/* Water Crisis */}
        {environment === 'water_crisis' && (
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-1/4 text-4xl opacity-50 animate-bounce">💧</div>
            <div className="absolute top-1/2 right-1/4 text-3xl opacity-40 animate-pulse">🧊</div>
          </div>
        )}

        {/* Moonquake Tremor */}
        {environment === 'moonquake' && (
          <motion.div
            animate={{ x: [-4, 4, -3, 3, 0] }}
            transition={{ repeat: Infinity, duration: 0.12 }}
            className="absolute inset-0"
          >
            <div className="absolute bottom-24 left-1/3 text-3xl opacity-60">💥 🌋</div>
          </motion.div>
        )}

        {/* Asteroid Incoming */}
        {environment === 'asteroid_incoming' && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-8 right-16 text-6xl filter drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
            >
              ☄️
            </motion.div>
            <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
          </div>
        )}

        {/* Martian Soil Terrain Ground */}
        <div className="absolute -bottom-8 left-0 right-0 h-32 sm:h-36 rounded-t-[50%] bg-gradient-to-t from-orange-950 via-stone-800 to-amber-900 border-t-4 border-amber-700/60 shadow-2xl" />

        {/* Outpost Hab Dome in background */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 sm:w-72 h-28 rounded-t-full bg-slate-800/85 border-2 border-cyan-400/40 shadow-inner flex items-center justify-center">
          <div className="w-16 h-8 rounded-t-full bg-cyan-400/30" />
        </div>
      </div>

      {/* ── 2. Top Survival Instinct Telemetry Banner ── */}
      <div className="relative z-10 w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl bg-space-black/75 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-alert-red animate-ping" />
          <span className="font-mono text-[10px] sm:text-xs font-black uppercase text-amber-300 tracking-wider">
            SURVIVAL INSTINCT: {hazardLevel || 'HAZARD ACTIVE'}
          </span>
          {hazardRating && (
            <span className="hidden sm:inline font-mono text-[10px] px-2 py-0.5 rounded-full bg-alert-red/20 text-alert-red border border-alert-red/30 font-bold">
              THREAT: {hazardRating}
            </span>
          )}
        </div>

        {/* Survival Countdown */}
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <span className="text-starfield/60">REACT FAST:</span>
          <span
            className={`px-2 py-0.5 rounded-lg border ${
              isUrgent
                ? 'bg-alert-red text-white border-white animate-bounce'
                : 'bg-space-deep text-sol-gold border-sol-gold/40'
            }`}
          >
            ⏱️ {survivalSeconds}s
          </span>
        </div>
      </div>

      {/* ── 3. Top Prompt: Comic Speech Bubble (Zero text obscuring) ── */}
      <div className="relative z-10 max-w-2xl sm:max-w-3xl mx-auto w-full flex flex-col items-center mt-1">
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
            <path
              d="M0 0 L14 16 L28 0 Z"
              fill="white"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <line x1="3" y1="0" x2="25" y2="0" stroke="white" strokeWidth="6" />
          </svg>
        </div>
      </div>

      {/* ── 4. Center: Commander Leo Vector Character ── */}
      <div className="relative z-10 flex-1 flex items-end justify-center pb-2">
        <AnimatedLeo mood={currentMood} />
      </div>

      {/* ── 5. Real-Time Action Animation Layer (Choice Physical Action) ── */}
      <ActionAnimationLayer actionType={activeAction} isCorrect={isCorrect} />
    </div>
  )
}
