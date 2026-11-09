/**
 * soundFx.js — Web Audio API Synthetic Sound Engine
 *
 * Provides instant, zero-latency auditory feedback without downloading any
 * audio files. Designed specifically for young astronauts (ages 7–12) to
 * provide responsive tactile cues:
 *   - Button clicks & command confirmations
 *   - Gravity thruster frequency transitions
 *   - Critical low-resource klaxon / alarm pulses
 *   - Victory fanfare and Sol transition whooshes
 *
 * Includes built-in mute/unmute state with local storage persistence.
 */

class SoundEngine {
  constructor() {
    this.ctx = null
    this.muted = false
    // Restore user preference if saved
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('outpost_sol_muted')
        if (saved !== null) {
          this.muted = saved === 'true'
        }
      } catch {
        // Local storage inaccessible
      }
    }
  }

  /** Lazy-initialize AudioContext after user gesture */
  initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  isMuted() {
    return this.muted
  }

  setMuted(val) {
    this.muted = !!val
    try {
      localStorage.setItem('outpost_sol_muted', String(this.muted))
    } catch {
      // Local storage inaccessible
    }
    return this.muted
  }

  toggleMute() {
    return this.setMuted(!this.muted)
  }

  /**
   * Short tactical interface click
   */
  playClick() {
    if (this.muted) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.04)
  }

  /**
   * Affirmative command / decision chirp
   */
  playDecision() {
    if (this.muted) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5 triad

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.04

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.15, start + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.1)
    })
  }

  /**
   * Gravity toggle transition sweep
   * @param {'lunar'|'zero'} mode
   */
  playGravity(mode) {
    if (this.muted) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'

    if (mode === 'zero') {
      // Sweeping upward into weightlessness
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.18)
    } else {
      // Locking down into lunar surface gravity
      osc.frequency.setValueAtTime(480, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.22)
    }

    gain.gain.setValueAtTime(0.14, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.23)
  }

  /**
   * NASA-style dual warning alarm pulse
   */
  playAlarm() {
    if (this.muted) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    const pulses = [0, 0.12]

    pulses.forEach((offset) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + offset

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(880, start)
      osc.frequency.setValueAtTime(740, start + 0.05)

      gain.gain.setValueAtTime(0.12, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.1)
    })
  }

  /**
   * Survived to next Sol propulsion whoosh
   */
  playNextSol() {
    if (this.muted) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(260, now)
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.15)
    osc.frequency.exponentialRampToValueAtTime(390, now + 0.3)

    gain.gain.setValueAtTime(0.02, now)
    gain.gain.linearRampToValueAtTime(0.15, now + 0.12)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
  }

  /**
   * Victory Fanfare: Sol 10 Survival celebration!
   */
  playVictory() {
    if (this.muted) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    // Uplifting arpeggio: C4, G4, C5, E5, G5, C6
    const melody = [
      { f: 261.63, d: 0.12, t: 0 },
      { f: 392.00, d: 0.12, t: 0.12 },
      { f: 523.25, d: 0.14, t: 0.24 },
      { f: 659.25, d: 0.16, t: 0.38 },
      { f: 783.99, d: 0.20, t: 0.54 },
      { f: 1046.50, d: 0.50, t: 0.74 },
    ]

    melody.forEach((note) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + note.t

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(note.f, start)

      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + note.d + 0.02)
    })
  }

  /**
   * Mission Failure / Game Over sound
   */
  playGameOver() {
    if (this.muted) return
    const ctx = this.initCtx()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [
      { f: 330, t: 0 },
      { f: 311.13, t: 0.18 },
      { f: 293.66, t: 0.36 },
      { f: 220, t: 0.56 },
    ]

    notes.forEach((n) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + n.t

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(n.f, start)

      gain.gain.setValueAtTime(0.12, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.28)
    })
  }
}

export const sound = new SoundEngine()
export default sound

