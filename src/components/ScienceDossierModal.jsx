import { useEffect } from 'react'
import { X, Atom, Rocket, BookOpen } from 'lucide-react'
import sound from '../game/SoundFX.js'

export default function ScienceDossierModal({ isOpen, onClose }) {
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

  if (!isOpen) return null

  const NASA_TOPICS = [
    {
      title: '🛰️ NASA DONKI & Solar Storms',
      fact: 'The Space Weather Database Of Notifications, Knowledge, Information (DONKI) monitors Coronal Mass Ejections (CMEs) and solar flares. In deep space, solar storms travel at up to 1,500 km/s and can fry spacecraft electronics without magnetic shielding!',
    },
    {
      title: '🛡️ Lunar & Martian Regolith Armor',
      fact: 'Alien soil ("regolith") contains heavy silicon, aluminum, and iron minerals. Piling 2 meters of regolith over surface habitats protects astronauts from lethal galactic cosmic rays!',
    },
    {
      title: '🌱 NASA OSDR & Microgravity Hydroponics',
      fact: 'NASA\'s Veggie and Advanced Plant Habitat (APH) on the ISS use special red and blue LED lights to trigger plant phototropism, guiding root growth when gravity cannot.',
    },
    {
      title: '💧 Water-Wall ECLSS Life Support',
      fact: 'Water is densely packed with hydrogen atoms—the most effective element for absorbing high-speed cosmic protons. The ISS recycles 98% of all water to supply oxygen and radiation shields.',
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md animate-in fade-in select-none"
      onClick={() => {
        sound.playClick()
        onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl bg-space-deep border-2 border-shield-cyan/50 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)]
                   p-6 sm:p-8 text-starfield relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-shield-cyan/20 border border-shield-cyan/40 text-shield-cyan">
              <Atom className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-shield-cyan font-bold block">
                NASA Open Data Intelligence
              </span>
              <h2 className="font-display text-lg sm:text-xl font-bold tracking-wide">
                Space Cadet: Science Dossier
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

        {/* Real-World Science Topics */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {NASA_TOPICS.map((topic, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-space-black/60 border border-white/5">
              <h3 className="font-display text-xs text-shield-cyan uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                <Rocket className="w-3.5 h-3.5" />
                {topic.title}
              </h3>
              <p className="font-mono text-xs text-starfield/80 leading-relaxed">
                {topic.fact}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
          <span className="font-mono text-[10px] text-starfield/50">
            Source: NASA Open Science Data Repository & Heliophysics Science Division
          </span>
          <button
            onClick={() => {
              sound.playClick()
              onClose()
            }}
            className="px-5 py-2 rounded-xl font-display text-xs tracking-wider uppercase
                       bg-shield-cyan text-space-black font-bold hover:bg-shield-cyan/90 transition-colors cursor-pointer"
          >
            Back to Mission
          </button>
        </div>
      </div>
    </div>
  )
}
