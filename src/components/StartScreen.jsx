import { useState } from 'react';
import { motion } from 'framer-motion';
import { BASE_TYPES } from '../data/missionScenarios';
import { playClick } from '../utils/sound';

export default function StartScreen({ onStart }) {
  const [selected, setSelected] = useState('mars');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] py-8 gap-6">
      {/* Logo */}
      <motion.div
        className="text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div
          className="text-7xl mb-3"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🚀
        </motion.div>
        <h1 className="font-orbitron font-black text-4xl md:text-5xl shimmer-text leading-tight">
          ARES KIDS
        </h1>
        <p className="font-orbitron text-cyan-400 text-lg mt-1 font-bold">Survival on Sol-7</p>
        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
          A NASA Space Apps Challenge educational game for future astronauts ages 7–12 🌟
        </p>
      </motion.div>

      {/* Characters preview */}
      <motion.div
        className="flex gap-6 items-end"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Maya */}
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="60" height="88" viewBox="0 0 48 72">
              <ellipse cx="24" cy="52" rx="16" ry="20" fill="#e2e8f0" />
              <circle cx="24" cy="22" r="18" fill="#cbd5e1" />
              <circle cx="24" cy="22" r="14" fill="#0ea5e9" fillOpacity="0.4" />
              <circle cx="21" cy="21" r="3" fill="#1e293b" />
              <circle cx="29" cy="21" r="3" fill="#1e293b" />
              <path d="M 19 27 Q 24 31 29 27" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
              <rect x="17" y="45" width="14" height="10" rx="2" fill="#1d4ed8" />
              <text x="24" y="53" textAnchor="middle" fill="white" fontSize="5" fontFamily="monospace">NASA</text>
              <ellipse cx="10" cy="52" rx="6" ry="8" fill="#cbd5e1" />
              <ellipse cx="38" cy="52" rx="6" ry="8" fill="#cbd5e1" />
              <ellipse cx="18" cy="70" rx="7" ry="5" fill="#94a3b8" />
              <ellipse cx="30" cy="70" rx="7" ry="5" fill="#94a3b8" />
            </svg>
          </motion.div>
          <p className="text-xs text-blue-300 font-bold mt-1">Commander Maya</p>
        </div>

        {/* SPARK-E */}
        <div className="text-center">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <svg width="55" height="70" viewBox="0 0 44 56">
              <rect x="8" y="20" width="28" height="24" rx="6" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="10" y="6" width="24" height="18" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="17" cy="15" r="4" fill="#38bdf8" />
              <circle cx="27" cy="15" r="4" fill="#38bdf8" />
              <circle cx="17" cy="15" r="2" fill="white" />
              <circle cx="27" cy="15" r="2" fill="white" />
              <line x1="22" y1="6" x2="22" y2="0" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="22" cy="0" r="2" fill="#4ade80" />
              <ellipse cx="10" cy="44" rx="6" ry="6" fill="#475569" />
              <ellipse cx="34" cy="44" rx="6" ry="6" fill="#475569" />
              <circle cx="22" cy="38" r="4" fill="#fde047" />
            </svg>
          </motion.div>
          <p className="text-xs text-cyan-300 font-bold mt-1">SPARK-E</p>
        </div>

        {/* Sprout */}
        <div className="text-center">
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <svg width="40" height="50" viewBox="0 0 32 40">
              <path d="M 8 32 L 6 40 L 26 40 L 24 32 Z" fill="#92400e" />
              <ellipse cx="16" cy="32" rx="10" ry="4" fill="#78350f" />
              <rect x="14" y="12" width="4" height="22" rx="2" fill="#16a34a" />
              <ellipse cx="8" cy="20" rx="10" ry="6" fill="#22c55e" transform="rotate(-20 8 20)" />
              <ellipse cx="24" cy="16" rx="10" ry="6" fill="#4ade80" transform="rotate(20 24 16)" />
              <ellipse cx="16" cy="34" rx="5" ry="6" fill="#e11d48" />
              <circle cx="14" cy="22" r="1.5" fill="#1e293b" />
              <circle cx="18" cy="22" r="1.5" fill="#1e293b" />
              <path d="M 13 25 Q 16 28 19 25" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </motion.div>
          <p className="text-xs text-green-300 font-bold mt-1">Sprout 🌱</p>
        </div>
      </motion.div>

      {/* Base Selection */}
      <motion.div
        className="w-full max-w-sm"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-center text-slate-400 text-sm mb-3 font-bold">Choose Your Mission Base:</p>
        <div className="grid grid-cols-2 gap-3">
          {Object.values(BASE_TYPES).map(base => (
            <motion.button
              key={base.id}
              onClick={() => { playClick(); setSelected(base.id); }}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                selected === base.id
                  ? 'border-cyan-400 bg-cyan-900/30'
                  : 'border-slate-700 bg-slate-800/60 hover:border-slate-500'
              }`}
              whileTap={{ scale: 0.97 }}
            >
              <div className="text-3xl mb-1">{base.emoji}</div>
              <div className="font-bold text-white text-xs font-orbitron leading-tight">{base.name}</div>
              <div className="text-slate-400 text-xs mt-1">{base.subtitle}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Launch button */}
      <motion.button
        onClick={() => onStart(selected)}
        className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-cyan-500/30 font-orbitron transition-all glow-blue"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        🚀 LAUNCH MISSION!
      </motion.button>

      {/* NASA Badge */}
      <motion.p
        className="text-xs text-slate-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Built for NASA Space Apps Challenge 2024 · Real science from NASA DONKI, OSDR, RadLab & CSA
      </motion.p>
    </div>
  );
}
