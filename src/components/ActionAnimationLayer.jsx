import { motion } from 'framer-motion'

/**
 * ActionAnimationLayer — Real-Time Visual Action Animations
 * Renders the chosen item/tool physically interacting with Commander Leo and the stage in real time!
 * Covers all 20 action types across the 10 missions for Junior Space Cadets (ages 7–12).
 */
export default function ActionAnimationLayer({ actionType, isCorrect }) {
  if (!actionType) return null

  return (
    <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* ── 1. Wind Blower (Stage 1 Fail) ── */}
      {actionType === 'wind_blower' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Blower gun swooping in */}
          <motion.div
            initial={{ x: -120, scale: 0.5, rotate: -20 }}
            animate={{ x: 20, scale: 1.1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="absolute left-8 top-1/3 text-6xl"
          >
            💨🔫
          </motion.div>
          {/* Maximum wind storm lines */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: [0, 1, 1], scaleX: [0, 1.2, 1] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col justify-center gap-4 pl-32 text-cyan-200 text-3xl font-black"
          >
            <motion.div animate={{ x: [0, 100, 200] }} transition={{ repeat: Infinity, duration: 0.4 }}>
              💨 💨 💨 💨
            </motion.div>
            <motion.div animate={{ x: [-50, 80, 180] }} transition={{ repeat: Infinity, duration: 0.35 }}>
              〰️ 〰️ 〰️ 🌪️
            </motion.div>
          </motion.div>
          {/* Red dust cloud explosion over Leo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.8, 2.2], opacity: [0, 0.9, 0.75] }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="w-64 h-64 rounded-full bg-amber-700/80 blur-xl flex items-center justify-center text-5xl"
          >
            🌪️ 💥
          </motion.div>
        </div>
      )}

      {/* ── 2. Sand Bouncing Rover (Stage 1 Success) ── */}
      {actionType === 'sand_rover' && (
        <div className="absolute inset-0 flex items-center">
          {/* Cute 6-wheel rover driving in */}
          <motion.div
            initial={{ x: -150 }}
            animate={{ x: [ -150, 40, 100 ] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute bottom-12 text-6xl flex items-center gap-2"
          >
            <span className="filter drop-shadow-xl">🚜</span>
            {/* Spinning brushes and sand bouncing particles */}
            <motion.span
              animate={{ rotate: 360, y: [-4, -20, 0] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              className="text-4xl text-sol-gold"
            >
              ✨ 🧹 ✨
            </motion.span>
          </motion.div>
          {/* Clean sparkles on solar panels */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0.5, 1.3, 1] }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute top-20 right-20 text-5xl text-sol-gold"
          >
            ✨ ☀️ ✨
          </motion.div>
        </div>
      )}

      {/* ── 3. Battery Overload (Stage 2 Fail) ── */}
      {actionType === 'battery_overload' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Giant magnet coils dropping down */}
          <motion.div
            initial={{ y: -100, scale: 0 }}
            animate={{ y: 0, scale: 1.2 }}
            transition={{ type: 'spring', damping: 10 }}
            className="absolute top-16 text-7xl"
          >
            🧲
          </motion.div>
          {/* Electric overload arcs */}
          <motion.div
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ repeat: 4, duration: 0.2 }}
            className="absolute inset-0 bg-yellow-400/30 flex items-center justify-center text-6xl"
          >
            ⚡ ⚡ ⚡ ⚡
          </motion.div>
          {/* Blown fuse smoke */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.8], scale: 1.5, y: -40 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-5xl"
          >
            💨 💥 🔌
          </motion.div>
        </div>
      )}

      {/* ── 4. Regolith Dirt Bunker (Stage 2 Success) ── */}
      {actionType === 'regolith_wall' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Heavy regolith blocks dropping into place */}
          <div className="flex gap-3 items-end absolute bottom-12">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ y: -250, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-20 rounded-2xl bg-amber-900 border-4 border-amber-700 shadow-2xl flex items-center justify-center text-2xl font-black text-amber-200"
              >
                🪨
              </motion.div>
            ))}
          </div>
          {/* Green radiation barrier glow */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.4, 1.2], opacity: [0, 0.8, 0.5] }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="w-80 h-64 rounded-full border-4 border-life-green bg-life-green/20 blur-md absolute bottom-6"
          />
        </div>
      )}

      {/* ── 5. Soda Shower Bubbles (Stage 3 Fail) ── */}
      {actionType === 'soda_bubbles' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Spray bottle */}
          <motion.div
            initial={{ x: -100, rotate: 45 }}
            animate={{ x: 20, rotate: 20 }}
            transition={{ type: 'spring' }}
            className="absolute left-10 top-24 text-6xl"
          >
            🚿 🥤
          </motion.div>
          {/* Floating zero-G soda spheres */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.3, 1],
                x: [0, (i - 2.5) * 60, (i - 2.5) * 80],
                y: [0, -30 * (i % 3), -50 * (i % 2)],
              }}
              transition={{ delay: 0.2 + i * 0.1, duration: 1.2, repeat: Infinity, repeatType: 'reverse' }}
              className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 border-2 border-white/60 shadow-lg flex items-center justify-center text-xs text-white font-bold"
            >
              🫧
            </motion.div>
          ))}
        </div>
      )}

      {/* ── 6. Red & Blue LED Grow Lasers (Stage 3 Success) ── */}
      {actionType === 'led_lasers' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Ceiling LED lamp lowering */}
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 15 }}
            transition={{ type: 'spring', damping: 12 }}
            className="absolute top-2 w-72 h-10 rounded-2xl bg-slate-800 border-2 border-pink-400 flex justify-around items-center px-4 shadow-[0_0_25px_rgba(236,72,153,0.6)]"
          >
            <span className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
            <span className="w-4 h-4 rounded-full bg-blue-500 animate-ping" />
            <span className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
            <span className="w-4 h-4 rounded-full bg-blue-500 animate-ping" />
          </motion.div>
          {/* Magenta / Cyan light beams streaming down */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.65, scaleY: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-12 w-64 h-64 bg-gradient-to-b from-pink-500/40 via-purple-500/30 to-blue-500/40 blur-sm pointer-events-none"
          />
          {/* Sprouting plants growing */}
          <motion.div
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: [0, 1.4, 1.2], y: 0 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="absolute bottom-16 left-12 text-5xl"
          >
            🥬 🌱 🌿
          </motion.div>
        </div>
      )}

      {/* ── 7. Fire Oxygen Smoke (Stage 4 Fail) ── */}
      {actionType === 'fire_smoke' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Campfire igniting violently */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.8, 1.4] }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-16 text-6xl"
          >
            🔥 💥
          </motion.div>
          {/* Thick black soot smoke filling room */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.9, 0.85], scale: [0.5, 2, 2.5] }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full h-full bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-4xl text-white font-mono font-black"
          >
            <p>☁️ COUGH COUGH! ☁️</p>
            <p className="text-sm text-alert-red mt-2">OXYGEN TANK DEPLETED 0%</p>
          </motion.div>
        </div>
      )}

      {/* ── 8. Shiny Gold Space Blanket (Stage 4 Success) ── */}
      {actionType === 'gold_blanket' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Gold MLI blanket wrapping */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-80 h-72 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border-4 border-amber-300 shadow-[0_0_60px_rgba(251,191,36,0.6)] flex items-center justify-center text-5xl"
          >
            <motion.span
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ☕ 💛
            </motion.span>
          </motion.div>
          {/* Cozy heat rays radiating */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute w-96 h-80 rounded-full border-2 border-sol-gold/50"
          />
        </div>
      )}

      {/* ── 9. Megaphone Fail (Stage 5 Fail) ── */}
      {actionType === 'megaphone_fail' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1.3, rotate: 0 }}
            transition={{ type: 'spring' }}
            className="text-7xl mb-12"
          >
            📢
          </motion.div>
          {/* Sound waves that instantly pop into question marks */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.8, 2.2] }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="text-4xl text-slate-300 font-mono font-bold absolute"
          >
            ... ??? ... (VACUUM NOISE: 0 dB)
          </motion.div>
        </div>
      )}

      {/* ── 10. Infrared Laser Beam (Stage 5 Success) ── */}
      {actionType === 'laser_beam' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Laser Transmitter Dish */}
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="absolute left-8 top-16 text-6xl"
          >
            📡
          </motion.div>
          {/* Ultra-speed Cyan Photon Laser Beam */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 1, 0.8] }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="absolute left-28 top-24 w-3/4 h-3 rounded-full bg-cyan-300 shadow-[0_0_35px_rgba(6,182,212,1)] origin-left"
          />
          {/* Reply from Earth */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1.4, y: 0 }}
            transition={{ delay: 0.9, type: 'spring' }}
            className="absolute top-12 right-12 p-3 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 font-display font-black text-sm shadow-xl flex items-center gap-1.5"
          >
            <span>🍕</span>
            <span>EARTH SAYS HI!</span>
          </motion.div>
        </div>
      )}

      {/* ── 11. Sugary Soda Spill (Stage 6 Fail) ── */}
      {actionType === 'soda_spill' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1.4, rotate: 20 }}
            className="text-7xl mb-8"
          >
            🧃
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: [0.8, 1.3, 1] }}
            transition={{ delay: 0.4 }}
            className="text-4xl absolute bottom-24 text-rose-300 font-bold"
          >
            😵‍💫 *SLURP* DEHYDRATED!
          </motion.div>
        </div>
      )}

      {/* ── 12. ECLSS Water Recycler (Stage 6 Success) ── */}
      {actionType === 'eclss_filter' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Centrifugal filter */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1.2, rotate: 720 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-48 h-48 rounded-full border-4 border-cyan-400 bg-cyan-500/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(6,182,212,0.5)]"
          >
            💧
          </motion.div>
          {/* Pure clean water droplets cascading */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 60, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.15, repeat: Infinity, duration: 0.8 }}
              className="absolute text-3xl text-cyan-300"
              style={{ left: `${40 + i * 8}%` }}
            >
              🧊
            </motion.div>
          ))}
        </div>
      )}

      {/* ── 13. Steel Legs Snapping (Stage 7 Fail) ── */}
      {actionType === 'steel_snap' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Ground tremor */}
          <motion.div
            animate={{ x: [-8, 8, -6, 6, 0] }}
            transition={{ repeat: Infinity, duration: 0.15 }}
            className="absolute bottom-8 flex gap-8 items-end text-6xl"
          >
            <motion.span
              animate={{ rotate: [0, 45] }}
              transition={{ delay: 0.5, duration: 0.2 }}
            >
              🏗️💥
            </motion.span>
            <motion.span
              animate={{ rotate: [0, -45] }}
              transition={{ delay: 0.6, duration: 0.2 }}
            >
              🏗️💥
            </motion.span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl text-alert-red font-black font-display absolute top-20"
          >
            *CRACK!* STIFF LEGS SHATTERED!
          </motion.div>
        </div>
      )}

      {/* ── 14. Airbag Dampers Bouncing (Stage 7 Success) ── */}
      {actionType === 'airbag_bounce' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Inflatable Airbags */}
          <div className="absolute bottom-10 flex gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.4, 1.1] }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="w-20 h-20 rounded-full bg-amber-400 border-4 border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.6)] flex items-center justify-center text-3xl"
              >
                🦿
              </motion.div>
            ))}
          </div>
          {/* Rhythmic bouncing */}
          <motion.div
            animate={{ y: [0, -25, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
            className="text-4xl text-life-green font-display font-black absolute top-16"
          >
            *BOING!* SEISMIC SHOCK ABSORBED! 🛡️
          </motion.div>
        </div>
      )}

      {/* ── 15. Lick Toxic Dust (Stage 8 Fail) ── */}
      {actionType === 'lick_toxic' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.4, 1.1] }}
            className="text-7xl mb-12"
          >
            👅 ☣️
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: [1, 1.3, 1] }}
            transition={{ delay: 0.4 }}
            className="text-3xl text-rose-400 font-mono font-bold absolute bottom-20"
          >
            🔥 PERCHLORATE TOXIC BURN! YUCK!
          </motion.div>
        </div>
      )}

      {/* ── 16. Ion Dust Repel Wand (Stage 8 Success) ── */}
      {actionType === 'ion_zap' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ rotate: -45, x: -80 }}
            animate={{ rotate: 15, x: 20 }}
            className="absolute left-12 text-6xl"
          >
            🪄⚡
          </motion.div>
          {/* Expanding electric repulsor wave */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 2, 2.5], opacity: [1, 0.8, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-48 h-48 rounded-full border-4 border-cyan-300 bg-cyan-400/20 shadow-[0_0_50px_rgba(6,182,212,0.8)]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-16 text-3xl text-cyan-200 font-display font-black"
          >
            ✨ STATIC PURGE COMPLETE! ✨
          </motion.div>
        </div>
      )}

      {/* ── 17. Car Wiper Snap (Stage 9 Fail) ── */}
      {actionType === 'wiper_snap' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: [-20, 20, -20] }}
            transition={{ repeat: 2, duration: 0.3 }}
            className="text-7xl mb-8"
          >
            🚗 🧊
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.3 }}
            transition={{ delay: 0.6 }}
            className="text-2xl text-slate-300 font-mono font-bold absolute bottom-20"
          >
            💔 FROZEN RUBBER SNAPPED INTO ICE SHARDS!
          </motion.div>
        </div>
      )}

      {/* ── 18. Indium-Tin Heating Glass (Stage 9 Success) ── */}
      {actionType === 'heat_melt' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Golden wire heating grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.6] }}
            className="w-80 h-64 rounded-3xl border-4 border-amber-400/80 bg-amber-500/15 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)]"
          >
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="text-5xl"
            >
              ♨️ ☀️ ♨️
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl text-sol-gold font-display font-black absolute top-14"
          >
            FROST VAPORIZED INSTANTLY! ☀️
          </motion.div>
        </div>
      )}

      {/* ── 19. TNT Shrapnel (Stage 10 Fail) ── */}
      {actionType === 'tnt_shrapnel' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Big Cartoon Bomb */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 0] }}
            transition={{ duration: 0.6 }}
            className="text-8xl"
          >
            💣💥
          </motion.div>
          {/* 10,000 Flying Meteor Shrapnel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-4xl"
          >
            <motion.span animate={{ x: [-200, 200], y: [-150, 150] }} transition={{ repeat: Infinity, duration: 0.5 }}>☄️</motion.span>
            <motion.span animate={{ x: [200, -200], y: [-100, 100] }} transition={{ repeat: Infinity, duration: 0.4 }}>🪨</motion.span>
            <motion.span animate={{ x: [-150, 150], y: [150, -150] }} transition={{ repeat: Infinity, duration: 0.45 }}>☄️</motion.span>
          </motion.div>
        </div>
      )}

      {/* ── 20. NASA DART Kinetic Strike (Stage 10 Success) ── */}
      {actionType === 'dart_strike' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* DART probe streaking in from upper left */}
          <motion.div
            initial={{ x: -250, y: -150, scale: 0.4 }}
            animate={{ x: 0, y: 0, scale: 1.2 }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
            className="absolute text-6xl"
          >
            🚀
          </motion.div>
          {/* Asteroid getting nudged */}
          <motion.div
            initial={{ x: 80, y: 0 }}
            animate={{ x: 250, y: -100, rotate: 180 }}
            transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
            className="absolute text-8xl"
          >
            ☄️
          </motion.div>
          {/* Kinetic impact shockwave */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5, 3], opacity: [0, 1, 0] }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-48 h-48 rounded-full bg-sol-gold/60 blur-xl"
          />
        </div>
      )}
    </div>
  )
}
