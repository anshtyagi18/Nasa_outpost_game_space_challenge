import { useEffect } from 'react'
import { X, Atom, Rocket, BookOpen } from 'lucide-react'
import cartoonAudio from '../game/CartoonAudio.js'

export default function ScienceDossierModal({ isOpen, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        if (onClose) {
          cartoonAudio.playClick()
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleClose = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    try {
      cartoonAudio.playClick()
    } catch {}
    if (onClose) {
      onClose()
    }
  }

  const NASA_TOPICS = [
    {
      title: '🛰️ NASA DONKI & Solar Storms',
      fact: 'The Space Weather Database Of Notifications, Knowledge, Information (DONKI) monitors Coronal Mass Ejections (CMEs) and solar flares. In deep space, solar storms travel at up to 1,500 km/s and can fry spacecraft electronics without shielding!',
    },
    {
      title: '🛡️ Lunar & Martian Regolith Armor',
      fact: 'Alien soil ("regolith") contains heavy silicon, aluminum, and iron minerals. Piling 2 meters of regolith over surface habitats protects astronauts from lethal galactic cosmic rays with zero electricity used!',
    },
    {
      title: '🌱 NASA OSDR & Microgravity Hydroponics',
      fact: 'NASA\'s Veggie and Advanced Plant Habitat (APH) on the ISS use special red and blue LED lights to trigger plant phototropism, guiding root and stem growth when zero-gravity cannot.',
    },
    {
      title: '🧥 Multi-Layer Insulation (MLI) Foil',
      fact: 'The James Webb Space Telescope and Apollo landers use shiny gold and aluminized Mylar blankets to bounce 95% of thermal heat back into the spacecraft, staying warm in -200°C freezing space.',
    },
    {
      title: '📡 NASA DSOC Laser Communications',
      fact: 'NASA\'s Deep Space Optical Communications (DSOC) beamed high-definition video from 19 million miles away using invisible near-infrared laser beams—100x faster than traditional radio waves!',
    },
    {
      title: '💧 NASA ECLSS Water Recovery System',
      fact: 'On the International Space Station, NASA\'s Environmental Control and Life Support System (ECLSS) recycles 98% of all astronaut sweat, breath moisture, and urine into drinking water purer than municipal tap water!',
    },
    {
      title: '🦿 Apollo Seismic Science & Lunar Airbags',
      fact: 'Apollo seismometers revealed the Moon rings like a bell during moonquakes! NASA tests inflatable airbag cushions and flexible dampening trusses to absorb seismic shocks without snapping.',
    },
    {
      title: '🌀 Electrostatic Dust Repulsion (EDS)',
      fact: 'Martian soil contains perchlorate salts and sharp glass-like volcanic shards. NASA develops electrostatic shields that produce electric fields to push dust off spacesuits before entering airlocks.',
    },
    {
      title: '⚡ Electro-Thermal Indium Tin Oxide (ITO) Glass',
      fact: 'In deep space, mechanical wipers snap in the vacuum. NASA applies nanometer-thin transparent conductive coatings to spacecraft windows, running micro-currents to melt ice instantly.',
    },
    {
      title: '🚀 NASA DART Planetary Defense',
      fact: 'NASA\'s Double Asteroid Redirection Test (DART) slammed a 500-kg kinetic impactor spacecraft into asteroid Dimorphos at 14,000 mph, proving humans can nudge hazardous asteroids away from Earth!',
    },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-black/90 backdrop-blur-md select-none"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-3xl bg-space-deep border-2 border-shield-cyan/50 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)]
                   p-5 sm:p-7 text-starfield relative overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-shield-cyan/20 border border-shield-cyan/40 text-shield-cyan">
              <Atom className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-shield-cyan font-bold block">
                NASA Open Data Intelligence
              </span>
              <h2 className="font-display text-base sm:text-xl font-bold tracking-wide">
                Space Cadet: Science Dossier (10 Missions)
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2.5 rounded-xl text-starfield/70 hover:text-starfield hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-World Science Topics (All 10 missions scrollable) */}
        <div className="space-y-3 overflow-y-auto pr-2 flex-1 my-2">
          {NASA_TOPICS.map((topic, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-space-black/60 border border-white/10 hover:border-shield-cyan/40 transition-colors">
              <h3 className="font-display text-xs text-shield-cyan uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
                <Rocket className="w-3.5 h-3.5 text-sol-gold" />
                {topic.title}
              </h3>
              <p className="font-mono text-xs text-starfield/80 leading-relaxed">
                {topic.fact}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 mt-2 shrink-0">
          <span className="font-mono text-[10px] text-starfield/50">
            Source: NASA OSDR, DONKI, Planetary Defense & Space Weather Heliophysics
          </span>
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl font-display text-xs tracking-wider uppercase
                       bg-shield-cyan text-space-black font-extrabold hover:bg-shield-cyan/90 transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Back to Mission 🚀
          </button>
        </div>
      </div>
    </div>
  )
}
