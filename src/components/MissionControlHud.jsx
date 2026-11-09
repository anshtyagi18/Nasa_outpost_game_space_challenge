import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Wind,
  ShieldCheck,
  Sprout,
  AlertTriangle,
  Volume2,
  VolumeX,
  History,
  Radio,
  Trophy,
  RotateCcw,
  Sparkles,
  BrainCircuit,
  Flame,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import sound from '../engine/soundFx.js'
import { fireCelebration, fireSolComplete, fireVictorySol10 } from '../engine/Celebration.js'
import { calculateScore } from '../engine/GameEngine.js'

// ─── Telemetry Resource Pill Config ─────────────────────────────────────

const GAUGES = [
  {
    key: 'power',
    label: 'Power',
    emoji: '⚡',
    icon: Zap,
    color: 'from-amber-400 to-yellow-500',
    barBg: 'bg-sol-gold',
    textColor: 'text-sol-gold',
    borderColor: 'border-sol-gold/40',
  },
  {
    key: 'oxygen',
    label: 'Oxygen',
    emoji: '💨',
    icon: Wind,
    color: 'from-cyan-400 to-blue-500',
    barBg: 'bg-shield-cyan',
    textColor: 'text-shield-cyan',
    borderColor: 'border-shield-cyan/40',
  },
  {
    key: 'shields',
    label: 'Shields',
    emoji: '🛡️',
    icon: ShieldCheck,
    color: 'from-emerald-400 to-green-500',
    barBg: 'bg-life-green',
    textColor: 'text-life-green',
    borderColor: 'border-life-green/40',
  },
  {
    key: 'food',
    label: 'Food / Bio',
    emoji: '🌱',
    icon: Sprout,
    color: 'from-orange-400 to-amber-500',
    barBg: 'bg-mars-orange',
    textColor: 'text-mars-orange',
    borderColor: 'border-mars-orange/40',
  },
]

