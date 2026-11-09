import { useState, useEffect } from 'react'
import './App.css'
import CinematicViewport from './components/CinematicViewport.jsx'
import MissionControlHud from './components/MissionControlHud.jsx'
import ScienceDossierModal from './components/ScienceDossierModal.jsx'
import MissionLogArchive from './components/MissionLogArchive.jsx'
import useGameLoop from './hooks/useGameLoop.js'

/**
 * Root Application Shell for Outpost Sol-1: Mission Commander
 *
 * Cinematic 3D Edition — NASA Space Apps Challenge
 * Tailored for Explorers aged 7–12
 *
 * Visual Architecture:
 *   - Background: 3D Three.js Viewport (Mars, Outpost Modules, Lander, Storm Particles)
 *   - Foreground: Tactical Arcade UI overlay (Tinder/Reigns-style tactile decision cards)
 *   - Modals: Science Dossier (real NASA open data) & Mission Log Archive (compound costs)
 */
export default function App() {
  const {
    state,
    startSol,
    makeChoice,
    nextSol,
    resetGame,
    loadNasaData,
  } = useGameLoop()

  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isScienceOpen, setIsScienceOpen] = useState(false)

  // Fetch live NASA DONKI data on mount (with automatic fallback)
  useEffect(() => {
    loadNasaData()
  }, [loadNasaData])

  // Derive visual 3D simulation triggers
  const power = state.resources.power ?? 75
  const shields = state.resources.shields ?? 75
  const isAlarming = power <= 25 || shields <= 25
  const isHazard =
    state.phase === 'event' && (state.currentEvent?.hazardLevel >= 3 || false)
  const isLanderActive =
    state.phase === 'choice_made' || (state.sol > 1 && state.phase === 'briefing')

  return (
    <div id="app-root" className="w-screen h-screen overflow-hidden bg-space-black text-starfield font-body relative">
      {/* ── Layer 1: Cinematic Interactive 3D Three.js Viewport ───── */}
      <CinematicViewport
        isHazard={isHazard}
        isAlarming={isAlarming}
        isLanderActive={isLanderActive}
      />

      {/* ── Layer 2: Fullscreen Artemis Arcade HUD Overlay ─────────── */}
      <div className="absolute inset-0 z-10 p-3 sm:p-5 pointer-events-none flex flex-col justify-between overflow-hidden">
        <MissionControlHud
          state={state}
          startSol={startSol}
          makeChoice={makeChoice}
          nextSol={nextSol}
          resetGame={resetGame}
          onOpenArchive={() => setIsArchiveOpen(true)}
          onOpenScience={() => setIsScienceOpen(true)}
        />
      </div>

      {/* ── Layer 3: NASA Science Dossier Modal Popup ──────────────── */}
      <ScienceDossierModal
        isOpen={isScienceOpen}
        onClose={() => setIsScienceOpen(false)}
        event={state.currentEvent}
      />

      {/* ── Layer 4: Interactive Mission Log & Decision Archive ─────── */}
      <MissionLogArchive
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        history={state.history}
        currentSol={state.sol}
      />
    </div>
  )
}
