import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX, Radio, Film, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

import { selectScenarios, BASE_TYPES } from './data/missionScenarios';
import { toggleMute, getMuted, playClick, playSuccess, playAlarm, playDamage, playVictory, playGameOver } from './utils/sound';

import HabitatStage from './components/HabitatStage';
import MeterBar from './components/MeterBar';
import KidFactPopup from './components/KidFactPopup';
import ScienceModal from './components/ScienceModal';
import VideoModal from './components/VideoModal';
import StartScreen from './components/StartScreen';
import FailureScreen from './components/FailureScreen';
import VictoryScreen from './components/VictoryScreen';

// Initial meter values
const INITIAL_METERS = { power: 75, food: 75, shield: 65 };

// Game phases
const PHASE = {
  START: 'start',
  PLAY: 'play',
  FACT: 'fact',
  FAILURE: 'failure',
  VICTORY: 'victory',
};

export default function App() {
  const [phase, setPhase] = useState(PHASE.START);
  const [baseType, setBaseType] = useState('mars');
  const [scenarios, setScenarios] = useState([]);
  const [currentSolIndex, setCurrentSolIndex] = useState(0);
  const [meters, setMeters] = useState(INITIAL_METERS);
  const [hoverChoice, setHoverChoice] = useState(null);
  const [lastChoice, setLastChoice] = useState(null);
  const [currentFact, setCurrentFact] = useState('');
  const [isMuted, setIsMutedState] = useState(false);
  const [scienceModalOpen, setScienceModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [choiceHistory, setChoiceHistory] = useState([]);
  const [failureReason, setFailureReason] = useState('');

  const currentScenario = scenarios[currentSolIndex];
  const isStormActive = currentScenario?.isStormEvent && true;

  const handleStart = useCallback((selectedBase) => {
    playSuccess();
    const selectedScenarios = selectScenarios();
    setBaseType(selectedBase);
    setScenarios(selectedScenarios);
    setCurrentSolIndex(0);
    setMeters(INITIAL_METERS);
    setChoiceHistory([]);
    setPhase(PHASE.PLAY);
  }, []);

  const handleChoiceSelect = useCallback((choice) => {
    playClick();
    const scenario = scenarios[currentSolIndex];
    if (!scenario) return;

    // Apply effects
    const newMeters = {
      power: Math.max(0, Math.min(100, meters.power + (choice.effects.power || 0))),
      food: Math.max(0, Math.min(100, meters.food + (choice.effects.food || 0))),
      shield: Math.max(0, Math.min(100, meters.shield + (choice.effects.shield || 0))),
    };

    const isDestructive = Object.values(newMeters).some(v => v <= 20);
    if (isDestructive) {
      playDamage();
    } else {
      playSuccess();
    }

    // Check failure
    if (Object.values(newMeters).some(v => v <= 0)) {
      const failed = Object.entries(newMeters).find(([, v]) => v <= 0);
      const names = { power: 'Power ⚡', food: 'Life Support & Food 🌱', shield: 'Radiation Shielding 🛡️' };
      setFailureReason(`${names[failed[0]]} reached zero on Sol ${scenario.sol}!`);
      setMeters(newMeters);
      setLastChoice(choice);
      playGameOver();
      setPhase(PHASE.FAILURE);
      return;
    }

    setMeters(newMeters);
    setLastChoice(choice);
    setChoiceHistory(prev => [...prev, { sol: scenario.sol, scenarioId: scenario.id, choiceId: choice.id, effects: choice.effects }]);

    // Show kid fact popup
    setCurrentFact(scenario.kidFact);
    setPhase(PHASE.FACT);
  }, [scenarios, currentSolIndex, meters]);

  const handleFactClose = useCallback(() => {
    // Check if final sol
    const nextIndex = currentSolIndex + 1;
    if (nextIndex >= scenarios.length) {
      playVictory();
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#a855f7', '#fde047', '#4ade80', '#f97316'],
      });
      setPhase(PHASE.VICTORY);
    } else {
      setCurrentSolIndex(nextIndex);
      setHoverChoice(null);
      setPhase(PHASE.PLAY);

      // Trigger storm sound if next scenario is a storm event
      if (scenarios[nextIndex]?.isStormEvent) {
        setTimeout(() => playAlarm(), 500);
      }
    }
  }, [currentSolIndex, scenarios]);

  const handleRestart = useCallback(() => {
    playClick();
    setPhase(PHASE.START);
    setScenarios([]);
    setCurrentSolIndex(0);
    setMeters(INITIAL_METERS);
    setChoiceHistory([]);
    setHoverChoice(null);
    setLastChoice(null);
  }, []);

  const handleMuteToggle = useCallback(() => {
    const muted = toggleMute();
    setIsMutedState(muted);
    if (!muted) playClick();
  }, []);

  return (
    <div className="min-h-screen bg-space-900 font-nunito scanline">
      {/* Starfield background */}
      <div className="print-hide">
        <StarfieldBG />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 bg-slate-900/90 backdrop-blur-md border-b border-slate-700/50 print-hide">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <span className="font-orbitron font-black text-cyan-300 text-sm hidden sm:block">ARES KIDS</span>
          <span className="font-orbitron text-slate-500 text-xs hidden sm:block">Survival on Sol-7</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Demo Video button */}
          <motion.button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 hover:bg-rose-900/80 transition-colors text-xs font-bold font-orbitron cursor-pointer"
            onClick={() => { playClick(); setVideoModalOpen(true); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Film className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:block">DEMO VIDEO</span>
          </motion.button>

          {/* Telemetry button */}
          {phase !== PHASE.START && (
            <motion.button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/80 transition-colors text-xs font-bold font-orbitron cursor-pointer"
              onClick={() => { playClick(); setScienceModalOpen(true); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:block">NASA TELEMETRY</span>
              <span className="sm:hidden">📡</span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-400"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.button>
          )}

          {/* Mute button */}
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-14 pb-6 px-4 max-w-2xl mx-auto min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {phase === PHASE.START && (
            <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StartScreen onStart={handleStart} onOpenDemo={() => setVideoModalOpen(true)} />
            </motion.div>
          )}

          {(phase === PHASE.PLAY || phase === PHASE.FACT) && currentScenario && (
            <motion.div
              key={`play-${currentSolIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-4 flex-1"
            >
              {/* Sol Counter */}
              <div className="flex items-center justify-between mt-2">
                <div className="font-orbitron font-black text-2xl text-white">
                  SOL <span className="text-cyan-400">{currentScenario.sol}</span>
                  <span className="text-slate-500 text-sm ml-2">/ 7</span>
                </div>
                <div className="flex gap-1">
                  {scenarios.map((s, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full border ${
                      i < currentSolIndex ? 'bg-cyan-400 border-cyan-400' :
                      i === currentSolIndex ? 'bg-yellow-400 border-yellow-400 animate-pulse' :
                      'bg-transparent border-slate-600'
                    }`} />
                  ))}
                </div>
              </div>

              {/* Meters */}
              <div className="bg-slate-900/80 rounded-2xl border border-slate-700/40 p-3 space-y-2">
                {[
                  { key: 'power', label: 'POWER', emoji: '⚡', colorClass: 'bg-gradient-to-r from-yellow-500 to-amber-400' },
                  { key: 'food', label: 'LIFE SUPPORT', emoji: '🌱', colorClass: 'bg-gradient-to-r from-green-500 to-emerald-400' },
                  { key: 'shield', label: 'SHIELDING', emoji: '🛡️', colorClass: 'bg-gradient-to-r from-purple-500 to-violet-400' },
                ].map(m => (
                  <MeterBar
                    key={m.key}
                    label={m.label}
                    emoji={m.emoji}
                    value={meters[m.key]}
                    previewDelta={hoverChoice?.effects?.[m.key] ?? null}
                    colorClass={m.colorClass}
                  />
                ))}
              </div>

              {/* Habitat Stage */}
              <HabitatStage
                meters={meters}
                isStormActive={isStormActive}
                hoverChoice={hoverChoice}
                baseType={baseType}
              />

              {/* Scenario Card */}
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{currentScenario.emoji}</span>
                  <div>
                    <h2 className="font-orbitron font-black text-white text-base">{currentScenario.title}</h2>
                    <a href={currentScenario.scienceLink} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-200 transition-colors font-semibold">
                      📡 {currentScenario.scienceContext} ↗
                    </a>
                  </div>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">{currentScenario.description}</p>
              </div>

              {/* Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentScenario.choices.map((choice) => (
                  <ChoiceCard
                    key={choice.id}
                    choice={choice}
                    onHover={setHoverChoice}
                    onSelect={handleChoiceSelect}
                    disabled={phase === PHASE.FACT}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === PHASE.FAILURE && (
            <motion.div key="failure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <FailureScreen
                scenario={currentScenario}
                meters={meters}
                failureReason={failureReason}
                choiceHistory={choiceHistory}
                onRestart={handleRestart}
              />
            </motion.div>
          )}

          {phase === PHASE.VICTORY && (
            <motion.div key="victory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <VictoryScreen
                meters={meters}
                choiceHistory={choiceHistory}
                baseType={baseType}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Kid Fact Popup */}
      <KidFactPopup
        isOpen={phase === PHASE.FACT}
        fact={currentFact}
        onClose={handleFactClose}
      />

      {/* Science Modal */}
      <ScienceModal
        isOpen={scienceModalOpen}
        onClose={() => setScienceModalOpen(false)}
      />

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

      {/* AI Watermark in Left Corner */}
      <div className="fixed bottom-3 left-3 z-30 print-hide pointer-events-auto">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-cyan-500/40 shadow-lg text-[10px] font-orbitron font-bold text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-all cursor-default select-none group">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>POWERED BY AI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>
      </div>
    </div>
  );
}

// Inline ChoiceCard component
function ChoiceCard({ choice, onHover, onSelect, disabled }) {
  return (
    <motion.button
      className={`text-left bg-slate-800/80 border-2 ${disabled ? 'border-slate-700/40 opacity-60 cursor-not-allowed' : 'border-slate-600/60 hover:border-cyan-500/60 cursor-pointer'} rounded-2xl p-4 transition-all card-hover`}
      onHoverStart={() => !disabled && onHover(choice)}
      onHoverEnd={() => onHover(null)}
      onTouchStart={() => !disabled && onHover(choice)}
      onClick={() => !disabled && onSelect(choice)}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
    >
      {/* Emoji + Title */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">{choice.emoji}</span>
        <div>
          <h3 className="font-orbitron font-black text-white text-sm">{choice.title}</h3>
          <p className="text-xs text-slate-300 font-medium">{choice.subtext}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-200 text-xs mb-3 leading-relaxed">{choice.description}</p>

      {/* Effect badges */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { key: 'power', emoji: '⚡', value: choice.effects.power },
          { key: 'food', emoji: '🌱', value: choice.effects.food },
          { key: 'shield', emoji: '🛡️', value: choice.effects.shield },
        ].filter(e => e.value !== 0).map(e => (
          <span
            key={e.key}
            className={`text-xs font-bold px-2 py-0.5 rounded-full border font-orbitron ${
              e.value > 0
                ? 'bg-green-900/60 border-green-500/40 text-green-300'
                : 'bg-red-900/60 border-red-500/40 text-red-300'
            }`}
          >
            {e.emoji} {e.value > 0 ? `+${e.value}` : e.value}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

// Inline Starfield background
function StarfieldBG() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.1,
    delay: Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 0.3, star.opacity] }}
          transition={{ duration: 2 + star.delay, repeat: Infinity, delay: star.delay }}
        />
      ))}
    </div>
  );
}
