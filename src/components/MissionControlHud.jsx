import { useState, useEffect } from 'react'
import {
  Zap,
  Wind,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  History,
  Radio,
  Satellite,
  Compass,
  Trophy,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  Info,
} from 'lucide-react'
import sound from '../engine/soundFx.js'
import { fireCelebration, fireSolComplete, fireVictorySol10 } from '../engine/Celebration.js'
import { calculateScore } from '../engine/GameEngine.js'

// ─── Resource Telemetry Configuration ───────────────────────────────────

const GAUGES = [
  {
    key: 'power',
    label: 'Power Grid',
    unit: '%',
    emoji: '⚡',
    icon: Zap,
    color: 'from-amber-400 to-yellow-500',
    barBg: 'bg-sol-gold',
    textColor: 'text-sol-gold',
    borderNormal: 'border-sol-gold/30',
  },
  {
    key: 'oxygen',
    label: 'Life Support O₂',
    unit: '%',
    emoji: '💨',
    icon: Wind,
    color: 'from-cyan-400 to-blue-500',
    barBg: 'bg-shield-cyan',
    textColor: 'text-shield-cyan',
    borderNormal: 'border-shield-cyan/30',
  },
  {
    key: 'shields',
    label: 'Rad Shielding',
    unit: '%',
    emoji: '🛡️',
    icon: ShieldCheck,
    color: 'from-emerald-400 to-green-500',
    barBg: 'bg-life-green',
    textColor: 'text-life-green',
    borderNormal: 'border-life-green/30',
  },
  {
    key: 'food',
    label: 'Biomass / Food',
    unit: '%',
    emoji: '🌱',
    icon: Sprout,
    color: 'from-orange-400 to-amber-500',
    barBg: 'bg-mars-orange',
    textColor: 'text-mars-orange',
    borderNormal: 'border-mars-orange/30',
  },
]

/**
 * Artemis Mission Control HUD
 */
