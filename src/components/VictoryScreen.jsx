import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Printer, CheckCircle2, Sparkles, User, RefreshCw, ExternalLink } from 'lucide-react';
import { NASA_RESOURCES } from '../services/nasaService';
import { playClick } from '../utils/sound';

function OfficialCertificate({ meters, baseType, commanderName }) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const baseName = baseType === 'mars' ? 'Mars — Jezero Crater Outpost' : 'Moon — Artemis Base Camp';
  const coords = baseType === 'mars' ? '10.195°N, -1.406°E (NASA Perseverance Landing Site)' : '89.9°S, 0.0°E (Artemis Shackleton Crater)';

  // Calculate rank based on average meter score
  const avg = Math.round((meters.power + meters.food + meters.shield) / 3);
  const rank =
    avg >= 70
      ? { title: 'CHIEF EXPEDITION COMMANDER', tier: 'Top Tier Mission Rating 🌟' }
      : avg >= 45
      ? { title: 'SENIOR HABITAT FLIGHT DIRECTOR', tier: 'Exemplary Survival Rating 🚀' }
      : { title: 'CERTIFIED SOL-7 MISSION ASTRONAUT', tier: 'Mission Accomplished Tier 👨‍🚀' };

  return (
    <div className="w-full max-w-2xl mx-auto my-2">
      {/* Outer Certificate Box with id for single-page print */}
      <div
        id="printable-certificate"
        className="relative rounded-2xl border-4 border-amber-400 p-5 md:p-6 bg-slate-900 text-white shadow-2xl"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-2 left-2 text-amber-400 text-sm font-mono select-none font-bold">╔══</div>
        <div className="absolute top-2 right-2 text-amber-400 text-sm font-mono select-none font-bold">══╗</div>
        <div className="absolute bottom-2 left-2 text-amber-400 text-sm font-mono select-none font-bold">╚══</div>
        <div className="absolute bottom-2 right-2 text-amber-400 text-sm font-mono select-none font-bold">══╝</div>

        {/* Certificate Header Banner */}
        <div className="text-center border-b-2 border-amber-400/80 pb-2.5 mb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">🛰️</span>
            <span className="font-orbitron font-black text-amber-300 text-sm md:text-base tracking-widest cert-gold uppercase">
              NASA SPACE APPS CHALLENGE 2024
            </span>
            <span className="text-2xl">🍁</span>
          </div>
          <h2 className="font-orbitron font-black text-white text-xl md:text-2xl cert-title tracking-wide uppercase">
            Diploma of Planetary Survival
          </h2>
          <p className="text-xs text-cyan-300 font-orbitron cert-gold font-bold tracking-wider mt-0.5">
            ARES KIDS: HABITAT AUTONOMY & LIFE SUPPORT ENGINEERING
          </p>
        </div>

        {/* Recipient Section */}
        <div className="text-center my-2">
          <p className="text-xs md:text-sm text-slate-200 cert-dark-text font-bold uppercase tracking-wider">
            This official credential certifies that
          </p>
          <div className="my-1.5 py-1 px-6 inline-block border-b-3 border-amber-400 min-w-[280px]">
            <span className="font-orbitron font-black text-2xl md:text-3xl text-cyan-300 cert-recipient tracking-wide">
              {commanderName || 'Commander Alex'}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-100 cert-dark-text mt-1 max-w-lg mx-auto font-medium leading-snug">
            has successfully surmounted all biological, solar storm, and engineering crises through{' '}
            <strong className="text-amber-300 cert-gold font-orbitron font-black">7 full Sol cycles</strong> at:
          </p>
          <div className="mt-1 font-orbitron font-black text-sm md:text-base text-yellow-300 cert-gold">
            {baseName}
          </div>
          <div className="text-xs text-slate-300 cert-muted font-mono font-semibold">{coords}</div>
        </div>

        {/* Rank Badge */}
        <div className="my-2 py-1.5 px-4 rounded-xl bg-amber-950/40 border-2 border-amber-400/60 text-center cert-box">
          <span className="text-xs text-amber-300 cert-gold font-bold block font-orbitron uppercase tracking-wider">
            Conferred Spaceflight Rank:
          </span>
          <span className="font-orbitron font-black text-base md:text-lg text-yellow-300 cert-title">
            {rank.title}
          </span>
          <span className="text-xs text-emerald-300 cert-dark-text font-bold block mt-0.5">{rank.tier}</span>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="my-2.5">
          <div className="text-xs text-slate-200 cert-dark-text font-orbitron font-black uppercase mb-1.5 text-center tracking-wider">
            Final Sol-7 Telemetry Health Records
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Power Reserves', emoji: '⚡', val: meters.power, note: 'Solar & Nuclear RTG' },
              { label: 'Closed-Loop Food/O₂', emoji: '🌱', val: meters.food, note: 'OSD-379 Radishes' },
              { label: 'Radiation Shielding', emoji: '🛡️', val: meters.shield, note: 'RadLab Telemetry' },
            ].map(m => (
              <div
                key={m.label}
                className="cert-box bg-slate-800/90 border border-slate-600 rounded-xl p-2 text-center"
              >
                <div className="text-base">{m.emoji}</div>
                <div className="font-orbitron font-black text-lg md:text-xl cert-stat-val text-cyan-300">
                  {Math.round(m.val)}%
                </div>
                <div className="text-xs font-bold text-white cert-dark-text truncate">{m.label}</div>
                <div className="text-[10px] text-slate-300 cert-muted truncate font-medium">{m.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certified Competencies Checklist */}
        <div className="my-2 p-2.5 rounded-xl bg-slate-800/80 border border-slate-600 cert-box">
          <div className="text-xs font-orbitron font-black text-amber-300 cert-gold uppercase mb-1 text-center sm:text-left">
            Aerospace STEM Competencies Verified:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-100 cert-dark-text font-semibold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span>NASA DONKI Space Weather Storm Mitigation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span>Closed-Loop Hydroponics (OSDR Study OSD-379)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span>Mars Dosimetry Handling (NASA RadLab ~0.7 mSv)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span>20-Minute Deep Space Radio Lag Autonomy</span>
            </div>
          </div>
        </div>

        {/* Signatures & Seal Section */}
        <div className="mt-3 pt-2.5 border-t-2 border-amber-400/60 flex items-end justify-between gap-2">
          {/* Maya Signature */}
          <div className="text-center flex-1">
            <div className="h-7 flex items-center justify-center font-serif italic text-cyan-300 cert-recipient text-base font-bold select-none">
              Commander Maya
            </div>
            <div className="border-t border-slate-400 pt-0.5 text-xs text-slate-200 cert-dark-text font-orbitron font-bold">
              Expedition Commander
            </div>
          </div>

          {/* Golden Seal SVG */}
          <div className="flex-shrink-0 text-center px-2">
            <svg width="54" height="54" viewBox="0 0 100 100" className="inline-block">
              <circle cx="50" cy="50" r="46" fill="#f59e0b" stroke="#78350f" strokeWidth="3" />
              <circle cx="50" cy="50" r="40" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" />
              <polygon
                points="50,18 57,35 76,35 61,46 67,64 50,53 33,64 39,46 24,35 43,35"
                fill="#b45309"
              />
              <circle cx="50" cy="50" r="22" fill="#78350f" />
              <text x="50" y="47" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                NASA
              </text>
              <text x="50" y="58" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="monospace" fontWeight="bold">
                SOL-7
              </text>
            </svg>
            <div className="text-[9px] font-mono text-amber-300 cert-gold font-bold mt-0.5">OFFICIAL SEAL</div>
          </div>

          {/* SPARK-E Signature */}
          <div className="text-center flex-1">
            <div className="h-7 flex items-center justify-center font-mono text-cyan-300 cert-recipient text-sm font-black select-none">
              SPARK-E [v2.4]
            </div>
            <div className="border-t border-slate-400 pt-0.5 text-xs text-slate-200 cert-dark-text font-orbitron font-bold">
              Autonomous Habitat AI
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex justify-between items-center text-[10px] text-slate-300 cert-dark-text font-mono mt-2.5 pt-1.5 border-t border-slate-700">
          <span className="font-semibold">Date: {date}</span>
          <span className="font-bold text-amber-300 cert-gold">ID: ARES-SOL7-JEZERO-2024</span>
          <span className="font-semibold">NASA Space Apps Verified</span>
        </div>
      </div>
    </div>
  );
}

