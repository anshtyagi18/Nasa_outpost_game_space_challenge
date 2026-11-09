/**
 * gameEngine.js — Core State Machine for Outpost Sol-1: Mission Commander
 *
 * Manages the complete game lifecycle:
 *   • 4 resource tracks with independent drain/recovery rates
 *   • Turn-based Sol progression with event → choice → outcome loop
 *   • Game-over detection with educational debrief for each failure mode
 *   • Passive life-support drain simulating real outpost operations
 *
 * Design principles:
 *   - Pure functions: state in, state out — no mutations, no side effects.
 *   - Deterministic: same inputs always produce the same outputs.
 *   - Serializable: entire state can be JSON.stringify'd for save/load.
 *
 * Resource model inspired by real NASA ECLSS (Environmental Control & Life
 * Support System) on the ISS and planned Lunar Gateway systems.
 */

import { pickEventForSol, CURATED_EVENTS } from '../data/nasaDatasets.js'

// ─── Constants ──────────────────────────────────────────────────────────

/** Starting value for all resources (percentage 0–100). */
const INITIAL_RESOURCE_VALUE = 75

/** Maximum resource capacity. */
const MAX_RESOURCE = 100

/** Minimum resource value — hitting 0 triggers game over. */
const MIN_RESOURCE = 0

/**
 * Passive drain per sol — the baseline cost of keeping the outpost alive.
 * Represents oxygen recycling, power for heating, shield degradation from
 * cosmic background radiation, and food consumption by the crew.
 */
const SOL_DRAIN = {
  power: -5,
  oxygen: -5,
  shields: -3,
  food: -4,
}

/**
 * Mapping of resource keys to display information.
 */
export const RESOURCE_META = {
  power: {
    label: 'Power',
    emoji: '⚡',
    unit: '%',
    description: 'Electrical energy from solar panels and backup generators.',
  },
  oxygen: {
    label: 'Oxygen',
    emoji: '💨',
    unit: '%',
    description: 'Breathable air produced by electrolysis and plant photosynthesis.',
  },
  shields: {
    label: 'Radiation Shielding',
    emoji: '🛡️',
    unit: '%',
    description: 'Protection from solar and cosmic radiation.',
  },
  food: {
    label: 'Biomass / Food',
    emoji: '🌱',
    unit: '%',
    description: 'Food supply from hydroponics, algae, and stored rations.',
  },
}

/**
 * Educational debriefs explaining WHY each resource failure ends the mission.
 * Written at a 4th–6th grade reading level.
 */
