import { useEffect } from 'react'
import { X, BookOpen, Atom, Rocket, Sparkles, ExternalLink } from 'lucide-react'
import sound from '../engine/soundFx.js'

/**
 * ScienceDossierModal — Clean modal popup for real NASA research
 * Keeps the main game uncluttered while giving kids & judges deep scientific grounding.
 */
export default function ScienceDossierModal({ isOpen, onClose, event }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        sound.playClick()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !event) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        sound.playClick()
        onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-space-deep border border-shield-cyan/50 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)]
                   p-6 sm:p-8 text-starfield relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-shield-cyan/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-shield-cyan/20 border border-shield-cyan/40 text-shield-cyan">
              <Atom className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-shield-cyan font-bold block">
                NASA Open Data Intelligence
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-wide">
                Mission Science Dossier
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick()
              onClose()
            }}
            className="p-2 rounded-xl text-starfield/60 hover:text-starfield hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Classification */}
        <div className="p-3 rounded-2xl bg-space-black/60 border border-white/10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-sol-gold font-bold">
              {event.title}
            </span>
          </div>
          <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-nasa-blue/40 text-shield-cyan border border-shield-cyan/30">
            {event.sourceDataset}
          </span>
        </div>

        {/* Real-World Engineering Explanation */}
        <div className="space-y-4 mb-6 font-mono text-xs sm:text-sm text-starfield/90 leading-relaxed">
          <div className="p-4 rounded-2xl bg-shield-cyan/10 border border-shield-cyan/20">
            <h3 className="font-display text-xs text-shield-cyan uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Rocket className="w-4 h-4" />
              The Real Spaceflight Science
            </h3>
            <p className="text-starfield/90">
              {event.scienceNote}
            </p>
          </div>

          {event.liveDataNote && (
            <div className="p-3.5 rounded-2xl bg-sol-gold/10 border border-sol-gold/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-sol-gold shrink-0 mt-0.5" />
              <p className="text-xs text-sol-gold/90">
                {event.liveDataNote}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="font-mono text-[10px] text-starfield/50">
            Curated from NASA Open Data APIs (DONKI • InSight • OSDR)
          </span>
          <button
            onClick={() => {
              sound.playClick()
              onClose()
            }}
            className="px-5 py-2 rounded-xl font-display text-xs tracking-wider uppercase
                       bg-shield-cyan text-space-black font-bold hover:bg-shield-cyan/90 transition-colors cursor-pointer"
          >
            Understood, Commander
          </button>
        </div>
      </div>
    </div>
  )
}
