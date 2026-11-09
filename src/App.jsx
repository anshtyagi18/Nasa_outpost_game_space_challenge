import { useState, useEffect } from 'react'
import './App.css'
import StarfieldCanvas from './components/StarfieldCanvas.jsx'
import MissionBanner from './components/MissionBanner.jsx'
import OutpostCanvas from './components/OutpostCanvas.jsx'
import MissionControlHud from './components/MissionControlHud.jsx'
import MissionLogArchive from './components/MissionLogArchive.jsx'
import useGameLoop from './hooks/useGameLoop.js'

/**
 * Root Application Shell for Outpost Sol-1: Mission Commander
 *
 * NASA Space Apps Challenge Edition
 * Target Audience: Kids aged 7–12
 *
 * Composes:
 *  1. StarfieldCanvas   — Three.js deep-space background
 *  2. MissionBanner     — Artemis-style branding & mission identity
 *  3. OutpostCanvas     — Interactive Matter.js physics surface with Lunar / Zero-G
 *  4. MissionControlHud — Real-time telemetry, DONKI event decisions, debriefs
 *  5. MissionLogArchive — Interactive flight log drawer with compound cost analytics
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

  // Attempt live NASA DONKI data enrichment on mount (falls back seamlessly offline)
  useEffect(() => {
    loadNasaData()
  }, [loadNasaData])

  return (
    <div id="app-root" className="relative min-h-screen bg-space-black text-starfield font-body selection:bg-nasa-blue selection:text-white">
      {/* Three.js Deep Space Parallax Canvas */}
      <StarfieldCanvas />

      {/* Main Mission Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header>
          <MissionBanner />
        </header>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-12 space-y-6">
          {/* Interactive Matter.js Surface Physics Canvas */}
          <section aria-label="Outpost Surface Physical Simulator">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-mono text-xs uppercase tracking-wider text-starfield/60">
                Surface Sector 01: Physical Telemetry
              </span>
              <span className="font-mono text-[11px] text-shield-cyan/80">
                Interactive Multi-Module Array
              </span>
            </div>
            <OutpostCanvas resources={state.resources} />
          </section>

          {/* Artemis Mission Control HUD */}
          <section aria-label="Mission Operations Deck">
            <MissionControlHud
              state={state}
              startSol={startSol}
              makeChoice={makeChoice}
              nextSol={nextSol}
              resetGame={resetGame}
              onOpenArchive={() => setIsArchiveOpen(true)}
            />
          </section>
        </main>

        {/* Mission Footer */}
        <footer className="relative z-10 border-t border-nasa-blue/20 bg-space-deep/80 backdrop-blur-md py-4 px-6 text-center text-xs font-mono text-starfield/50">
          <p>
            Outpost Sol-1: Mission Commander • Built for the NASA Space Apps Challenge
          </p>
          <p className="text-[10px] text-starfield/40 mt-1">
            Data sourced from NASA Open APIs: DONKI Space Weather, Mars InSight, Curiosity & OSDR
          </p>
        </footer>
      </div>

      {/* Interactive Decision Archive Drawer */}
      <MissionLogArchive
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        history={state.history}
        currentSol={state.sol}
      />
    </div>
  )
}
