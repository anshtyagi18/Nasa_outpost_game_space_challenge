import { useState, useCallback } from 'react'
import {
  createInitialState,
  presentEvent,
  applyChoice,
  advanceSol,
} from '../engine/GameEngine.js'
import { fetchNasaEvents, CURATED_EVENTS } from '../data/nasaDatasets.js'

/**
 * useGameLoop — React hook that drives the Outpost Sol-1 game state machine.
 *
 * Exposes:
 *   - state        → Full game state object
 *   - startSol     → Begin a new sol (loads event from NASA data engine)
 *   - makeChoice   → Apply a player's choice
 *   - nextSol      → Advance to the next sol after reviewing outcome
 *   - resetGame    → Restart from Sol 1
 *   - eventPool    → The active event pool (may include live NASA data)
 */
export default function useGameLoop() {
  const [state, setState] = useState(createInitialState)
  const [eventPool, setEventPool] = useState(CURATED_EVENTS)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)

  /** Fetch live NASA data (once, on first game start). Resilient — never throws. */
  const loadNasaData = useCallback(async () => {
    setIsLoadingEvents(true)
    try {
      const events = await fetchNasaEvents()
      setEventPool(events)
    } catch {
      // Fallback is already the default — no action needed
    } finally {
      setIsLoadingEvents(false)
    }
  }, [])

  /** Begin a new sol → present an event to the player. */
  const startSol = useCallback(() => {
    setState((prev) => presentEvent(prev, eventPool))
  }, [eventPool])

  /** Apply the player's chosen action. */
  const makeChoice = useCallback((choiceId) => {
    setState((prev) => applyChoice(prev, choiceId))
  }, [])

  /** After reviewing the outcome, advance to the next sol. */
  const nextSol = useCallback(() => {
    setState((prev) => advanceSol(prev))
  }, [])

  /** Reset the entire game to Sol 1. */
  const resetGame = useCallback(() => {
    setState(createInitialState())
  }, [])

  return {
    state,
    startSol,
    makeChoice,
    nextSol,
    resetGame,
    loadNasaData,
    isLoadingEvents,
  }
}