const FAILURE_DEBRIEFS = {
  power: {
    title: '⚡ Power Failure — Mission Lost',
    summary: 'Your outpost ran out of electrical power!',
    explanation:
      'Without power, nothing works: no heaters (the outpost freezes), no air recyclers ' +
      '(CO₂ builds up), no communication with Earth, and no lights for the greenhouse. ' +
      'On the ISS, power comes from eight giant solar arrays that span the length of a ' +
      'football field. Even then, the station carries batteries for the 45 minutes of ' +
      'every orbit when Earth blocks the Sun.',
    nasaLesson:
      'NASA\'s lesson: ALWAYS have backup power. The Mars 2020 Perseverance rover uses a ' +
      'nuclear battery (RTG) instead of solar panels, specifically because of dust storms ' +
      'that killed Opportunity\'s solar power in 2018.',
    retryTip:
      'Try conserving power earlier — avoid choosing options that drain power multiple ' +
      'sols in a row. Keep at least 30% power as a safety margin.',
  },
  oxygen: {
    title: '💨 Oxygen Depleted — Mission Lost',
    summary: 'Your crew ran out of breathable air!',
    explanation:
      'A human breathes about 550 liters of oxygen per day. In a sealed outpost, that ' +
      'oxygen must be recycled. The ISS uses a system called the OGS (Oxygen Generation ' +
      'System) that splits water into oxygen and hydrogen using electricity. If the system ' +
      'fails, the crew has emergency oxygen candles — chemical cartridges that burn to ' +
      'release O₂ — but those only last a few hours.',
    nasaLesson:
      'NASA\'s lesson: the Apollo 13 astronauts nearly died when their CO₂ scrubbers ran ' +
      'out. Engineers on Earth invented a fix using cardboard, tape, and a sock — one of ' +
      'the greatest problem-solving moments in space history!',
    retryTip:
      'Watch your oxygen carefully. Plants in the greenhouse produce oxygen — keeping food ' +
      'production healthy helps oxygen too. Avoid sealing the crew in small spaces.',
  },
  shields: {
    title: '🛡️ Radiation Shielding Failed — Mission Lost',
    summary: 'Your radiation shields broke down!',
    explanation:
      'In deep space, there\'s no magnetic field or thick atmosphere to block radiation. ' +
      'Cosmic rays and solar particle events can damage DNA and electronics. Without ' +
      'shielding, the crew would receive a dangerous radiation dose within days. NASA ' +
      'measures radiation in "millisieverts" (mSv). The annual limit for astronauts is ' +
      '500 mSv — about 100x more than what a person on Earth receives.',
    nasaLesson:
      'NASA\'s lesson: The Orion spacecraft uses the densest parts of the vehicle — like ' +
      'water tanks and supply containers — as radiation shields. Smart design means using ' +
      'things you already need as protection. It\'s called "multi-functional structures."',
    retryTip:
      'Radiation shielding degrades slowly from cosmic rays even without events. Try to ' +
      'boost shields whenever you can, especially before hazard-level 4–5 events.',
  },
  food: {
    title: '🌱 Food Supply Exhausted — Mission Lost',
    summary: 'Your crew ran out of food!',
    explanation:
      'A crew of 4 astronauts needs about 7.5 kg (16.5 lbs) of food per day. That\'s ' +
      '2,700 kg per year! Carrying all that food from Earth is incredibly expensive, so ' +
      'NASA is developing space farming. On the ISS, astronauts have grown lettuce, ' +
      'radishes, chili peppers, and even flowers. Future missions to Mars will need to ' +
      'grow 50–80% of their food on-site.',
    nasaLesson:
      'NASA\'s lesson: In the Veggie experiment, astronauts discovered that fresh food ' +
      'made them happier and more productive — it wasn\'t just about calories! Growing ' +
      'plants also produces oxygen and helps recycle water. Food production is connected ' +
      'to EVERY other system.',
    retryTip:
      'Protect the greenhouse! Food is connected to oxygen production. When you have a ' +
      'choice between two options, check if one of them helps food AND oxygen together.',
  },
}

// ─── State Factory ──────────────────────────────────────────────────────

/**
 * Possible game phases.
 * @typedef {'briefing'|'event'|'choice_made'|'sol_summary'|'game_over'|'victory'} GamePhase
 */

/**
 * Create the initial game state for a new session.
 *
 * @returns {object} Complete game state, ready for the first sol.
 */
export function createInitialState() {
  return {
    /** Current sol number (1-based, like NASA's Mars mission counting). */
    sol: 1,

    /** Total number of ticks/choices made. */
    totalChoicesMade: 0,

    /** Current phase of the game loop. */
    phase: 'briefing',

    /** The 4 core resources — all start at 75% to create urgency. */
    resources: {
      power:   INITIAL_RESOURCE_VALUE,
      oxygen:  INITIAL_RESOURCE_VALUE,
      shields: INITIAL_RESOURCE_VALUE,
      food:    INITIAL_RESOURCE_VALUE,
    },

    /** Currently active event (null between events). */
    currentEvent: null,

    /** The choice the player made for the current event. */
    currentChoice: null,

    /** History of past sols: [{ sol, event, choiceId, resourcesAfter }] */
    history: [],

    /** Game-over debrief data (null unless phase === 'game_over'). */
    gameOverDebrief: null,

    /** Target sol count to win the game. */
    victorySol: 10,
  }
}

