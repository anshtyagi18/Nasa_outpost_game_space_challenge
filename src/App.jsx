import { useState, useEffect } from 'react'
import './App.css'
import { STORY_STAGES } from './data/storyStages.js'
import ComicHUD from './components/ComicHUD.jsx'
import ComicSceneCanvas from './components/ComicSceneCanvas.jsx'
import ChoiceCards from './components/ChoiceCards.jsx'
import OutcomeBanner from './components/OutcomeBanner.jsx'
import ComicVictoryModal from './components/ComicVictoryModal.jsx'
import ScienceDossierModal from './components/ScienceDossierModal.jsx'
import SolarSystem3D from './components/SolarSystem3D.jsx'
import cartoonAudio from './game/CartoonAudio.js'
import confetti from 'canvas-confetti'

/**
 * Save the Astronaut: Sol-1 Dilemmas
 * NASA Space Apps Challenge Edition — Kids Aged 7–12
 * 10 Survival Missions with Real-Time Physical Action Animations & Survival Instincts
 */
export default function App() {
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const [resources, setResources] = useState({ power: 75, air: 75, shield: 75, plants: 75 })
  const [selectedOutcome, setSelectedOutcome] = useState(null)
  const [activeAction, setActiveAction] = useState(null)
  const [actionBanner, setActionBanner] = useState(null)
  const [isVictory, setIsVictory] = useState(false)
  const [isScienceOpen, setIsScienceOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(cartoonAudio.isMuted())
  const [survivalSeconds, setSurvivalSeconds] = useState(25)

  const currentStage = STORY_STAGES[currentStageIdx] || STORY_STAGES[0]

  // Survival Instinct Countdown Timer (25s per stage)
  useEffect(() => {
    if (selectedOutcome || activeAction) return

    const timer = setInterval(() => {
      setSurvivalSeconds((prev) => {
        if (prev <= 1) {
          // Time expired alert: play warning siren and slight pressure penalty
          cartoonAudio.playSiren()
          setResources((r) => ({
            ...r,
            air: Math.max(15, r.air - 5),
            power: Math.max(15, r.power - 5),
          }))
          return 10 // Reset to 10s urgent cycle
        }
        if (prev === 8) {
          // Survival alarm beep
          cartoonAudio.playSiren()
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedOutcome, activeAction, currentStageIdx])

  // Determine current character mood
  let currentMood = currentStage.characterMood
  if (selectedOutcome) {
    currentMood = selectedOutcome.outcomeMood
  } else if (activeAction) {
    currentMood = 'thinking'
  } else if (survivalSeconds <= 8) {
    currentMood = 'scared'
  }

  // When player clicks Choice A or Choice B -> Play Real-Time Action Animation!
  const handleSelectChoice = (choice) => {
    if (activeAction || selectedOutcome) return

    // 1. Trigger action animation & real-time banner
    cartoonAudio.playClick()
    setActiveAction(choice.actionType)
    setActionBanner(choice.actionBanner)

    // 2. Allow 1.6s for real-time visual action before outcome reveals
    setTimeout(() => {
      if (choice.isCorrect) {
        cartoonAudio.playSuccess()

        // Confetti burst
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#22c55e', '#fbbf24', '#06b6d4', '#f59e0b'],
        })

        // Update resources positively
        setResources((prev) => ({
          power: Math.min(100, Math.max(0, prev.power + (choice.resourceDelta.power || 0))),
          air: Math.min(100, Math.max(0, prev.air + (choice.resourceDelta.air || 0))),
          shield: Math.min(100, Math.max(0, prev.shield + (choice.resourceDelta.shield || 0))),
          plants: Math.min(100, Math.max(0, prev.plants + (choice.resourceDelta.plants || 0))),
        }))
      } else {
        cartoonAudio.playFail()

        // Update resources with penalty
        setResources((prev) => ({
          power: Math.min(100, Math.max(0, prev.power + (choice.resourceDelta.power || 0))),
          air: Math.min(100, Math.max(0, prev.air + (choice.resourceDelta.air || 0))),
          shield: Math.min(100, Math.max(0, prev.shield + (choice.resourceDelta.shield || 0))),
          plants: Math.min(100, Math.max(0, prev.plants + (choice.resourceDelta.plants || 0))),
        }))
      }

      setSelectedOutcome(choice)
      setActionBanner(null)
    }, 1600)
  }

  // When player clicks 'Try Again' after a fail
  const handleTryAgain = () => {
    setSelectedOutcome(null)
    setActiveAction(null)
    setActionBanner(null)
    setSurvivalSeconds(25)
  }

  // When player clicks 'Next Stage' after success
  const handleNextStage = () => {
    setSelectedOutcome(null)
    setActiveAction(null)
    setActionBanner(null)
    setSurvivalSeconds(25)

    if (currentStageIdx + 1 >= STORY_STAGES.length) {
      setIsVictory(true)
    } else {
      setCurrentStageIdx((prev) => prev + 1)
      cartoonAudio.playSiren()
    }
  }

  // Restart the whole story (All 10 stages)
  const handleRestart = () => {
    setCurrentStageIdx(0)
    setResources({ power: 75, air: 75, shield: 75, plants: 75 })
    setSelectedOutcome(null)
    setActiveAction(null)
    setActionBanner(null)
    setIsVictory(false)
    setSurvivalSeconds(25)
  }

  // Audio Toggle
  const handleToggleMute = () => {
    const muted = cartoonAudio.toggleMute()
    setIsMuted(muted)
  }

  const isLastStage = currentStageIdx + 1 >= STORY_STAGES.length

  return (
    <div
      id="app-root"
      className="w-full min-h-screen bg-space-black text-starfield font-body relative flex flex-col items-center justify-between p-3 sm:p-5 sm:px-8 select-none overflow-x-hidden"
    >
      {/* ── 3D Real Planets & Animated Solar System Background ── */}
      <SolarSystem3D
        environment={currentStage.environment}
        stageIdx={currentStageIdx}
      />

      {/* ── Top Header HUD (10 Mission Stages) ── */}
      <ComicHUD
        currentStageIdx={currentStageIdx}
        totalStages={STORY_STAGES.length}
        resources={resources}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRestart={handleRestart}
        onOpenScience={() => setIsScienceOpen(true)}
      />

      {/* ── Center Comic Scene Canvas & Animated Leo ── */}
      <main className="w-full max-w-5xl lg:max-w-6xl mx-auto flex-1 flex flex-col justify-center py-2 space-y-3 sm:space-y-4 relative z-10">
        <ComicSceneCanvas
          stage={currentStage}
          currentMood={currentMood}
          outcomeText={actionBanner || (selectedOutcome ? selectedOutcome.outcomeTitle : null)}
          isCorrect={selectedOutcome ? selectedOutcome.isCorrect : null}
          activeAction={activeAction}
          survivalSeconds={survivalSeconds}
        />

        {/* ── Bottom Action Area: Either Choice Cards OR Outcome Result ── */}
        {!selectedOutcome ? (
          <ChoiceCards
            choiceA={currentStage.choiceA}
            choiceB={currentStage.choiceB}
            onSelect={handleSelectChoice}
            disabled={activeAction !== null}
          />
        ) : (
          <OutcomeBanner
            outcome={selectedOutcome}
            onTryAgain={handleTryAgain}
            onNextStage={handleNextStage}
            isLastStage={isLastStage}
          />
        )}
      </main>

      {/* ── Footer Branding & Credit ── */}
      <footer className="w-full max-w-5xl lg:max-w-6xl mx-auto text-center py-2 text-xs font-mono text-starfield/50 relative z-10">
        Save the Astronaut: Sol-1 Dilemmas • NASA Space Apps Challenge Edition • 10 Missions for Junior Explorers (Ages 7–12)
      </footer>

      {/* ── Grand Victory Modal (All 10 Stages Saved) ── */}
      {isVictory && (
        <ComicVictoryModal onRestart={handleRestart} />
      )}

      {/* ── NASA Science Dossier Modal ── */}
      <ScienceDossierModal
        isOpen={isScienceOpen}
        onClose={() => setIsScienceOpen(false)}
      />
    </div>
  )
}
