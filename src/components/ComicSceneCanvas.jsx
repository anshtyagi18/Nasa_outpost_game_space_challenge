import { motion } from 'framer-motion'
import AnimatedLeo from './AnimatedLeo.jsx'

/**
 * ComicSceneCanvas — Visual Cartoon Setting for 'Save the Astronaut'
 * Renders the animated base dome, alien terrain, speech bubble, and Commander Leo.
 */
export default function ComicSceneCanvas({
  stage,
  currentMood = 'happy',
  outcomeText = null,
  isCorrect = null,
}) {
  const { environment, prompt } = stage

  return (
    <div className="relative w-full h-80 sm:h-96 md:h-[420px] rounded-3xl overflow-hidden border-4 border-slate-700 bg-space-black shadow-[0_0_50px_rgba(11,61,145,0.3)] flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* ── 1. Comic Sky & Planet Backdrop ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Sky gradient depending on environment */}
        <div
          className={`w-full h-full transition-colors duration-700 ${
            environment === 'dust_storm'
              ? 'bg-gradient-to-b from-amber-950 via-amber-900 to-orange-950'
              : environment === 'solar_flare'
              ? 'bg-gradient-to-b from-red-950 via-rose-900 to-amber-950'
              : environment === 'ice_storm'
              ? 'bg-gradient-to-b from-slate-950 via-sky-950 to-blue-950'
              : environment === 'greenhouse'
              ? 'bg-gradient-to-b from-emerald-950 via-slate-900 to-teal-950'
              : 'bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950'
          }`}
        />

        {/* Distant Earth / Mars Sphere */}
        <div className="absolute top-4 right-8 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 border-2 border-cyan-300/40 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center opacity-85">
          <div className="w-8 h-4 rounded-full bg-emerald-400/60 rotate-45" />
        </div>

        {/* Cartoon Stars */}
        <div className="absolute top-6 left-12 text-sol-gold text-lg animate-pulse">★</div>
        <div className="absolute top-16 left-36 text-white text-xs opacity-60">✦</div>
        <div className="absolute top-10 right-40 text-cyan-300 text-sm animate-pulse">★</div>
        <div className="absolute top-24 right-24 text-sol-gold text-xs">✦</div>

        {/* ── Environment Special FX ── */}
        {/* Dust Storm Clouds */}
        {environment === 'dust_storm' && (
          <div className="absolute inset-0">
            <motion.div
              animate={{ x: [-20, 20, -20] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute inset-0 bg-amber-600/20 backdrop-blur-[1px]"
            />
            <div className="absolute bottom-20 left-10 text-4xl opacity-50">🌪️</div>
            <div className="absolute top-20 right-16 text-3xl opacity-50">💨</div>
          </div>
        )}

        {/* Solar Flare Waves */}
        {environment === 'solar_flare' && (
          <div className="absolute inset-0 bg-red-600/15 animate-pulse">
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-sol-gold/40 blur-3xl animate-ping" />
            <div className="absolute top-12 left-28 text-3xl">☀️</div>
          </div>
        )}

        {/* Ice / Freezing Storm */}
        {environment === 'ice_storm' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-cyan-300/40 to-transparent flex justify-around text-lg text-cyan-200">
              <span>❄️</span><span>❄️</span><span>❄️</span><span>❄️</span><span>❄️</span>
            </div>
            <div className="absolute inset-0 bg-cyan-500/10" />
          </div>
        )}

        {/* Greenhouse Plants */}
        {environment === 'greenhouse' && (
          <div className="absolute bottom-16 left-8 text-3xl opacity-70">🌱 🌿 🌾</div>
        )}

        {/* Martian Soil Terrain Ground */}
        <div className="absolute -bottom-6 left-0 right-0 h-28 rounded-t-[50%] bg-gradient-to-t from-orange-950 via-stone-800 to-amber-900 border-t-4 border-amber-700/60 shadow-2xl" />

        {/* Outpost Dome in background */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-48 sm:w-60 h-24 rounded-t-full bg-slate-800/80 border-2 border-cyan-400/40 shadow-inner flex items-center justify-center">
          <div className="w-12 h-6 rounded-t-full bg-cyan-400/30" />
        </div>
      </div>

      {/* ── 2. Top Prompt: Comic Speech Bubble ── */}
      <div className="relative z-10 max-w-xl mx-auto w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-3.5 sm:p-4 rounded-3xl bg-white text-slate-900 shadow-2xl border-4 border-slate-900 relative"
        >
          {/* Speech Bubble Pointer */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-slate-900 rotate-45" />

          <p className="font-display text-sm sm:text-base font-extrabold text-center tracking-wide leading-snug">
            {outcomeText ? outcomeText : prompt}
          </p>
        </motion.div>
      </div>

      {/* ── 3. Center: Commander Leo Vector Character ── */}
      <div className="relative z-10 flex-1 flex items-end justify-center pb-2">
        <AnimatedLeo mood={currentMood} />
      </div>
    </div>
  )
}
