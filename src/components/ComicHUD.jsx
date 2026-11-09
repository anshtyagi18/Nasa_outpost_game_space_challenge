import { Zap, Wind, ShieldCheck, Sprout, Volume2, VolumeX, RotateCcw, BookOpen, AlertTriangle } from 'lucide-react'
import cartoonAudio from '../game/CartoonAudio.js'

export default function ComicHUD({
  currentStageIdx = 0,
  totalStages = 10,
  resources = { power: 75, air: 75, shield: 75, plants: 75 },
  isMuted = false,
  onToggleMute,
  onRestart,
  onOpenScience,
}) {
  const resourceList = [
    { key: 'power', label: 'Power', emoji: '⚡', val: resources.power, color: 'text-sol-gold', bar: 'bg-sol-gold' },
    { key: 'air', label: 'Air', emoji: '💨', val: resources.air, color: 'text-shield-cyan', bar: 'bg-shield-cyan' },
    { key: 'shield', label: 'Shield', emoji: '🛡️', val: resources.shield, color: 'text-life-green', bar: 'bg-life-green' },
    { key: 'plants', label: 'Plants', emoji: '🌱', val: resources.plants, color: 'text-mars-orange', bar: 'bg-mars-orange' },
  ]

  // Survival critical check: is any resource below 30%?
  const isCritical = Object.values(resources).some((v) => v <= 30)

  return (
    <header className="w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5 px-3.5 sm:px-6 py-2.5 rounded-2xl bg-space-deep/90 backdrop-blur-xl border-2 border-slate-700 shadow-xl select-none relative z-10">
      {/* ── Left: Branding & 10 Stage Bubbles ── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div>
          <h1 className="font-display text-xs sm:text-sm font-black text-starfield tracking-wider uppercase flex items-center gap-1.5">
            <span>SAVE THE ASTRONAUT!</span>
            <span className="text-sol-gold">🚀</span>
          </h1>
          <p className="font-mono text-[10px] text-shield-cyan/80">
            Mission {currentStageIdx + 1} of {totalStages}
          </p>
        </div>

        {/* 10 Stage Bubbles */}
        <div className="flex items-center gap-1 sm:gap-1.5 ml-1 flex-wrap">
          {Array.from({ length: totalStages }).map((_, i) => {
            const isDone = i < currentStageIdx
            const isCurrent = i === currentStageIdx

            return (
              <div
                key={i}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-mono text-[9px] sm:text-[10px] font-bold border transition-all duration-300 ${
                  isCurrent
                    ? 'bg-sol-gold text-space-black border-sol-gold shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110 animate-pulse'
                    : isDone
                    ? 'bg-life-green text-space-black border-life-green'
                    : 'bg-space-black/60 text-starfield/40 border-white/10'
                }`}
                title={`Mission Stage ${i + 1}`}
              >
                {isDone ? '✓' : i + 1}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Center: 4 Core Status Indicators with Survival Warning ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {resourceList.map((res) => {
          const clamped = Math.max(0, Math.min(100, Math.round(res.val)))
          const isLow = clamped <= 30

          return (
            <div key={res.key} className="flex flex-col min-w-[50px] sm:min-w-[65px]">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={isLow ? 'animate-bounce' : ''}>{res.emoji}</span>
                <span className={`font-bold ${isLow ? 'text-alert-red animate-pulse' : res.color}`}>
                  {clamped}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-space-black overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full ${isLow ? 'bg-alert-red animate-pulse' : res.bar} transition-all duration-500`}
                  style={{ width: `${clamped}%` }}
                />
              </div>
            </div>
          )
        })}

        {isCritical && (
          <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-alert-red/20 border border-alert-red text-alert-red font-mono text-[10px] font-bold animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>VITALS CRITICAL!</span>
          </div>
        )}
      </div>

      {/* ── Right: Action Buttons ── */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Science Dossier Button */}
        <button
          onClick={onOpenScience}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl font-mono text-xs bg-space-black/60 border border-shield-cyan/40 text-shield-cyan hover:border-shield-cyan hover:bg-shield-cyan/10 transition-colors cursor-pointer"
          title="Open NASA Science Facts"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Science</span>
        </button>

        {/* Audio Mute */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-xl bg-space-black/60 border border-white/10 text-starfield/70 hover:text-starfield hover:bg-white/5 transition-colors cursor-pointer"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-alert-red" /> : <Volume2 className="w-4 h-4 text-life-green" />}
        </button>

        {/* Restart Story */}
        <button
          onClick={onRestart}
          className="p-1.5 rounded-xl bg-space-black/60 border border-white/10 text-starfield/70 hover:text-starfield hover:bg-white/5 transition-colors cursor-pointer"
          title="Restart from Stage 1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