// ─── State Transitions ─────────────────────────────────────────────────

/**
 * Present a new event for the current sol.
 * Transitions: briefing → event
 *
 * @param {object} state          Current game state
 * @param {object[]} [eventPool]  Optional custom event pool
 * @returns {object}              New state with currentEvent populated
 */
export function presentEvent(state, eventPool = CURATED_EVENTS) {
  if (state.phase !== 'briefing') return state

  const event = pickEventForSol(state.sol, eventPool)
  return {
    ...state,
    phase: 'event',
    currentEvent: event,
    currentChoice: null,
  }
}

/**
 * Apply the player's choice to the game state.
 * Transitions: event → choice_made
 *
 * This is the core trade-off resolution:
 *   1. Apply the choice's resource effects
 *   2. Apply passive sol drain (life-support costs)
 *   3. Clamp resources to [0, 100]
 *   4. Check for game-over conditions
 *
 * @param {object} state    Current game state (phase must be 'event')
 * @param {string} choiceId The id of the selected choice
 * @returns {object}        New state after applying effects
 */
export function applyChoice(state, choiceId) {
  if (state.phase !== 'event' || !state.currentEvent) return state

  const choice = state.currentEvent.choices.find((c) => c.id === choiceId)
  if (!choice) return state

  // Start with a deep copy of resources
  const newResources = { ...state.resources }

  // 1) Apply choice effects
  for (const [key, delta] of Object.entries(choice.effects)) {
    if (key in newResources) {
      newResources[key] += delta
    }
  }

  // 2) Apply passive sol drain (life-support baseline costs)
  for (const [key, drain] of Object.entries(SOL_DRAIN)) {
    newResources[key] += drain
  }

  // 3) Clamp to valid range
  for (const key of Object.keys(newResources)) {
    newResources[key] = Math.max(MIN_RESOURCE, Math.min(MAX_RESOURCE, newResources[key]))
  }

  // 4) Check for game-over
  const depletedResource = Object.entries(newResources).find(
    ([, value]) => value <= MIN_RESOURCE
  )

  if (depletedResource) {
    const [failedKey] = depletedResource
    const failedHistoryEntry = {
      sol: state.sol,
      eventId: state.currentEvent?.id,
      eventTitle: state.currentEvent?.title,
      hazardLevel: state.currentEvent?.hazardLevel,
      sourceDataset: state.currentEvent?.sourceDataset,
      scenarioDescription: state.currentEvent?.scenarioDescription,
      scienceNote: state.currentEvent?.scienceNote,
      choiceId: choice?.id,
      choiceLabel: choice?.label,
      effects: choice?.effects,
      outcomeText: choice?.outcomeText,
      resourcesAfter: { ...newResources },
      failedResource: failedKey,
    }
    return {
      ...state,
      phase: 'game_over',
      resources: newResources,
      currentChoice: choice,
      totalChoicesMade: state.totalChoicesMade + 1,
      history: [...state.history, failedHistoryEntry],
      gameOverDebrief: {
        ...FAILURE_DEBRIEFS[failedKey],
        failedResource: failedKey,
        failedOnSol: state.sol,
        totalSolsSurvived: state.sol - 1,
        finalResources: { ...newResources },
        lastEvent: state.currentEvent.title,
        lastChoice: choice.label,
      },
    }
  }

  return {
    ...state,
    phase: 'choice_made',
    resources: newResources,
    currentChoice: choice,
    totalChoicesMade: state.totalChoicesMade + 1,
  }
}

/**
 * Advance to the next sol.
 * Transitions: choice_made → briefing (next sol) or → victory
 *
 * Records the completed sol in history and increments the sol counter.
 *
 * @param {object} state  Current state (phase must be 'choice_made')
 * @returns {object}      New state ready for the next sol
 */
