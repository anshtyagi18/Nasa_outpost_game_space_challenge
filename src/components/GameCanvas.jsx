import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import SolSurvivorEngine from '../game/SolSurvivorEngine.js'

/**
 * GameCanvas — High-Performance 2D HTML5 Canvas Component
 * Renders the top-down alien terrain, player rover, hazard swarms, and particle effects.
 */
const GameCanvas = forwardRef(function GameCanvas(
  {
    onLevelUp,
    onGameOver,
    onVictory,
    onTelemetryUpdate,
    onSolAdvance,
  },
  ref
) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)

  useImperativeHandle(ref, () => ({
    applyUpgrade: (card) => {
      if (engineRef.current) {
        engineRef.current.applyUpgrade(card)
        engineRef.current.resume()
      }
    },
    pause: () => {
      if (engineRef.current) engineRef.current.pause()
    },
    resume: () => {
      if (engineRef.current) engineRef.current.resume()
    },
    restart: () => {
      if (engineRef.current) {
        engineRef.current.unbindEvents()
        engineRef.current.stop()
      }
      if (canvasRef.current) {
        const engine = new SolSurvivorEngine(canvasRef.current, {
          onLevelUp,
          onGameOver,
          onVictory,
          onTelemetryUpdate,
          onSolAdvance,
        })
        engineRef.current = engine
        engine.start()
      }
    },
    setJoystick: (x, y) => {
      if (engineRef.current) {
        engineRef.current.joystick.x = x
        engineRef.current.joystick.y = y
      }
    },
    triggerDash: () => {
      if (engineRef.current) {
        engineRef.current.triggerDash()
      }
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const engine = new SolSurvivorEngine(canvas, {
      onLevelUp,
      onGameOver,
      onVictory,
      onTelemetryUpdate,
      onSolAdvance,
    })
    engineRef.current = engine
    engine.start()

    return () => {
      engine.unbindEvents()
      engine.stop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block bg-space-black"
      style={{ touchAction: 'none' }}
    />
  )
})

export default GameCanvas

