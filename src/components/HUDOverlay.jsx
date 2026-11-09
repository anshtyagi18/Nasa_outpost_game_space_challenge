import {
  Zap,
  Wind,
  ShieldCheck,
  Heart,
  Flame,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Radio,
  BookOpen,
} from 'lucide-react'
import sound from '../game/SoundFX.js'

export default function HUDOverlay({
  telemetry,
  isPaused,
  onTogglePause,
  onToggleMute,
  isMuted,
  onOpenScience,
}) {
  if (!telemetry) return null

  const {
    sol = 1,
    solProgress = 0,
    score = 0,
    playerHp = 100,
    playerMaxHp = 100,
    dashCd = 0,
    dashCdMax = 2.8,
    xp = 0,
    xpToNext = 50,
    level = 1,
    carried = { power: 0, oxygen: 0, shield: 0 },
    base = { power: 85, oxygen: 85, shields: 85 },
  } = telemetry

  const totalCarried = carried.power + carried.oxygen + carried.shield
  const xpRatio = Math.min(100, (xp / xpToNext) * 100)
  const hpRatio = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100))
  const dashReady = dashCd <= 0

  const isBaseLow = base.power <= 25 || base.oxygen <= 25 || base.shields <= 25

  return (
    <div className="w-full h-full pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5">
      {/* ── Top Edge: Full-Width XP Progress Bar ─────────────────────── */}
      <div className="pointer-events-auto w-full max-w-4xl mx-auto flex items-center gap-3 bg-space-deep/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-purple-500/30 shadow-lg">
        <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold tracking-wider shrink-0">
          LVL {level}
        </span>

        {/* XP Bar */}
        <div className="flex-1 h-2.5 rounded-full bg-space-black/80 overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all duration-300 shadow-[0_0_10px_rgba(192,132,252,0.8)]"
            style={{ width: `${xpRatio}%` }}
          />
        </div>

        <span className="font-mono text-[11px] text-purple-300/80 shrink-0">
          {xp} / {xpToNext} XP
        </span>
      </div>

      {/* ── Upper Flight Deck: Base Telemetry & Controls ─────────────── */}
      <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Left: Sol Cycle & Score */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-space-deep/90 backdrop-blur-xl border border-white/15 shadow-xl">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-shield-cyan animate-pulse" />
            <span className="font-display text-sm tracking-wider text-starfield font-bold">
              SOL {sol}
            </span>
            <span className="font-mono text-xs text-starfield/50">/ 10</span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          {/* Sol timer circular bar */}
          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-sol-gold transition-all duration-300"
              style={{ width: `${solProgress}%` }}
            />
          </div>

          <div className="h-4 w-px bg-white/20" />

          <span className="font-mono text-xs text-sol-gold font-bold">
            {score} PTS
          </span>
        </div>

        {/* Center: Central Base Life Support Meters */}
        <div
          className={`flex items-center gap-2 sm:gap-4 px-4 py-2 rounded-2xl bg-space-deep/90 backdrop-blur-xl border ${
            isBaseLow
              ? 'border-alert-red shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
              : 'border-nasa-blue/40'
          }`}
        >
          <span className="hidden md:inline font-mono text-[10px] uppercase tracking-wider text-starfield/60">
            Outpost Sol-1 Base:
          </span>

          {/* Base Power */}
          <div className="flex items-center gap-1.5 min-w-[70px]">
            <Zap className="w-3.5 h-3.5 text-sol-gold shrink-0" />
            <div className="flex-1">
              <div className="h-2 w-full rounded-full bg-space-black/80 overflow-hidden">
                <div
                  className="h-full bg-sol-gold transition-all duration-300"
                  style={{ width: `${Math.round(base.power)}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-[10px] text-sol-gold font-bold">
              {Math.round(base.power)}%
            </span>
          </div>

          {/* Base Oxygen */}
          <div className="flex items-center gap-1.5 min-w-[70px]">
            <Wind className="w-3.5 h-3.5 text-shield-cyan shrink-0" />
            <div className="flex-1">
              <div className="h-2 w-full rounded-full bg-space-black/80 overflow-hidden">
                <div
                  className="h-full bg-shield-cyan transition-all duration-300"
                  style={{ width: `${Math.round(base.oxygen)}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-[10px] text-shield-cyan font-bold">
              {Math.round(base.oxygen)}%
            </span>
          </div>

          {/* Base Shields */}
          <div className="flex items-center gap-1.5 min-w-[70px]">
            <ShieldCheck className="w-3.5 h-3.5 text-life-green shrink-0" />
            <div className="flex-1">
              <div className="h-2 w-full rounded-full bg-space-black/80 overflow-hidden">
                <div
                  className="h-full bg-life-green transition-all duration-300"
                  style={{ width: `${Math.round(base.shields)}%` }}
                />
              </div>
            </div>
            <span className="font-mono text-[10px] text-life-green font-bold">
              {Math.round(base.shields)}%
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Science Dossier */}
          <button
            onClick={onOpenScience}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs bg-space-deep/90 border border-shield-cyan/40 text-shield-cyan hover:border-shield-cyan transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Science</span>
          </button>

          {/* Sound Mute */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-space-deep/90 border border-white/15 text-starfield/70 hover:text-starfield transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-alert-red" /> : <Volume2 className="w-4 h-4 text-life-green" />}
          </button>

          {/* Pause */}
          <button
            onClick={onTogglePause}
            className="p-2 rounded-xl bg-space-deep/90 border border-white/15 text-starfield/70 hover:text-starfield transition-colors cursor-pointer"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4 text-sol-gold" /> : <Pause className="w-4 h-4 text-starfield" />}
          </button>
        </div>
      </div>

      {/* ── Center Prompt: Carried Salvage Alert (Return to Base!) ─────── */}
      {totalCarried > 0 && (
        <div className="pointer-events-none mx-auto mb-2 animate-bounce">
          <div className="px-5 py-2.5 rounded-2xl bg-space-deep/95 border-2 border-life-green shadow-[0_0_25px_rgba(34,197,94,0.4)] flex items-center gap-3">
            <span className="text-xl">🚀</span>
            <div>
              <p className="font-display text-xs text-life-green font-bold tracking-wider uppercase">
                CARRIED SALVAGE: +{carried.power}⚡ +{carried.oxygen}💨 +{carried.shield}🛡️
              </p>
              <p className="font-mono text-[10px] text-starfield/70">
                Drive into Outpost Sol-1 center circle to deposit & recharge!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Edge: Rover HP, Dash Boost & Controls ─────────────── */}
      <div className="pointer-events-auto flex flex-wrap items-end justify-between gap-3 pb-1">
        {/* Rover Hull HP & Dash Indicator */}
        <div className="p-3.5 rounded-2xl bg-space-deep/90 backdrop-blur-xl border border-white/15 shadow-xl space-y-2 min-w-[220px]">
          {/* Rover HP */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-starfield/80 flex items-center gap-1.5 font-bold">
              <Heart className="w-3.5 h-3.5 text-alert-red fill-alert-red" />
              ROVER HULL
            </span>
            <span className="font-mono font-bold text-starfield">
              {Math.round(playerHp)} / {playerMaxHp}
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-space-black overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                hpRatio > 40 ? 'bg-life-green' : 'bg-alert-red animate-pulse'
              }`}
              style={{ width: `${hpRatio}%` }}
            />
          </div>

          {/* Dash / Boost Cooldown */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="font-mono text-starfield/60">
              [SPACE] THRUSTER BOOST:
            </span>
            <span
              className={`font-mono font-bold ${
                dashReady ? 'text-shield-cyan animate-pulse' : 'text-starfield/40'
              }`}
            >
              {dashReady ? 'READY ⚡' : `${dashCd.toFixed(1)}s`}
            </span>
          </div>
        </div>

        {/* Control Hints for Kids */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-space-deep/80 backdrop-blur-md border border-white/10 text-xs font-mono text-starfield/60">
          <span>🎮 Move: <strong>WASD</strong> or <strong>Arrow Keys</strong></span>
          <span>•</span>
          <span>🚀 Dash: <strong>SPACE</strong></span>
          <span>•</span>
          <span>🎯 Auto-Laser: <strong>ON</strong></span>
        </div>
      </div>
    </div>
  )
}