export default function VictoryScreen({ meters, choiceHistory, baseType, onRestart }) {
  const [commanderName, setCommanderName] = useState('Commander Maya');
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    // Confetti celebration bursts
    const fire = opts => confetti({ ...opts, particleCount: 70, spread: 90, origin: { y: 0.6 } });
    fire({ colors: ['#38bdf8', '#a855f7', '#fde047'] });
    setTimeout(() => fire({ colors: ['#4ade80', '#f97316'], origin: { x: 0.25, y: 0.6 } }), 350);
    setTimeout(() => fire({ colors: ['#38bdf8', '#f43f5e'], origin: { x: 0.75, y: 0.6 } }), 700);
  }, []);

  const handlePrint = () => {
    playClick();
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      {/* Victory Header (hidden on print) */}
      <motion.div
        className="text-center print-hide"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
      >
        <motion.div
          className="text-6xl mb-2 inline-block"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        >
          🏆
        </motion.div>
        <h1 className="font-orbitron font-black text-3xl md:text-4xl text-yellow-400 leading-tight">
          MISSION ACCOMPLISHED!
        </h1>
        <p className="text-cyan-300 text-sm mt-1 font-bold">
          All 7 Sols survived. Supply rocket docked safely! 🚀
        </p>
      </motion.div>

      {/* Name Input Toolbar (hidden on print) */}
      <motion.div
        className="w-full max-w-2xl bg-slate-800/90 border border-slate-600 rounded-2xl p-4 print-hide shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="w-full sm:w-auto flex-1">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-200 font-orbitron mb-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Personalize Your Certificate Name:</span>
            </label>
            <input
              type="text"
              value={commanderName}
              onChange={e => setCommanderName(e.target.value)}
              placeholder="e.g. Commander Maya, Alex, John..."
              maxLength={30}
              className="w-full bg-slate-900 border border-cyan-400 rounded-xl px-3 py-2 text-sm text-cyan-200 font-orbitron font-bold focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <motion.button
            onClick={handlePrint}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl font-orbitron shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Printer className="w-4 h-4" />
            <span>PRINT 1-PAGE CERTIFICATE</span>
          </motion.button>
        </div>
        <p className="text-xs text-slate-300 mt-2 text-center sm:text-left font-medium">
          💡 Click <strong>Print 1-Page Certificate</strong> to output a crisp, high-contrast, single-page award!
        </p>
      </motion.div>

      {/* The Printable Certificate */}
      <motion.div
        className="w-full"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <OfficialCertificate meters={meters} baseType={baseType} commanderName={commanderName} />
      </motion.div>

      {/* Complete 7-Sol Mission Log (hidden on print) */}
      {choiceHistory.length > 0 && (
        <motion.div
          className="w-full max-w-2xl print-hide"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-slate-800/70 rounded-2xl border border-slate-700 p-4">
            <h4 className="font-orbitron font-bold text-xs text-slate-300 mb-2.5 flex items-center gap-1.5">
              <span>📋</span>
              <span>COMPLETE 7-SOL DECISION TELEMETRY LOG:</span>
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {choiceHistory.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-900/80 rounded-lg px-3 py-1.5 text-xs"
                >
                  <span className="text-cyan-400 font-orbitron font-bold">Sol {entry.sol}</span>
                  <span className="text-slate-200 font-medium capitalize">
                    {entry.scenarioId.replace(/-/g, ' ')}
                  </span>
                  <div className="flex gap-1.5">
                    {Object.entries(entry.effects)
                      .filter(([, v]) => v !== 0)
                      .map(([k, v]) => (
                        <span
                          key={k}
                          className={`font-bold font-orbitron ${
                            v > 0 ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {v > 0 ? '+' : ''}
                          {v}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Official NASA Science Verification Links (hidden on print) */}
      <motion.div
        className="w-full max-w-2xl bg-slate-800/70 rounded-2xl border border-cyan-500/30 p-4 print-hide"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-orbitron font-bold text-xs text-cyan-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VERIFY THE REAL SCIENCE BEHIND YOUR 7-SOL DECISIONS:</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {NASA_RESOURCES.slice(0, 4).map(resource => (
            <a
              key={resource.label}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700/90 rounded-xl p-2.5 text-xs text-slate-200 hover:text-cyan-300 transition-colors border border-slate-600 hover:border-cyan-400"
            >
              <span className="text-base">{resource.badge}</span>
              <span className="truncate font-semibold">{resource.label}</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Play Again (hidden on print) */}
      <motion.div
        className="flex gap-3 print-hide"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={() => {
            playClick();
            onRestart();
          }}
          className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-base rounded-2xl font-orbitron shadow-lg glow-blue transition-all cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <RefreshCw className="w-4 h-4" />
          <span>PLAY AGAIN (NEW MISSION)</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
