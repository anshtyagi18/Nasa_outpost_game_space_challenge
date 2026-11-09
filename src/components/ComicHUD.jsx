import { Zap, Wind, ShieldCheck, Sprout, Volume2, VolumeX, RotateCcw, BookOpen } from 'lucide-react'
import cartoonAudio from '../game/CartoonAudio.js'

export default function ComicHUD({
  currentStageIdx = 0,
  totalStages = 5,
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

  return (
    <header className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 rounded-2xl bg-space-deep/90 backdrop-blur-xl border-2 border-slate-700 shadow-xl select-none">
      {/* ── Left: Branding & Stage Bubbles ── */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-display text-xs sm:text-sm font-black text-starfield tracking-wider uppercase">
            SAVE THE ASTRONAUT! 🚀
          </h1>
          <p className="font-mono text-[10px] text-shield-cyan/80">
            NASA Sol-1 Dilemmas
          </p>
        </div>

        {/* Stage Bubbles (1 to 5) */}
        <div className="flex items-center gap-1.5 ml-2">
          {Array.from({ length: totalStages }).map((_, i) => {
            const isDone = i < currentStageIdx
            const isCurrent = i === currentStageIdx

            return (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border ${
                  isCurrent
                    ? 'bg-sol-gold text-space-black border-sol-gold shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse'
                    : isDone
                    ? 'bg-life-green text-space-black border-life-green'
                    : 'bg-space-black/60 text-starfield/40 border-white/10'
                }`}
              >
                {isDone ? '✓' : i + 1}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Center: 4 Core Status Indicators ── */}
      <div className="flex items-center gap-2 sm:gap-4">
        {resourceList.map((res) => {
          const clamped = Math.max(0, Math.min(100, Math.round(res.val)))
          return (
            <div key={res.key} className="flex flex-col min-w-[55px] sm:min-w-[70px]">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span>{res.emoji}</span>
                <span className={`font-bold ${res.color}`}>{clamped}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-space-black overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full ${res.bar} transition-all duration-500`}
                  style={{ width: `${clamped}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Right: Action Buttons ── */}
      <div className="flex items-center gap-2">
        {/* Science Dossier Button */}
        <button
          onClick={onOpenScience}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-mono text-xs bg-space-black/60 border border-shield-cyan/40 text-shield-cyan hover:border-shield-cyan transition-colors cursor-pointer"
          title="Open NASA Science Facts"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Science</span>
        </button>

        {/* Audio Mute */}
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-xl bg-space-black/60 border border-white/10 text-starfield/70 hover:text-starfield transition-colors cursor-pointer"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-alert-red" /> : <Volume2 className="w-4 h-4 text-life-green" />}
        </button>

        {/* Restart Story */}
        <button
          onClick={onRestart}
          className="p-1.5 rounded-xl bg-space-black/60 border border-white/10 text-starfield/70 hover:text-starfield transition-colors cursor-pointer"
          title="Restart from Stage 1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
