import { useState } from 'react'
import './App.css'
import { STORY_STAGES } from './data/storyStages.js'
import ComicHUD from './components/ComicHUD.jsx'
import ComicSceneCanvas from './components/ComicSceneCanvas.jsx'
import ChoiceCards from './components/ChoiceCards.jsx'
import OutcomeBanner from './components/OutcomeBanner.jsx'
import ComicVictoryModal from './components/ComicVictoryModal.jsx'
import ScienceDossierModal from './components/ScienceDossierModal.jsx'
import cartoonAudio from './game/CartoonAudio.js'
import confetti from 'canvas-confetti'

/**
 * Save the Astronaut: Sol-1 Dilemmas
 * NASA Space Apps Challenge Edition — Kids Aged 7–12
 * Inspired by 'Save the Girl' choice puzzle mechanics
 */
export default function App() {
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const [resources, setResources] = useState({ power: 75, air: 75, shield: 75, plants: 75 })
  const [selectedOutcome, setSelectedOutcome] = useState(null)
  const [isVictory, setIsVictory] = useState(false)
  const [isScienceOpen, setIsScienceOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(cartoonAudio.isMuted())

  const currentStage = STORY_STAGES[currentStageIdx] || STORY_STAGES[0]

  // Determine current character mood
  const currentMood = selectedOutcome
    ? selectedOutcome.outcomeMood
    : currentStage.characterMood

  // When player clicks Choice A or Choice B
  const handleSelectChoice = (choice) => {
    if (choice.isCorrect) {
      cartoonAudio.playSuccess()

      // Quick confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#22c55e', '#fbbf24', '#06b6d4'],
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
  }

  // When player clicks 'Try Again' after a fail
  const handleTryAgain = () => {
    setSelectedOutcome(null)
  }

  // When player clicks 'Next Stage' after success
  const handleNextStage = () => {
    setSelectedOutcome(null)

    if (currentStageIdx + 1 >= STORY_STAGES.length) {
      setIsVictory(true)
    } else {
      setCurrentStageIdx((prev) => prev + 1)
      cartoonAudio.playSiren()
    }
  }

  // Restart the whole story
  const handleRestart = () => {
    setCurrentStageIdx(0)
    setResources({ power: 75, air: 75, shield: 75, plants: 75 })
    setSelectedOutcome(null)
    setIsVictory(false)
  }

  // Audio Toggle
  const handleToggleMute = () => {
    const muted = cartoonAudio.toggleMute()
    setIsMuted(muted)
  }

  const isLastStage = currentStageIdx + 1 >= STORY_STAGES.length

  return (
    <div id="app-root" className="w-screen h-screen overflow-y-auto bg-space-black text-starfield font-body relative flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* ── Top Header HUD ── */}
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
      <main className="w-full max-w-4xl mx-auto my-auto py-2 space-y-3">
        <ComicSceneCanvas
          stage={currentStage}
          currentMood={currentMood}
          outcomeText={selectedOutcome ? selectedOutcome.outcomeTitle : null}
          isCorrect={selectedOutcome ? selectedOutcome.isCorrect : null}
        />

        {/* ── Bottom Action Area: Either Choice Cards OR Outcome Result ── */}
        {!selectedOutcome ? (
          <ChoiceCards
            choiceA={currentStage.choiceA}
            choiceB={currentStage.choiceB}
            onSelect={handleSelectChoice}
            disabled={selectedOutcome !== null}
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
      <footer className="w-full text-center py-1 text-xs font-mono text-starfield/40">
        Save the Astronaut: Sol-1 Dilemmas • NASA Space Apps Challenge Edition • Built for Junior Explorers (Ages 7–12)
      </footer>

      {/* ── Grand Victory Modal (All 5 Stages Saved) ── */}
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
