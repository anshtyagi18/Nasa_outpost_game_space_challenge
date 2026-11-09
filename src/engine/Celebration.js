/**
 * Celebration.js — Canvas-confetti and visual reward feedback
 *
 * Kid-friendly visual celebration effects:
 *   - fireCelebration(): Quick burst on mission decision or milestone
 *   - fireSolComplete(): Side cannon dual stream for completing a sol
 *   - fireVictorySol10(): Grand planetary celebration with starbursts and confetti storms
 */

import confetti from 'canvas-confetti'

/** Quick celebration burst (decision confirmation / minor objective) */
export function fireCelebration() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#fbbf24', '#06b6d4', '#22c55e', '#fc3d21'],
  })
}

/** Mid-tier celebration for surviving a sol */
export function fireSolComplete() {
  const duration = 1200
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#0b3d91', '#fbbf24', '#06b6d4'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#fc3d21', '#06b6d4', '#22c55e'],
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

/**
 * Grand Victory Celebration: Surviving past Sol 10!
 * Launches multiple wave bursts with gold, cyan, emerald, and ruby particles.
 */
export function fireVictorySol10() {
  const count = 200
  const defaults = {
    origin: { y: 0.7 },
  }

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    })
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#fbbf24', '#f59e0b'],
  })
  fire(0.2, {
    spread: 60,
    colors: ['#06b6d4', '#38bdf8'],
  })
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#22c55e', '#a855f7', '#fbbf24'],
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#fc3d21', '#ffffff'],
  })
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#0b3d91', '#fbbf24'],
  })

  // Second celebratory wave 1 second later
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 90,
      spread: 110,
      origin: { y: 0.6, x: 0.5 },
      colors: ['#fbbf24', '#06b6d4', '#22c55e', '#fc3d21', '#f0f9ff'],
    })
  }, 1000)
}