export default function MissionControlHud({
  state,
  startSol,
  makeChoice,
  nextSol,
  resetGame,
  onOpenArchive,
  onOpenScience,
}) {
  const [muted, setMuted] = useState(sound.isMuted())
  const [alarmPlayed, setAlarmPlayed] = useState(false)

  const {
    sol,
    phase,
    resources,
    currentEvent,
    currentChoice,
    history,
    gameOverDebrief,
  } = state

  const isCritical = Object.values(resources).some((v) => v <= 25)

  useEffect(() => {
    if (isCritical && !alarmPlayed && phase !== 'game_over') {
      sound.playAlarm()
      setAlarmPlayed(true)
    } else if (!isCritical) {
      setAlarmPlayed(false)
    }
  }, [isCritical, alarmPlayed, phase])

  useEffect(() => {
    if (phase === 'game_over') {
      sound.playGameOver()
    } else if (phase === 'victory') {
      sound.playVictory()
      fireVictorySol10()
    }
  }, [phase])

  const toggleSound = () => {
    const isNowMuted = sound.toggleMute()
    setMuted(isNowMuted)
    if (!isNowMuted) sound.playClick()
  }

  const handleStartSol = () => {
    sound.playClick()
    startSol()
  }

  const handleSelectChoice = (choiceId) => {
    sound.playDecision()
    fireCelebration()
    makeChoice(choiceId)
  }

  const handleNextSol = () => {
    sound.playNextSol()
    fireSolComplete()
    nextSol()
  }

  const handleRestart = () => {
    sound.playClick()
    resetGame()
  }

  const scoreData = phase === 'victory' ? calculateScore(state) : null

  return (
    <div className="w-full h-full flex flex-col justify-between pointer-events-none select-none">
      {/* ── Top Flight Deck Ribbon ────────────────────────────────────── */}
      <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 rounded-2xl bg-space-deep/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Brand & Sol Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-nasa-blue/40 border border-shield-cyan/40">
            <Radio className="w-4 h-4 text-shield-cyan animate-pulse" />
            <span className="font-display text-sm sm:text-base tracking-widest text-starfield font-bold">
              SOL {sol}
            </span>
            <span className="font-mono text-xs text-starfield/60">/ 10</span>
          </div>

          <div className="hidden lg:block">
            <h1 className="font-display text-xs tracking-widest text-starfield/90 uppercase font-bold">
              OUTPOST SOL-1
            </h1>
            <p className="font-mono text-[10px] text-shield-cyan/80">
              NASA Deep Space Mission Control
            </p>
          </div>
        </div>

        {/* 4 Compact Telemetry Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {GAUGES.map(({ key, label, emoji, barBg, textColor, borderColor }) => {
            const val = Math.round(resources[key] ?? 0)
            const isDanger = val <= 15
            const isWarn = val <= 30 && !isDanger

            return (
              <div
                key={key}
                className={`px-3 py-1.5 rounded-xl bg-space-black/60 border ${
                  isDanger
                    ? 'border-alert-red shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse'
                    : isWarn
                    ? 'border-sol-gold/60'
                    : borderColor
                } flex flex-col min-w-[90px] sm:min-w-[105px]`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="flex items-center gap-1 font-mono text-starfield/80">
                    <span>{emoji}</span>
                    <span className="hidden sm:inline">{label}</span>
                  </span>
                  <span className={`font-mono font-bold ${isDanger ? 'text-alert-red animate-pulse' : textColor}`}>
                    {val}%
                  </span>
                </div>
                {/* Gauge bar */}
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barBg} transition-all duration-500`}
                    style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mission Science Dossier Floating Button */}
          {currentEvent && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sound.playClick()
                onOpenScience()
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs
                         bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-shield-cyan/60
                         text-shield-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-shield-cyan
                         transition-all cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-shield-cyan animate-pulse" />
              <span className="font-bold">🧠 Science Dossier</span>
            </motion.button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-space-black/60 border border-white/10 text-starfield/70 hover:text-starfield hover:border-sol-gold transition-colors cursor-pointer"
            aria-label={muted ? 'Unmute' : 'Mute'}
            title={muted ? 'Sound Muted' : 'Sound Active'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-alert-red" /> : <Volume2 className="w-4 h-4 text-life-green" />}
          </button>

          {/* Mission Archive */}
          <button
            onClick={() => {
              sound.playClick()
              onOpenArchive()
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs bg-space-black/60 border border-white/10 hover:border-nasa-blue text-starfield/80 hover:text-starfield transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-shield-cyan" />
            <span className="hidden sm:inline">Log</span>
            {history.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-sol-gold/20 text-sol-gold text-[10px] font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── Center Action Deck: Arcade Card UX ────────────────────────── */}
      <div className="pointer-events-auto w-full max-w-4xl mx-auto my-auto px-4 py-4">
        {/* Phase 1: Sol Transmission Briefing */}
        {phase === 'briefing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="p-6 sm:p-8 rounded-3xl bg-space-deep/90 backdrop-blur-2xl border border-shield-cyan/50 shadow-[0_0_60px_rgba(6,182,212,0.25)] text-center max-w-xl mx-auto"
          >
            <div className="inline-flex p-4 rounded-3xl bg-shield-cyan/20 border border-shield-cyan/40 text-shield-cyan mb-4 animate-bounce">
              <Radio className="w-8 h-8" />
            </div>

            <h2 className="font-display text-xl sm:text-2xl text-starfield font-bold tracking-widest uppercase mb-2">
              Sol {sol} Telemetry Feed
            </h2>
            <p className="font-mono text-xs sm:text-sm text-starfield/80 mb-6 leading-relaxed">
              NASA satellites detect new space weather approaching. Review telemetry sensors and deploy outpost orders!
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartSol}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-display text-sm tracking-widest uppercase
                         bg-gradient-to-r from-shield-cyan via-sky-500 to-blue-600 text-space-black font-extrabold
                         shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]
                         transition-all cursor-pointer"
            >
              🚀 Analyze & Deploy Orders (Sol {sol})
            </motion.button>
          </motion.div>
        )}

        {/* Phase 2: Dynamic NASA Arcade Incident Card */}
        {phase === 'event' && currentEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Top Prompt Banner (Punchy 2-sentence alert for Kids) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-space-deep/90 backdrop-blur-xl border border-white/15 shadow-2xl text-center relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-sol-gold/20 text-sol-gold font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-nasa-red" />
                  HAZARD LEVEL {currentEvent.hazardLevel}/5
                </span>

                <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-nasa-blue/40 text-shield-cyan border border-shield-cyan/30">
                  {currentEvent.sourceDataset}
                </span>
              </div>

              {/* Event Title */}
              <h2 className="font-display text-lg sm:text-2xl font-black text-starfield tracking-wide mb-1 text-glow">
                {currentEvent.title}
              </h2>

              {/* Punchy 2-sentence scenario description */}
              <p className="font-mono text-xs sm:text-sm text-starfield/90 max-w-2xl mx-auto leading-relaxed">
                {currentEvent.scenarioDescription}
              </p>
            </div>

            {/* Two Big Glowing Arcade Decision Cards (Reigns / Tinder Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentEvent.choices.map((choice, idx) => {
                const isFirst = idx === 0
                const themeBorder = isFirst
                  ? 'border-shield-cyan shadow-[0_0_30px_rgba(6,182,212,0.35)]'
                  : 'border-sol-gold shadow-[0_0_30px_rgba(251,191,36,0.35)]'
                const themeGlow = isFirst ? 'text-shield-cyan' : 'text-sol-gold'

                return (
                  <motion.button
                    key={choice.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`p-5 sm:p-6 rounded-3xl bg-space-deep/90 backdrop-blur-xl border-2 ${themeBorder}
                                flex flex-col justify-between text-left transition-all duration-200 cursor-pointer group relative overflow-hidden`}
                  >
                    <div>
                      {/* Badge / Choice Index */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`font-display text-xs tracking-widest font-black uppercase ${themeGlow}`}>
                          OPTION {isFirst ? 'A' : 'B'}
                        </span>
                        <span className="font-mono text-[10px] text-starfield/40 uppercase tracking-widest">
                          TAP TO EXECUTE
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-base sm:text-lg font-bold text-starfield group-hover:text-glow mb-2">
                        {choice.label}
                      </h3>

                      {/* Short Description */}
                      <p className="font-mono text-xs text-starfield/80 leading-relaxed mb-4">
                        {choice.description}
                      </p>
                    </div>

                    {/* Prominent Resource Gain / Cost Pills */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap gap-2">
                      {Object.entries(choice.effects).map(([res, val]) => {
                        if (val === 0) return null
                        const isPos = val > 0
                        const emoji = res === 'power' ? '⚡' : res === 'oxygen' ? '💨' : res === 'shields' ? '🛡️' : '🌱'
                        const label = res.charAt(0).toUpperCase() + res.slice(1)
                        return (
                          <span
                            key={res}
                            className={`font-mono text-xs px-3 py-1 rounded-xl font-bold flex items-center gap-1 ${
                              isPos
                                ? 'bg-life-green/20 text-life-green border border-life-green/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                                : 'bg-alert-red/20 text-alert-red border border-alert-red/40 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{isPos ? `+${val}%` : `${val}%`}</span>
                            <span className="text-[10px] uppercase opacity-75">{label}</span>
                          </span>
                        )
                      })}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Phase 3: Choice Made & Result Confirmation */}
        {phase === 'choice_made' && currentChoice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-7 rounded-3xl bg-space-deep/95 backdrop-blur-2xl border border-life-green/50 shadow-[0_0_50px_rgba(34,197,94,0.3)] max-w-xl mx-auto space-y-4 text-center"
          >
            <div className="inline-flex p-3 rounded-2xl bg-life-green/20 text-life-green mb-1">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-starfield">
              Orders Executed: {currentChoice.label}
            </h3>

            <p className="font-mono text-xs sm:text-sm text-starfield/90 leading-relaxed p-3.5 rounded-2xl bg-space-black/60 border border-white/5">
              {currentChoice.outcomeText}
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleNextSol}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl font-display text-xs sm:text-sm tracking-widest uppercase
                         bg-gradient-to-r from-life-green to-emerald-600 text-space-black font-extrabold
                         shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all cursor-pointer"
            >
              Confirm Orders & Advance to Sol {sol + 1} 🚀
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* ── Bottom Flight Bar: Status & Hint ─────────────────────────── */}
      <footer className="pointer-events-auto px-4 sm:px-6 py-2.5 rounded-2xl bg-space-deep/80 backdrop-blur-xl border border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-starfield/60">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-life-green animate-pulse" />
          Interactive 3D Sector: Drag or rotate Mars with mouse/touch
        </span>
        <span className="hidden sm:inline text-starfield/40">
          Target: Survive 10 Sols
        </span>
      </footer>

      {/* ── Game Over Educational Debrief Modal ──────────────────────── */}
      <AnimatePresence>
        {phase === 'game_over' && gameOverDebrief && (
          <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-space-deep border border-alert-red shadow-[0_0_50px_rgba(239,68,68,0.4)] text-starfield space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-alert-red/30 pb-3">
                <div className="p-3 rounded-2xl bg-alert-red/20 text-alert-red">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-alert-red">
                    {gameOverDebrief.title}
                  </h2>
                  <p className="font-mono text-xs text-starfield/60">
                    Mission Terminated on Sol {gameOverDebrief.failedOnSol} • Sols Survived: {gameOverDebrief.totalSolsSurvived}
                  </p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs text-starfield/90">
                <div className="p-3 rounded-2xl bg-space-black/60 border border-white/5">
                  <p className="font-bold text-sol-gold mb-1">🔍 Mission Failure Root Cause:</p>
                  <p className="leading-relaxed text-starfield/80">{gameOverDebrief.explanation}</p>
                </div>

                <div className="p-3 rounded-2xl bg-nasa-blue/20 border border-nasa-blue/30">
                  <p className="font-bold text-shield-cyan mb-1">🚀 Real NASA Space Lesson:</p>
                  <p className="leading-relaxed text-starfield/80">{gameOverDebrief.nasaLesson}</p>
                </div>

                <div className="p-3 rounded-2xl bg-life-green/10 border border-life-green/30">
                  <p className="font-bold text-life-green mb-1">💡 Flight Director Retry Advice:</p>
                  <p className="leading-relaxed text-starfield/80">{gameOverDebrief.retryTip}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    sound.playClick()
                    onOpenArchive()
                  }}
                  className="px-4 py-2 rounded-xl font-mono text-xs bg-space-black border border-white/10 hover:border-sol-gold text-starfield transition-colors cursor-pointer"
                >
                  📜 Review Decision Archive
                </button>

                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl font-display text-xs tracking-wider uppercase
                             bg-gradient-to-r from-nasa-blue to-shield-cyan text-starfield font-bold
                             shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-102 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again (Sol 1)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Victory Celebration Modal (Sol 10 Survived) ───────────────── */}
      <AnimatePresence>
        {phase === 'victory' && scoreData && (
          <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-space-deep border-2 border-sol-gold shadow-[0_0_60px_rgba(251,191,36,0.4)] text-starfield text-center space-y-4"
            >
              <div className="inline-flex p-4 rounded-3xl bg-sol-gold/20 text-sol-gold mb-1 animate-bounce">
                <Trophy className="w-12 h-12" />
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sol-gold tracking-widest text-glow">
                MISSION ACCOMPLISHED!
              </h2>

              <p className="font-mono text-xs sm:text-sm text-starfield/80 max-w-md mx-auto leading-relaxed">
                Outstanding leadership, Commander! You survived all 10 Martian sols, navigating space storms and keeping Outpost Sol-1 fully operational!
              </p>

              <div className="p-4 rounded-2xl bg-space-black/70 border border-sol-gold/40 space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-starfield/60">
                  NASA Flight Evaluation Rank
                </span>
                <p className="font-display text-xl sm:text-2xl text-shield-cyan font-bold">
                  {scoreData.grade}
                </p>
                <p className="font-mono text-3xl font-extrabold text-sol-gold">
                  {scoreData.score} PTS
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    sound.playClick()
                    onOpenArchive()
                  }}
                  className="px-5 py-2.5 rounded-xl font-mono text-xs bg-space-black border border-white/20 hover:border-sol-gold text-starfield transition-colors cursor-pointer"
                >
                  📜 View Flight Archive
                </button>

                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl font-display text-xs tracking-wider uppercase
                             bg-gradient-to-r from-sol-gold to-amber-500 text-space-black font-extrabold
                             shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:scale-102 transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Launch Another Mission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
