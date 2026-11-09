import { useState, useRef, useCallback } from 'react'
import './App.css'
import GameCanvas from './components/GameCanvas.jsx'
import HUDOverlay from './components/HUDOverlay.jsx'
import UpgradeModal from './components/UpgradeModal.jsx'
import DebriefModal from './components/DebriefModal.jsx'
import VictoryModal from './components/VictoryModal.jsx'
import ScienceDossierModal from './components/ScienceDossierModal.jsx'
import VirtualJoystick from './components/VirtualJoystick.jsx'
import sound from './game/SoundFX.js'

/**
 * Space Cadet: Sol Survivors
 * NASA Space Apps Challenge Edition — Tailored for Kids Aged 7–12
 * Inspired by CrazyGames 'Space Survivors'
 */
export default function App() {
  const canvasRef = useRef(null)

  const [telemetry, setTelemetry] = useState(null)
  const [upgradeChoices, setUpgradeChoices] = useState(null)
  const [gameOverData, setGameOverData] = useState(null)
  const [isVictory, setIsVictory] = useState(false)
  const [victoryScore, setVictoryScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isScienceOpen, setIsScienceOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(sound.isMuted())

  // Telemetry broadcast from game loop
  const handleTelemetryUpdate = useCallback((data) => {
    setTelemetry(data)
  }, [])

  // Level Up event → Freeze action & show 3 Arcade Choice Cards
  const handleLevelUp = useCallback((choices) => {
    setUpgradeChoices(choices)
  }, [])

  // Choice selected
  const handleSelectUpgrade = (card) => {
    setUpgradeChoices(null)
    if (canvasRef.current) {
      canvasRef.current.applyUpgrade(card)
    }
  }

  // Game Over event
  const handleGameOver = useCallback((data) => {
    setGameOverData(data)
  }, [])

  // Victory event
  const handleVictory = useCallback((score) => {
    setVictoryScore(score)
    setIsVictory(true)
  }, [])

  // Sol Advance
  const handleSolAdvance = useCallback(() => {}, [])

  // Restart game
  const handleRestart = () => {
    setGameOverData(null)
    setIsVictory(false)
    setUpgradeChoices(null)
    setIsPaused(false)
    if (canvasRef.current) {
      canvasRef.current.restart()
    }
  }

  // Toggle Pause
  const handleTogglePause = () => {
    if (isPaused) {
      canvasRef.current?.resume()
      setIsPaused(false)
    } else {
      canvasRef.current?.pause()
      setIsPaused(true)
    }
  }

  // Toggle Sound
  const handleToggleMute = () => {
    const muted = sound.toggleMute()
    setIsMuted(muted)
  }

  // Virtual Joystick handlers (mobile / touch)
  const handleJoystickMove = (x, y) => {
    canvasRef.current?.setJoystick(x, y)
  }

  const handleJoystickDash = () => {
    canvasRef.current?.triggerDash()
  }

  return (
    <div id="app-root" className="w-screen h-screen overflow-hidden bg-space-black relative select-none">
      {/* ── 2D Canvas Game Engine ── */}
      <GameCanvas
        ref={canvasRef}
        onLevelUp={handleLevelUp}
        onGameOver={handleGameOver}
        onVictory={handleVictory}
        onTelemetryUpdate={handleTelemetryUpdate}
        onSolAdvance={handleSolAdvance}
      />

      {/* ── Arcade HUD Overlay (XP, Base Life Support, Carried Items, Controls) ── */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <HUDOverlay
          telemetry={telemetry}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
          onToggleMute={handleToggleMute}
          isMuted={isMuted}
          onOpenScience={() => setIsScienceOpen(true)}
        />
      </div>

      {/* ── Virtual Joystick & Boost for Tablets & Mobile ── */}
      <VirtualJoystick
        onMove={handleJoystickMove}
        onDash={handleJoystickDash}
      />

      {/* ── Level-Up Arcade Choice Cards Modal ── */}
      {upgradeChoices && (
        <UpgradeModal
          choices={upgradeChoices}
          onSelect={handleSelectUpgrade}
        />
      )}

      {/* ── Educational Mission Debrief Modal (Game Over) ── */}
      {gameOverData && (
        <DebriefModal
          data={gameOverData}
          onRestart={handleRestart}
        />
      )}

      {/* ── Victory Celebration Modal (Sol 10 Survived) ── */}
      {isVictory && (
        <VictoryModal
          score={victoryScore}
          sol={10}
          onRestart={handleRestart}
        />
      )}

      {/* ── NASA Science Dossier Modal ── */}
      <ScienceDossierModal
        isOpen={isScienceOpen}
        onClose={() => setIsScienceOpen(false)}
      />
    </div>
  )
}
