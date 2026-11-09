import { Rocket } from 'lucide-react'

/**
 * Top banner displaying the game title and NASA-inspired branding.
 * Shown on load; will transition to the command deck once the player starts.
 */
export default function MissionBanner() {
  return (
    <header className="flex flex-col items-center justify-center pt-16 pb-8 px-4 text-center select-none">
      <div className="flex items-center gap-3 mb-4">
        <Rocket className="w-8 h-8 text-sol-gold" strokeWidth={1.5} />
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-widest text-starfield text-glow">
          OUTPOST SOL-1
        </h1>
        <Rocket className="w-8 h-8 text-sol-gold rotate-90" strokeWidth={1.5} />
      </div>
      <p className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-shield-cyan/80">
        Mission Commander &mdash; NASA Space Apps Challenge
      </p>
    </header>
  )
}

