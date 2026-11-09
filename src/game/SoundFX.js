/**
 * SoundFX.js — Web Audio API Arcade Sound Synthesizer
 *
 * 100% synthetic, zero external assets, ultra-responsive low latency.
 * Built specifically for kids (ages 7–12) for juicy retro arcade feedback.
 */

class SoundFX {
  constructor() {
    this.ctx = null
    this.muted = false
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sol_survivors_muted')
        if (saved !== null) this.muted = saved === 'true'
      } catch {}
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  isMuted() {
    return this.muted
  }

  toggleMute() {
    this.muted = !this.muted
    try {
      localStorage.setItem('sol_survivors_muted', String(this.muted))
    } catch {}
    return this.muted
  }

  /** Auto-firing laser blaster */
  playLaser() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.08)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.08)
  }

  /** Thruster / Dash Boost whoosh */
  playDash() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.12)
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  /** Hazard hit / explosion */
  playExplosion(isBig = false) {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(isBig ? 140 : 200, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + (isBig ? 0.35 : 0.18))

    gain.gain.setValueAtTime(isBig ? 0.25 : 0.14, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isBig ? 0.35 : 0.18))

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + (isBig ? 0.35 : 0.18))
  }

  /** Collecting dropped salvage (varies by item type) */
  playPickup(type = 'xp') {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'

    let startFreq = 523.25 // C5
    let endFreq = 783.99   // G5

    if (type === 'power') {
      startFreq = 659.25; endFreq = 987.77
    } else if (type === 'oxygen') {
      startFreq = 440.00; endFreq = 880.00
    } else if (type === 'shield') {
      startFreq = 392.00; endFreq = 783.99
    }

    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.08)
  }

  /** Triumphant chord when depositing resources at the central base */
  playBaseDeposit() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const chords = [523.25, 659.25, 783.99, 1046.50] // C major chord

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.04

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.01, start)
      gain.gain.linearRampToValueAtTime(0.14, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.16)
    })
  }

  /** Level Up Fanfare */
  playLevelUp() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const notes = [440, 554.37, 659.25, 880, 1108.73]

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + idx * 0.06

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)

      gain.gain.setValueAtTime(0.01, start)
      gain.gain.linearRampToValueAtTime(0.16, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.2)
    })
  }

  /** DONKI Space Weather Hazard Swarm Alarm Siren */
  playSiren() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(650, now)
    osc.frequency.linearRampToValueAtTime(920, now + 0.18)
    osc.frequency.linearRampToValueAtTime(650, now + 0.36)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.38)
  }

  /** Repulsor shockwave */
  playRepulsor() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(320, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.3)

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.3)
  }
}

export const sound = new SoundFX()
export default sound

