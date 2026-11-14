import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

// SVG-based cartoon scene that dynamically reacts to game state
export default function HabitatStage({ meters, isStormActive, hoverChoice, baseType }) {
  const { power, food, shield } = meters;
  const isPowerLow = power < 35;
  const isFoodLow = food < 35;
  const isShieldLow = shield < 35;
  const isCritical = isPowerLow || isFoodLow || isShieldLow;

  // Determine sky color based on base type
  const skyColor = baseType === 'moon' ? '#0a0a1a' : '#1a0a00';
  const groundColor = baseType === 'moon' ? '#3f3f46' : '#7c2d12';
  const atmosphereColor = baseType === 'moon' ? 'rgba(100,100,120,0.1)' : 'rgba(180,80,30,0.2)';

  // Hover preview effects: which direction does each meter move?
  const previewEffects = useMemo(() => {
    if (!hoverChoice) return null;
    return hoverChoice.effects;
  }, [hoverChoice]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: 220 }}>
      {/* Sky Background */}
      <svg width="100%" height="220" viewBox="0 0 800 220" preserveAspectRatio="xMidYMid slice" className="absolute inset-0">
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyColor} />
            <stop offset="100%" stopColor={isStormActive ? '#3d0000' : baseType === 'moon' ? '#111827' : '#431407'} />
          </linearGradient>
          <radialGradient id="sunGlow" cx="85%" cy="20%" r="20%">
            <stop offset="0%" stopColor={isStormActive ? '#ff4500' : '#fbbf24'} stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="flicker">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
            <feColorMatrix type="saturate" values="0" result="grayNoise"/>
            <feBlend in="SourceGraphic" in2="grayNoise" mode="screen"/>
          </filter>
        </defs>
        <rect width="800" height="220" fill="url(#skyGrad)" />
        {/* Sun/Star glow */}
        <ellipse cx="680" cy="40" rx="80" ry="60" fill="url(#sunGlow)" />
        
        {/* Stars (moon base) */}
        {baseType === 'moon' && [
          [50, 20], [120, 35], [200, 15], [300, 25], [420, 10], [500, 40], [600, 18], [150, 55],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="white" opacity={0.6 + Math.random() * 0.4} />
        ))}
        
        {/* Dust haze for Mars */}
        {baseType === 'mars' && (
          <rect x="0" y="0" width="800" height="220" fill={atmosphereColor} />
        )}

        {/* Ground */}
        <ellipse cx="400" cy="230" rx="500" ry="60" fill={groundColor} />
        
        {/* Habitat dome structure */}
        <g transform="translate(300, 100)">
          {/* Main dome */}
          <ellipse cx="100" cy="80" rx="120" ry="85" fill={isPowerLow ? '#1e293b' : '#1e3a5f'} 
            opacity={isPowerLow ? 0.7 : 1}
            stroke="#38bdf8" strokeWidth="2"
          />
          {/* Dome highlight */}
          <ellipse cx="85" cy="40" rx="60" ry="30" fill="rgba(56,189,248,0.1)" />
          {/* Habitat windows */}
          {[0, 1, 2].map(i => (
            <ellipse key={i} cx={40 + i * 60} cy="75" rx="18" ry="22"
              fill={isPowerLow ? '#1e293b' : '#fde047'}
              opacity={isPowerLow ? 0.3 : 0.9}
              className={isPowerLow ? 'animate-[flicker_1.5s_linear_infinite]' : ''}
            />
          ))}
          {/* Airlock tube */}
          <rect x="185" y="90" width="60" height="25" rx="8" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Solar panels */}
          <rect x="-80" y="85" width="45" height="30" rx="3"
            fill={isPowerLow ? '#374151' : '#1d4ed8'} 
            stroke={isPowerLow ? '#6b7280' : '#3b82f6'} strokeWidth="1.5"
          />
          <rect x="-80" y="85" width="45" height="30" rx="3" fill="none"
            stroke={isPowerLow ? '#6b7280' : '#93c5fd'} strokeWidth="0.5"
          />
          {/* Panel lines */}
          {[8, 16, 24, 32].map(x => <line key={x} x1={-80+x} y1="85" x2={-80+x} y2="115" stroke="#1e40af" strokeWidth="0.5" />)}
        </g>
        
        {/* Greenhouse pod */}
        <g transform="translate(560, 115)">
          <ellipse cx="50" cy="55" rx="60" ry="50"
            fill={isFoodLow ? 'rgba(30,20,10,0.8)' : 'rgba(20,80,20,0.6)'}
            stroke={isFoodLow ? '#78350f' : '#4ade80'} strokeWidth="2"
          />
          {/* Plants inside */}
          {[0, 1, 2].map(i => (
            <g key={i} transform={`translate(${20 + i * 25}, 45)`}>
              <rect x="-3" y="0" width="6" height={isFoodLow ? '8' : '14'} rx="2"
                fill={isFoodLow ? '#78350f' : '#16a34a'}
              />
              <ellipse cx="0" cy={isFoodLow ? '2' : '-2'} rx="8" ry={isFoodLow ? '4' : '7'}
                fill={isFoodLow ? '#a16207' : '#22c55e'}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Solar Storm Overlay */}
      <AnimatePresence>
        {isStormActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Red plasma waves */}
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse at ${20 + i * 20}% ${30 + i * 10}%, rgba(220,38,38,${0.1 + i * 0.05}) 0%, transparent 60%)`,
                }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
            {/* Storm warning text */}
            <motion.div
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-900/90 border border-red-500 rounded-full px-4 py-1"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <span className="text-red-300 text-xs font-bold font-orbitron tracking-widest">⚠️ SOLAR STORM ACTIVE</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Power Low Flicker Overlay */}
      {isPowerLow && (
        <motion.div
          className="absolute inset-0 bg-black/40 pointer-events-none rounded-2xl"
          animate={{ opacity: [0.4, 0.1, 0.5, 0.2, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Characters */}
      {/* Commander Maya */}
      <motion.div
        className="absolute"
        style={{ bottom: 32, left: '38%' }}
        animate={
          isStormActive ? { x: [-2, 2, -2], transition: { duration: 0.3, repeat: Infinity } } :
          isPowerLow ? { x: [-1, 1, -1], opacity: [1, 0.7, 1], transition: { duration: 2, repeat: Infinity } } :
          { y: [0, -4, 0], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }
        }
      >
        <div className="relative">
          {/* Maya SVG cartoon */}
          <svg width="48" height="72" viewBox="0 0 48 72">
            {/* Spacesuit body */}
            <ellipse cx="24" cy="52" rx="16" ry="20" fill="#e2e8f0" />
            {/* Helmet */}
            <circle cx="24" cy="22" r="18" fill="#cbd5e1" />
            <circle cx="24" cy="22" r="14" fill="#0ea5e9" fillOpacity="0.4" />
            {/* Face */}
            <circle cx="21" cy="21" r="3" fill="#1e293b" />
            <circle cx="29" cy="21" r="3" fill="#1e293b" />
            <path d="M 19 27 Q 24 31 29 27" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* NASA badge */}
            <rect x="17" y="45" width="14" height="10" rx="2" fill="#1d4ed8" />
            <text x="24" y="53" textAnchor="middle" fill="white" fontSize="5" fontFamily="monospace">NASA</text>
            {/* Gloves */}
            <ellipse cx="10" cy="52" rx="6" ry="8" fill="#cbd5e1" />
            <ellipse cx="38" cy="52" rx="6" ry="8" fill="#cbd5e1" />
            {/* Boots */}
            <ellipse cx="18" cy="70" rx="7" ry="5" fill="#94a3b8" />
            <ellipse cx="30" cy="70" rx="7" ry="5" fill="#94a3b8" />
            {/* Frost particles when power low */}
            {isPowerLow && (
              <>
                <circle cx="8" cy="35" r="2" fill="#bae6fd" opacity="0.8" />
                <circle cx="40" cy="40" r="1.5" fill="#bae6fd" opacity="0.6" />
                <circle cx="5" cy="50" r="1" fill="#bae6fd" opacity="0.9" />
              </>
            )}
          </svg>
          <div className="text-center text-xs text-blue-300 font-bold mt-1" style={{ fontSize: '9px' }}>Maya</div>
        </div>
      </motion.div>

      {/* SPARK-E Rover Bot */}
      <motion.div
        className="absolute"
        style={{ bottom: 36, left: '52%' }}
        animate={
          isStormActive ? 
            { rotate: [0, 15, -15, 0], y: [-2, 0, -2], transition: { duration: 0.5, repeat: Infinity } } :
          { y: [0, -6, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } }
        }
      >
        <div className="relative">
          <svg width="44" height="56" viewBox="0 0 44 56">
            {/* Body */}
            <rect x="8" y="20" width="28" height="24" rx="6" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Head */}
            <rect x="10" y="6" width="24" height="18" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Eyes / sensors */}
            <circle cx="17" cy="15" r="4" fill={isStormActive ? '#ef4444' : '#38bdf8'} />
            <circle cx="27" cy="15" r="4" fill={isStormActive ? '#ef4444' : '#38bdf8'} />
            <circle cx="17" cy="15" r="2" fill="white" />
            <circle cx="27" cy="15" r="2" fill="white" />
            {/* Antenna */}
            <line x1="22" y1="6" x2="22" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
            <circle cx="22" cy="0" r="2" fill={isStormActive ? '#ef4444' : '#4ade80'} />
            {/* Wheels */}
            <ellipse cx="10" cy="44" rx="6" ry="6" fill="#475569" stroke="#64748b" strokeWidth="1" />
            <ellipse cx="34" cy="44" rx="6" ry="6" fill="#475569" stroke="#64748b" strokeWidth="1" />
            {/* ARM */}
            <line x1="36" y1="30" x2="44" y2="38" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="44" cy="38" r="3" fill="#38bdf8" />
            {/* Body details */}
            <rect x="14" y="26" width="16" height="6" rx="2" fill="#0f172a" />
            <circle cx="22" cy="38" r="4" fill={isPowerLow ? '#374151' : '#fde047'} />
          </svg>
          <div className="text-center text-xs text-cyan-300 font-bold mt-1" style={{ fontSize: '9px' }}>SPARK-E</div>
        </div>
      </motion.div>

      {/* Sprout the Radish Plant */}
      <motion.div
        className="absolute"
        style={{ bottom: 20, right: '18%' }}
        animate={{ y: isFoodLow ? [0, 2, 0] : [0, -3, 0], transition: { duration: 2, repeat: Infinity } }}
      >
        <svg width="32" height="40" viewBox="0 0 32 40">
          {/* Pot */}
          <path d="M 8 32 L 6 40 L 26 40 L 24 32 Z" fill="#92400e" />
          {/* Soil */}
          <ellipse cx="16" cy="32" rx="10" ry="4" fill="#78350f" />
          {/* Stem */}
          <rect x="14" y="12" width="4" height="22" rx="2" fill={isFoodLow ? '#78350f' : '#16a34a'} />
          {/* Leaves */}
          <ellipse cx="8" cy="20" rx="10" ry="6" fill={isFoodLow ? '#a16207' : '#22c55e'}
            transform="rotate(-20 8 20)" />
          <ellipse cx="24" cy="16" rx="10" ry="6" fill={isFoodLow ? '#92400e' : '#4ade80'}
            transform="rotate(20 24 16)" />
          {/* Radish bulb */}
          <ellipse cx="16" cy="34" rx="5" ry="6" fill={isFoodLow ? '#78350f' : '#e11d48'} />
          {/* Face on plant */}
          <circle cx="14" cy="22" r="1.5" fill={isFoodLow ? '#92400e' : '#1e293b'} />
          <circle cx="18" cy="22" r="1.5" fill={isFoodLow ? '#92400e' : '#1e293b'} />
          <path d={isFoodLow ? 'M 13 26 Q 16 24 19 26' : 'M 13 25 Q 16 28 19 25'}
            stroke={isFoodLow ? '#92400e' : '#1e293b'} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        <div className="text-center text-xs font-bold mt-1" style={{ fontSize: '9px', color: isFoodLow ? '#a16207' : '#4ade80' }}>Sprout</div>
      </motion.div>

      {/* Hover Preview Arrows on meters — shown as floating indicators */}
      <AnimatePresence>
        {previewEffects && (
          <motion.div
            className="absolute top-3 right-3 flex flex-col gap-1 bg-black/70 rounded-xl p-2 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="text-xs text-white/70 font-bold mb-1" style={{ fontSize: '9px' }}>IF YOU CHOOSE:</div>
            {[
              { key: 'power', label: '⚡', value: previewEffects.power },
              { key: 'food', label: '🌱', value: previewEffects.food },
              { key: 'shield', label: '🛡️', value: previewEffects.shield },
            ].map(({ key, label, value }) => (
              value !== 0 && (
                <motion.div
                  key={key}
                  className="flex items-center gap-1 text-xs font-bold"
                  animate={{ x: [0, value > 0 ? 2 : -2, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <span>{label}</span>
                  <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                    {value > 0 ? `▲ +${value}` : `▼ ${value}`}
                  </span>
                </motion.div>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