export function advanceSol(state) {
  if (state.phase !== 'choice_made') return state

  const historyEntry = {
    sol: state.sol,
    eventId: state.currentEvent?.id,
    eventTitle: state.currentEvent?.title,
    hazardLevel: state.currentEvent?.hazardLevel,
    sourceDataset: state.currentEvent?.sourceDataset,
    scenarioDescription: state.currentEvent?.scenarioDescription,
    scienceNote: state.currentEvent?.scienceNote,
    choiceId: state.currentChoice?.id,
    choiceLabel: state.currentChoice?.label,
    effects: state.currentChoice?.effects,
    outcomeText: state.currentChoice?.outcomeText,
    resourcesAfter: { ...state.resources },
  }

  const nextSol = state.sol + 1

  // Victory check
  if (nextSol > state.victorySol) {
    return {
      ...state,
      phase: 'victory',
      sol: state.sol,
      history: [...state.history, historyEntry],
      currentEvent: null,
      currentChoice: null,
    }
  }

  return {
    ...state,
    phase: 'briefing',
    sol: nextSol,
    history: [...state.history, historyEntry],
    currentEvent: null,
    currentChoice: null,
  }
}

// ─── Query Helpers ──────────────────────────────────────────────────────

/**
 * Get a snapshot of all resources with metadata for display.
 *
 * @param {object} state  Current game state
 * @returns {object[]}    Array of { key, label, emoji, value, status }
 */
export function getResourceDisplay(state) {
  return Object.entries(state.resources).map(([key, value]) => {
    const meta = RESOURCE_META[key]
    let status = 'normal'
    if (value <= 15) status = 'critical'
    else if (value <= 30) status = 'warning'
    else if (value >= 80) status = 'excellent'

    return {
      key,
      label: meta.label,
      emoji: meta.emoji,
      description: meta.description,
      value: Math.round(value),
      status,
    }
  })
}

/**
 * Calculate a mission score based on survival and resource management.
 *
 * @param {object} state  Current game state
 * @returns {object}      { score, grade, breakdown }
 */
export function calculateScore(state) {
  const solBonus = state.sol * 100
  const resourceBonus = Object.values(state.resources).reduce(
    (sum, v) => sum + Math.round(v),
    0
  )
  const choiceEfficiency =
    state.totalChoicesMade > 0
      ? Math.round((resourceBonus / (state.totalChoicesMade * 4)) * 10)
      : 0

  const total = solBonus + resourceBonus + choiceEfficiency

  let grade = '🌟 Mission Specialist'
  if (total >= 1500) grade = '🚀 Flight Director'
  else if (total >= 1200) grade = '🛰️ Mission Commander'
  else if (total >= 900) grade = '👨‍🚀 Senior Astronaut'
  else if (total >= 600) grade = '👩‍🚀 Astronaut'
  else if (total >= 300) grade = '🧑‍🔬 Space Cadet'

  return {
    score: total,
    grade,
    breakdown: {
      solBonus,
      resourceBonus,
      choiceEfficiency,
    },
  }
}

/**
 * Check whether any resource is in a critical state (≤ 15%).
 *
 * @param {object} state  Current game state
 * @returns {string[]}    Array of resource keys that are critical
 */
export function getCriticalResources(state) {
  return Object.entries(state.resources)
    .filter(([, value]) => value <= 15)
    .map(([key]) => key)
}

/**
 * Get a human-readable summary of the current game state.
 * Useful for accessibility and screen readers.
 *
 * @param {object} state  Current game state
 * @returns {string}
 */
export function getStatusSummary(state) {
  const resources = getResourceDisplay(state)
  const resourceText = resources
    .map((r) => `${r.emoji} ${r.label}: ${r.value}%`)
    .join(', ')

  const criticals = getCriticalResources(state)
  const warningText =
    criticals.length > 0
      ? ` ⚠️ CRITICAL: ${criticals.map((k) => RESOURCE_META[k].label).join(', ')}`
      : ''

  return `Sol ${state.sol} | ${resourceText}${warningText}`
}