export default function MissionControlHud({
  state,
  startSol,
  makeChoice,
  nextSol,
  resetGame,
  onOpenArchive,
}) {
  const [scienceExpanded, setScienceExpanded] = useState(false)
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

  // Check critical alarm threshold (< 30% on power or shields or o2)
  const isCritical = Object.values(resources).some((v) => v <= 25)

  useEffect(() => {
    if (isCritical && !alarmPlayed && phase !== 'game_over') {
      sound.playAlarm()
      setAlarmPlayed(true)
    } else if (!isCritical) {
      setAlarmPlayed(false)
    }
  }, [isCritical, alarmPlayed, phase])

  // Play audio and trigger celebration on game over or victory
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
    setScienceExpanded(false)
    nextSol()
  }

  const handleRestart = () => {
    sound.playClick()
    resetGame()
  }

  const scoreData = phase === 'victory' ? calculateScore(state) : null

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* ── Top Flight Deck Ribbon ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-space-deep/90 border border-nasa-blue/40 backdrop-blur-md">
        {/* Sol Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-nasa-blue/40 border border-shield-cyan/30">
            <Radio className="w-4 h-4 text-shield-cyan animate-pulse" />
            <span className="font-display text-sm tracking-wider text-starfield font-bold">
              SOL {sol}
            </span>
            <span className="font-mono text-xs text-starfield/60">/ 10</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-starfield/70">
            <Satellite className="w-3.5 h-3.5 text-sol-gold" />
            <span>Telemetry Link: ONLINE</span>
          </div>
        </div>

        {/* Action Controls: Sound & Archive Drawer */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                       bg-space-black/50 border border-white/10 hover:border-sol-gold/50 text-starfield/80
                       hover:text-sol-gold transition-colors cursor-pointer"
            aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
            title={muted ? 'Sound Muted' : 'Sound Active'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-alert-red" /> : <Volume2 className="w-4 h-4 text-life-green" />}
            <span className="hidden md:inline">{muted ? 'Muted' : 'Audio On'}</span>
          </button>

          {/* Mission Log Archive button */}
          <button
            onClick={() => {
              sound.playClick()
              onOpenArchive()
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                       bg-nasa-blue/30 border border-nasa-blue/50 hover:bg-nasa-blue/60 text-starfield
                       transition-colors cursor-pointer"
            aria-label="Open Mission Log Archive"
          >
            <History className="w-4 h-4 text-shield-cyan" />
            <span>Mission Log</span>
            {history.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-sol-gold/20 text-sol-gold text-[10px] font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Artemis 4-Track Telemetry Gauges ──────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GAUGES.map(({ key, label, emoji, icon: Icon, barBg, textColor, borderNormal }) => {
          const val = Math.round(resources[key] ?? 0)
          const isWarning = val <= 30 && val > 15
          const isDanger = val <= 15

          const gaugeBorder = isDanger
            ? 'border-alert-red shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
            : isWarning
            ? 'border-sol-gold/60 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
            : borderNormal

          return (
            <div
              key={key}
              className={`p-3 rounded-xl bg-space-deep/80 border ${gaugeBorder} backdrop-blur-md transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm" role="img" aria-label={label}>{emoji}</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-starfield/70">
                    {label}
                  </span>
                </div>
                <span className={`font-mono text-sm font-bold ${isDanger ? 'text-alert-red animate-pulse' : textColor}`}>
                  {val}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full rounded-full bg-space-black/70 overflow-hidden p-0.5 border border-white/5">
                <div
                  className={`h-full rounded-full ${barBg} transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                />
              </div>

              {/* Status caption */}
              <div className="mt-1 flex items-center justify-between font-mono text-[10px]">
                <span className="text-starfield/40">
                  {isDanger ? 'CRITICAL' : isWarning ? 'WARNING' : 'NOMINAL'}
                </span>
                <span className="text-starfield/40">-5/sol</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Mission Critical Alert Banner (if any) ────────────────────── */}
      {isCritical && phase !== 'game_over' && (
        <div className="px-4 py-2.5 rounded-xl bg-alert-red/15 border border-alert-red/50 flex items-center gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-alert-red shrink-0" />
          <p className="font-mono text-xs text-alert-red">
            <strong>CRITICAL WARNING:</strong> Life support or shield telemetry below safe thresholds! Make strategic decisions to preserve crew survival.
          </p>
        </div>
      )}

      {/* ── Briefing Phase: Scan & Begin Sol ──────────────────────────── */}
      {phase === 'briefing' && (
        <div className="p-6 rounded-2xl bg-space-deep/90 border border-nasa-blue/40 shadow-xl backdrop-blur-md text-center">
          <div className="inline-flex p-3 rounded-full bg-nasa-blue/30 text-shield-cyan mb-3">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="font-display text-lg sm:text-xl text-starfield tracking-wider mb-2">
            Incoming Sol {sol} Telemetry Transmission
          </h2>
          <p className="font-mono text-xs sm:text-sm text-starfield/70 max-w-xl mx-auto mb-5 leading-relaxed">
            NASA Deep Space Network is beaming current telemetry from surface sensors and DONKI space-weather satellites. Review the impending conditions and issue command decisions.
          </p>
          <button
            onClick={handleStartSol}
            className="px-6 py-3 rounded-xl font-display text-sm tracking-widest uppercase
                       bg-gradient-to-r from-nasa-blue to-shield-cyan text-starfield font-bold
                       shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                       hover:scale-102 transition-all cursor-pointer"
          >
            🛰️ Analyze Telemetry & Deploy Orders
          </button>
        </div>
      )}

      {/* ── Active Event Phase: Dynamic NASA Event Card ──────────────── */}
      {phase === 'event' && currentEvent && (
        <div className="p-5 sm:p-6 rounded-2xl bg-space-deep/95 border border-shield-cyan/40 shadow-2xl backdrop-blur-md space-y-4">
          {/* Event Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-sol-gold/20 text-sol-gold font-bold">
                SOL {sol} INCIDENT
              </span>
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-nasa-red/20 text-nasa-red font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Hazard Level {currentEvent.hazardLevel}/5
              </span>
            </div>

            <span className="font-mono text-xs text-shield-cyan/90 bg-shield-cyan/10 px-2.5 py-1 rounded-md border border-shield-cyan/20">
              {currentEvent.sourceDataset}
            </span>
          </div>

          {/* Event Title & Scenario */}
          <div>
            <h3 className="font-display text-lg sm:text-xl text-starfield font-bold tracking-wide mb-2">
              {currentEvent.title}
            </h3>
            <p className="font-mono text-xs sm:text-sm text-starfield/80 leading-relaxed">
              {currentEvent.scenarioDescription}
            </p>
          </div>

          {/* Real Live Data Note (if DONKI returned live telemetry) */}
          {currentEvent.liveDataNote && (
            <div className="px-3.5 py-2 rounded-lg bg-nasa-blue/20 border border-nasa-blue/40 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sol-gold shrink-0" />
              <p className="font-mono text-[11px] text-sol-gold">
                {currentEvent.liveDataNote}
              </p>
            </div>
          )}

          {/* 2 Distinct Trade-off Choices */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-starfield/60">
                Commander's Action Order (Select 1 of 2):
              </span>
              <span className="font-mono text-[11px] text-alert-red/80">
                ⚖️ Every decision requires trade-offs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentEvent.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice.id)}
                  className="p-4 rounded-xl text-left bg-space-black/60 border border-nasa-blue/40
                             hover:border-sol-gold hover:bg-space-deep/90 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)]
                             transition-all duration-200 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-display text-sm text-starfield group-hover:text-sol-gold transition-colors font-semibold mb-1">
                      {choice.label}
                    </h4>
                    <p className="font-mono text-xs text-starfield/70 leading-relaxed mb-3">
                      {choice.description}
                    </p>
                  </div>

                  {/* Effects Trade-off Tags */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
                    {Object.entries(choice.effects).map(([res, val]) => {
                      if (val === 0) return null
                      const isPos = val > 0
                      const emoji = res === 'power' ? '⚡' : res === 'oxygen' ? '💨' : res === 'shields' ? '🛡️' : '🌱'
                      return (
                        <span
                          key={res}
                          className={`font-mono text-[11px] px-2 py-0.5 rounded font-semibold ${
                            isPos ? 'bg-life-green/20 text-life-green' : 'bg-alert-red/20 text-alert-red'
                          }`}
                        >
                          {emoji} {isPos ? `+${val}%` : `${val}%`}
                        </span>
                      )
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible NASA Science Behind This Decision Badge */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                sound.playClick()
                setScienceExpanded(!scienceExpanded)
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl
                         bg-nasa-blue/20 hover:bg-nasa-blue/30 border border-nasa-blue/30
                         text-starfield text-xs font-mono transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 text-shield-cyan">
                <Info className="w-4 h-4" />
                <span className="font-semibold uppercase tracking-wider">
                  NASA Science Behind This Decision (Ages 7–12)
                </span>
              </div>
              {scienceExpanded ? <ChevronUp className="w-4 h-4 text-shield-cyan" /> : <ChevronDown className="w-4 h-4 text-shield-cyan" />}
            </button>

            {scienceExpanded && (
              <div className="mt-2.5 p-4 rounded-xl bg-space-black/70 border border-shield-cyan/30 animate-in fade-in duration-200">
                <p className="font-mono text-xs text-starfield/90 leading-relaxed">
                  {currentEvent.scienceNote}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Choice Made / Outcome Review Phase ───────────────────────── */}
      {phase === 'choice_made' && currentChoice && (
        <div className="p-5 sm:p-6 rounded-2xl bg-space-deep/95 border border-life-green/40 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-life-green">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-display text-base tracking-wide uppercase font-bold">
              Orders Executed: {currentChoice.label}
            </h3>
          </div>

          <p className="font-mono text-xs sm:text-sm text-starfield/90 leading-relaxed p-3.5 rounded-xl bg-space-black/50 border border-white/5">
            {currentChoice.outcomeText}
          </p>

          {/* Compound effects summary */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-starfield/70">
            <span>Net Sol Impact (Including -5% life support drain):</span>
            {Object.entries(currentChoice.effects).map(([res, val]) => {
              const drain = res === 'shields' ? -3 : res === 'food' ? -4 : -5
              const net = val + drain
              const isPos = net > 0
              const emoji = res === 'power' ? '⚡' : res === 'oxygen' ? '💨' : res === 'shields' ? '🛡️' : '🌱'
              return (
                <span
                  key={res}
                  className={`px-2 py-0.5 rounded font-bold ${
                    isPos ? 'bg-life-green/20 text-life-green' : 'bg-alert-red/20 text-alert-red'
                  }`}
                >
                  {emoji} {isPos ? `+${net}%` : `${net}%`}
                </span>
              )
            })}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextSol}
              className="px-6 py-2.5 rounded-xl font-display text-xs tracking-wider uppercase
                         bg-gradient-to-r from-life-green to-emerald-600 text-starfield font-bold
                         shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]
                         hover:scale-102 transition-all cursor-pointer"
            >
              Confirm Orders & Advance to Sol {sol + 1} 🚀
            </button>
          </div>
        </div>
      )}

      {/* ── Mission Debrief Popup (Educational Game Over) ─────────────── */}
      {phase === 'game_over' && gameOverDebrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-space-deep border border-alert-red shadow-[0_0_40px_rgba(239,68,68,0.4)] text-starfield space-y-4">
            <div className="flex items-center gap-3 border-b border-alert-red/30 pb-3">
              <div className="p-2.5 rounded-xl bg-alert-red/20 text-alert-red">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-alert-red">
                  {gameOverDebrief.title}
                </h2>
                <p className="font-mono text-xs text-starfield/60">
                  Mission terminated on Sol {gameOverDebrief.failedOnSol} • Sols Survived: {gameOverDebrief.totalSolsSurvived}
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs text-starfield/90">
              <div className="p-3 rounded-xl bg-space-black/60 border border-white/5">
                <p className="font-bold text-sol-gold mb-1">🔍 Mission Failure Root Cause Analysis:</p>
                <p className="leading-relaxed text-starfield/80">{gameOverDebrief.explanation}</p>
              </div>

              <div className="p-3 rounded-xl bg-nasa-blue/20 border border-nasa-blue/30">
                <p className="font-bold text-shield-cyan mb-1">🚀 Real NASA Engineering Lesson:</p>
                <p className="leading-relaxed text-starfield/80">{gameOverDebrief.nasaLesson}</p>
              </div>

              <div className="p-3 rounded-xl bg-life-green/10 border border-life-green/30">
                <p className="font-bold text-life-green mb-1">💡 Flight Director's Retry Tip:</p>
                <p className="leading-relaxed text-starfield/80">{gameOverDebrief.retryTip}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  sound.playClick()
                  onOpenArchive()
                }}
                className="px-4 py-2 rounded-xl font-mono text-xs bg-space-black/80 border border-white/10 hover:border-sol-gold/50 text-starfield transition-colors cursor-pointer"
              >
                📜 Review Mission Decision Log
              </button>

              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-xl font-display text-xs tracking-wider uppercase
                           bg-gradient-to-r from-nasa-blue to-shield-cyan text-starfield font-bold
                           shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-102 transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Initialize New Expedition (Sol 1)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Victory Screen: Survived Past Sol 10 ──────────────────────── */}
      {phase === 'victory' && scoreData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/85 backdrop-blur-md animate-in zoom-in-95 duration-300">
          <div className="w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-space-deep border border-sol-gold shadow-[0_0_50px_rgba(251,191,36,0.4)] text-starfield text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-sol-gold/20 text-sol-gold mb-1">
              <Trophy className="w-12 h-12" />
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-sol-gold tracking-widest text-glow">
              MISSION ACCOMPLISHED!
            </h2>
            <p className="font-mono text-xs sm:text-sm text-starfield/80 max-w-md mx-auto">
              Outstanding leadership, Commander! You have successfully commanded Outpost Sol-1 through 10 full Martian sols, managing space weather, life support, and extreme deep-space hazards.
            </p>

            {/* Score & Rank Card */}
            <div className="p-4 rounded-xl bg-space-black/70 border border-sol-gold/30 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-starfield/60">
                NASA Flight Evaluation Grade
              </span>
              <p className="font-display text-xl text-shield-cyan font-bold">
                {scoreData.grade}
              </p>
              <p className="font-mono text-2xl font-bold text-sol-gold">
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
                📜 View Full Mission Log
              </button>

              <button
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-xl font-display text-xs tracking-wider uppercase
                           bg-gradient-to-r from-sol-gold to-amber-600 text-space-black font-extrabold
                           shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:scale-102 transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Command Another Expedition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

